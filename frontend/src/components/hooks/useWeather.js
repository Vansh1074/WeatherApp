import { useState, useEffect } from "react";

export default function useWeather() {
  const [searchType, setSearchType] = useState("city")
  const [inputValue, setInputValue] = useState("")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [weather, setWeather] = useState(null)
  const [city,setCity] = useState("")
  const [dailyForecast, setDailyForecast] = useState([])
  const [rangeForecast, setRangeForecast] = useState([])
  const [mapsApiKey, setMapsApiKey] = useState(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch('http://localhost:5000/maps/api-key')
      .then(res => res.json())
      .then(data => {
        if (data.apiKey) setMapsApiKey(data.apiKey);
        else setError("Failed to load Google Maps API key");
      })
      .catch(() => setError("Failed to load Google Maps API key"));
  }, []);

  useEffect(() => {
    if (mapsApiKey && weather?.latitude !== undefined && weather?.longitude !== undefined) {
      if (!window.google) {
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${mapsApiKey}`;
        script.async = true;
        script.defer = true;
        document.head.appendChild(script);
        script.onload = () => initMap(weather.latitude, weather.longitude, weather.city);
      } else {
        initMap(weather.latitude, weather.longitude, weather.city);
      }
    }
  }, [mapsApiKey, weather]);

  const initMap = (lat, lng, city) => {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;
    const map = new window.google.maps.Map(mapElement, {
      center: { lat: parseFloat(lat), lng: parseFloat(lng) },
      zoom: 12,
    });
    new window.google.maps.Marker({
      position: { lat: parseFloat(lat), lng: parseFloat(lng) },
      map,
      title: city || 'Location',
    });
  };

  const fetchWeather = async (lat, lon) => {
    try {
      const [weatherRes, locationRes, dailyRes] = await Promise.all([
        fetch(`http://localhost:5000/weather?lat=${lat}&lon=${lon}`),
        fetch(`http://localhost:5000/reverse-geocode?lat=${lat}&lon=${lon}`),
        fetch(`http://localhost:5000/forecast/daily?lat=${lat}&lon=${lon}`)
      ]);
      const weatherData = await weatherRes.json();
      const locationData = await locationRes.json();
      const dailyData = await dailyRes.json();
      if (!weatherData.error) {
        setWeather({
          ...weatherData,
          city: locationData.city || "Unknown",
          address: locationData.address || "Unknown",
          latitude: parseFloat(lat),
          longitude: parseFloat(lon)
        });
        setDailyForecast(dailyData.forecastDays || []);
        setCity(locationData.city);
        setError("")
      } else {
        setError(weatherData.error);
      }
    } catch {
      setError("Failed to fetch weather/location");
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    setError("");
    setRangeForecast([]);
    setDailyForecast([]);
    setWeather(null);
    setCity("")

    let lat, lon;
    if (searchType === "coord") {
      try {
        [lat, lon] = inputValue.split(",").map(v => v.trim());
        if (!lat || !lon || isNaN(Number(lat)) || isNaN(Number(lon))) {
          setError("Please enter valid coordinates");
          return;
        }
      } catch {
        setError("Invalid coordinates format. Use 'lat,lon'.");
        return;
      }
    } else {
      try {
        const res = await fetch(
          `http://localhost:5000/get-coordinates?type=${searchType}&value=${encodeURIComponent(inputValue)}`
        );
        const location = await res.json();
        if (location.lat && location.lon) {
          lat = location.lat;
          lon = location.lon;
        } else {
          setError("Location not found");
          return;
        }
      } catch {
        setError("Error fetching location");
        return;
      }
    }
    // RANGE FORECAST
    if (startDate && endDate) {
      try {
        const [locationRes, rangedRes] = await Promise.all([
          fetch(`http://localhost:5000/reverse-geocode?lat=${lat}&lon=${lon}`),
          fetch(`http://localhost:5000/weather/range?lat=${lat}&lon=${lon}&start_date=${startDate}&end_date=${endDate}`)
        ]);
        const locationData = await locationRes.json();
        const rangedData = await rangedRes.json();
        // fetchWeather()
        if (rangedData.error) {
          setError(rangedData.error.message || "Error fetching forecast");
          return;
        }
        setRangeForecast(rangedData.filtered_forecast || []);
        setCity(locationData.city)
      } catch {
        setError("Failed to fetch forecast for date range");
      }
    } else {
      fetchWeather(lat, lon);
    }
  };

  const fetchLocationByIP = async () => {
    try {
      const response = await fetch('http://ip-api.com/json/');
      const data = await response.json();
      if (data.status === "success") {
        setInputValue(`${data.lat}, ${data.lon}`);
        setSearchType("coord");
        fetchWeather(data.lat, data.lon);
      } else {
        setError("Failed to detect location by IP.");
      }
    } catch {
      setError("Error fetching IP location.");
    }
  };

  return {
    searchType, setSearchType, inputValue, setInputValue,
    city, startDate, setStartDate, endDate, setEndDate,
    weather, dailyForecast, rangeForecast,
    handleSearch, fetchLocationByIP, error, setError
  };
}
