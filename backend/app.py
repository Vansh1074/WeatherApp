import os
import requests
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_caching import Cache
from dotenv import load_dotenv
from datetime import datetime
from flask_pymongo import PyMongo
from bson import ObjectId
load_dotenv()

app = Flask(__name__)
CORS(app)

# MongoDB connection string in your .env or config directly
app.config["MONGO_URI"] = os.getenv("MONGO_URI", "mongodb://localhost:27017/weatherApp")

mongo = PyMongo(app)

cache = Cache(app, config={'CACHE_TYPE': 'simple'})

GOOGLE_API_KEY = os.getenv("GOOGLE_WEATHER_API_KEY")

# -------- Convert location type to Lat/Lon --------
@cache.memoize(timeout=3600)
@app.route('/get-coordinates', methods=['GET'])
def get_coordinates():
    search_type = request.args.get('type')
    value = request.args.get('value')
    if not search_type or not value:
        return jsonify({"error": {"message": "Missing type or value"}}), 400

    # Direct GPS coordinate input
    if search_type == "coord":
        try:
            lat, lon = [float(v.strip()) for v in value.split(',')]
            return jsonify({"lat": lat, "lon": lon})
        except Exception as e:
            return jsonify({"error": {"message": "Invalid coordinates format"}}), 400

    # All other types: Geocode through API
    geo_url = f"https://maps.googleapis.com/maps/api/geocode/json?address={value}&key={GOOGLE_API_KEY}"
    resp = requests.get(geo_url).json()
    if resp.get("status") == "OK" and resp.get("results"):
        location = resp['results'][0]['geometry']['location']
        return jsonify({"lat": location['lat'], "lon": location['lng']})
    else:
        error_msg = resp.get("error_message") or "Unable to find location"
        return jsonify({"error": {"message": error_msg}}), 404

# -------- Convert Lat/Lon to Adress--------
@cache.memoize(timeout=3600)
@app.route('/reverse-geocode', methods=['GET'])
def reverse_geocode():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    if not lat or not lon:
        return jsonify({"error": {"message": "Missing latitude or longitude"}}), 400

    geo_url = (
        f"https://maps.googleapis.com/maps/api/geocode/json"
        f"?latlng={lat},{lon}&key={GOOGLE_API_KEY}"
    )

    resp = requests.get(geo_url).json()
    if resp.get("status") == "OK" and resp.get("results"):
        formatted_address = resp['results'][0]['formatted_address']
        # Try to find city in address components
        city = None
        for comp in resp['results'][0]['address_components']:
            if "locality" in comp['types']:
                city = comp['long_name']
                break
        return jsonify({"city": city, "address": formatted_address})
    else:
        return jsonify({"error": {"message": "Unable to get city/address"}}), 404


# -------- Get Current Weather --------
@cache.memoize(timeout=600)
@app.route('/weather', methods=['GET'])
def get_weather():
    lat = request.args.get('lat')
    lon = request.args.get('lon')

    if not lat or not lon:
        return jsonify({"error": {"message": "Missing latitude or longitude"}}), 400

    endpoint = (
        "https://weather.googleapis.com/v1/currentConditions:lookup"
        f"?key={GOOGLE_API_KEY}"
        f"&location.latitude={lat}&location.longitude={lon}"
    )
    resp = requests.get(endpoint).json()
    return jsonify(resp)

# -------- Get Daily Foercast --------
@cache.memoize(timeout=600)
@app.route('/forecast/daily', methods=['GET'])
def get_daily_forecast():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    if not lat or not lon:
        return jsonify({"error": {"message": "Missing latitude or longitude"}}), 400

    endpoint = (
        "https://weather.googleapis.com/v1/forecast/days:lookup"
        f"?key={GOOGLE_API_KEY}"
        f"&location.latitude={lat}&location.longitude={lon}"
        "&days=5"
    )
    resp = requests.get(endpoint)
    return jsonify(resp.json())

@app.route('/weather/range', methods=['GET'])
def weather_with_date_range():
    lat = request.args.get('lat')
    lon = request.args.get('lon')
    start_date_str = request.args.get('start_date')  # format: YYYY-MM-DD
    end_date_str = request.args.get('end_date')      # format: YYYY-MM-DD

    if not all([lat, lon, start_date_str, end_date_str]):
        return jsonify({"error": {"message": "Missing parameters"}}), 400

    try:
        start_date = datetime.strptime(start_date_str, "%Y-%m-%d").date()
        end_date = datetime.strptime(end_date_str, "%Y-%m-%d").date()
        if start_date > end_date:
            return jsonify({"error": {"message": "start_date cannot be after end_date"}}), 400
    except ValueError:
        return jsonify({"error": {"message": "Invalid date format. Use YYYY-MM-DD"}}), 400

    # Fetch 7-day forecast from Google Weather API (max allowed days)
    endpoint = (
        "https://weather.googleapis.com/v1/forecast/days:lookup"
        f"?key={GOOGLE_API_KEY}"
        f"&location.latitude={lat}&location.longitude={lon}"
        f"&days=7"
    )
    resp = requests.get(endpoint)
    if resp.status_code != 200:
        return jsonify({"error": {"message": "Failed to retrieve forecast"}}), 500

    forecast_data = resp.json()
    forecast_days = forecast_data.get("forecastDays", [])

    # Filter forecastDays within given date range
    filtered_days = []
    for day in forecast_days:
        interval_start = day.get("interval", {}).get("startTime")
        if interval_start:
            day_date = datetime.strptime(interval_start[:10], "%Y-%m-%d").date()
            if start_date <= day_date <= end_date:
                filtered_days.append(day)
    temps_only = []
    for day in filtered_days:
        date_str = day.get("interval", {}).get("startTime", "")[:10]
        temps_only.append({
            "date": date_str,
            "max_temp": day.get("maxTemperature", {}).get("degrees"),
            "min_temp": day.get("minTemperature", {}).get("degrees"),
            "unit": day.get("maxTemperature", {}).get("unit")  # optional
        })

    # Store query and results in MongoDB
    curr_record = {
        "lat": lat,
        "lon": lon,
        "start_date": start_date_str,
        "end_date": end_date_str,
        "temperatures": temps_only,
        "timestamp": datetime.utcnow()
    }
    # record = curr_record
    # mongo.db.user_queries.insert_one(record)

    return jsonify({"filtered_forecast": filtered_days})

# CREATE (Insert)
@app.route('/db/insert-range', methods=['POST'])
def insert_range_record():
    data = request.json
    city = data.get("city")
    lat = data.get("lat")
    lon = data.get("lon")
    start_date_str = data.get("start_date")
    end_date_str = data.get("end_date")

    if not all([lat, lon, start_date_str, end_date_str]):
        return jsonify({"error": "Missing parameters"}), 400

    # Call Google Weather API for forecast
    endpoint = (
        "https://weather.googleapis.com/v1/forecast/days:lookup"
        f"?key={GOOGLE_API_KEY}"
        f"&location.latitude={lat}&location.longitude={lon}"
        "&days=7"
    )
    resp = requests.get(endpoint).json()
    forecast_days = resp.get("forecastDays", [])

    # Filter for date range
    try:
        start_d = datetime.strptime(start_date_str, "%Y-%m-%d").date()
        end_d = datetime.strptime(end_date_str, "%Y-%m-%d").date()
    except ValueError:
        return jsonify({"error": "Invalid date format"}), 400

    filtered_days = [
        d for d in forecast_days
        if d.get("interval", {}).get("startTime") and
           start_d <= datetime.strptime(d["interval"]["startTime"][:10], "%Y-%m-%d").date() <= end_d
    ]

    # Keep only temperatures
    temps_only = [
        {
            "date": d["interval"]["startTime"][:10],
            "max_temp": d.get("maxTemperature", {}).get("degrees"),
            "min_temp": d.get("minTemperature", {}).get("degrees"),
            "unit": d.get("maxTemperature", {}).get("unit")
        }
        for d in filtered_days
    ]

    curr_record = {
        "city" : city,
        "lat": lat,
        "lon": lon,
        "start_date": start_date_str,
        "end_date": end_date_str,
        "temperatures": temps_only,
        "timestamp": datetime.utcnow()
    }

    inserted = mongo.db.user_queries.insert_one(curr_record)
    return jsonify({"message": "Inserted successfully", "id": str(inserted.inserted_id)})


# READ (Get all or by id)
@app.route('/db/read', methods=['GET'])
def read_records():
    records = list(mongo.db.user_queries.find())
    for r in records:
        r["_id"] = str(r["_id"])
    return jsonify(records)


# UPDATE (By ID)
@app.route('/db/update/<id>', methods=['PUT'])
def update_record(id):
    data = request.json
    data.pop('_id', None)  # Prevent immutable _id change

    # If lat/lon are being updated, validate them
    lat = data.get("lat")
    lon = data.get("lon")

    if lat is not None and lon is not None:
        try:
            lat = float(lat)
            lon = float(lon)
        except ValueError:
            return jsonify({"error": "Latitude and longitude must be numbers.\nPlease enter valid coordinates"}), 400

        # Validate coordinate range
        if not (-90 <= lat <= 90 and -180 <= lon <= 180):
            return jsonify({"error": "Invalid latitude or longitude range.\nPlease enter valid coordinates"}), 400

        # Verify coordinates exist using Google Reverse Geocoding API
        geo_url = (
            f"https://maps.googleapis.com/maps/api/geocode/json"
            f"?latlng={lat},{lon}&key={GOOGLE_API_KEY}"
        )
        resp = requests.get(geo_url).json()
        if resp.get("status") != "OK" or not resp.get("results"):
            return jsonify({"error": "Coordinates do not correspond to a real location"}), 400

        # If valid, keep the lat/lon as floats in the update
        data["lat"] = lat
        data["lon"] = lon

    # Perform update
    result = mongo.db.user_queries.update_one(
        {"_id": ObjectId(id)},
        {"$set": data}
    )
    if result.modified_count:
        return jsonify({"message": "Updated successfully"})
    else:
        return jsonify({"error": "Nothing updated"}), 404


# DELETE (By ID)
@app.route('/db/delete/<id>', methods=['DELETE'])
def delete_record(id):
    result = mongo.db.user_queries.delete_one({"_id": ObjectId(id)})
    if result.deleted_count:
        return jsonify({"message": "Deleted successfully"})
    else:
        return jsonify({"error": "Not found"}), 404
    
@app.route('/maps/api-key', methods=['GET'])
def get_maps_api_key():
    api_key = os.getenv("GOOGLE_WEATHER_API_KEY")
    if not api_key:
        return jsonify({"error": "API key not set"}), 500
    return jsonify({"apiKey": api_key})


if __name__ == "__main__":
    app.run(debug=True)
