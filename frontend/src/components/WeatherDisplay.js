import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import FiveDayForecast from "./FiveDaysForecast";
import RangeForecast from './RangeForecast'

export default function WeatherDisplay({ weather, dailyForecast, rangeForecast }) {
  return (
    <>
      {weather && (
        <Card style={{ marginTop: 20, padding: 10 }}>
          <CardContent>
            {/* City & Address */}
            {weather.city && (
              <Typography variant="h3">
                {weather.city}
              </Typography>
            )}
            {weather.address && (
              <Typography variant="body2" color="textSecondary">
                📍{weather.address}
              </Typography>
            )}
            {/* Condition + Icon */}
            <Typography variant="h5">
              {weather.weatherCondition?.description?.text || "N/A"}
            </Typography>
            {weather.weatherCondition?.iconBaseUri && (
              <img
                src={`${weather.weatherCondition.iconBaseUri}.svg`}
                alt="Weather icon"
                style={{ width: 60 }}
              />
            )}
            {/* Main Temperature */}
            <Typography variant="h6">
              Temperature: {weather.temperature?.degrees !== undefined
                ? `${weather.temperature.degrees}° ${weather.temperature.unit || ""}`
                : "N/A"}
            </Typography>
            {/* Feels Like */}
            <Typography>
              Feels Like: {weather.feelsLikeTemperature?.degrees !== undefined
                ? `${weather.feelsLikeTemperature.degrees}° ${weather.feelsLikeTemperature.unit || ""}`
                : "N/A"}
            </Typography>
            {/* Humidity */}
            <Typography>
              Humidity: {weather.relativeHumidity !== undefined
                ? `${weather.relativeHumidity}%`
                : "N/A"}
            </Typography>
            {/* Wind + Gusts + Direction */}
            <Typography>
              Wind: {weather.wind?.speed?.value !== undefined
                ? `${weather.wind.speed.value} ${weather.wind.speed.unit || ""}`
                : "N/A"}
              {weather.wind?.direction?.cardinal
                ? ` ${weather.wind.direction.cardinal}`
                : ""}
              {weather.wind?.direction?.degrees !== undefined
                ? ` (${weather.wind.direction.degrees}°)`
                : ""}
              {weather.wind?.gust?.value !== undefined
                ? `, Gust: ${weather.wind.gust.value} ${weather.wind.gust.unit || ""}`
                : ""}
            </Typography>
            {/* Dew Point */}
            <Typography>
              Dew Point: {weather.dewPoint?.degrees !== undefined
                ? `${weather.dewPoint.degrees}° ${weather.dewPoint.unit || ""}`
                : "N/A"}
            </Typography>
            {/* Pressure */}
            <Typography>
              Pressure: {weather.airPressure?.meanSeaLevelMillibars !== undefined
                ? `${weather.airPressure.meanSeaLevelMillibars} hPa`
                : "N/A"}
            </Typography>
            {/* Visibility */}
            <Typography>
              Visibility: {weather.visibility?.distance !== undefined
                ? `${weather.visibility.distance} ${weather.visibility.unit || ""}`
                : "N/A"}
            </Typography>
            {/* Max/Min Temp */}
            <Typography>
              Max Temp: {weather.currentConditionsHistory?.maxTemperature?.degrees !== undefined
                ? `${weather.currentConditionsHistory.maxTemperature.degrees}°`
                : "N/A"}
              , Min Temp: {weather.currentConditionsHistory?.minTemperature?.degrees !== undefined
                ? `${weather.currentConditionsHistory.minTemperature.degrees}°`
                : "N/A"}
            </Typography>
            {/* UV Index, Cloud Cover */}
            <Typography>
              UV Index: {weather.uvIndex !== undefined ? weather.uvIndex : "N/A"}
            </Typography>
            <Typography>
              Cloud Cover: {weather.cloudCover !== undefined ? `${weather.cloudCover}%` : "N/A"}
            </Typography>
            {/* Precipitation Probability */}
            <Typography>
              Precipitation Probability: {weather.precipitation?.probability?.percent !== undefined
                ? `${weather.precipitation.probability.percent}%`
                : "N/A"}
            </Typography>
          </CardContent>
          <div id="map" style={{ width: "100%", height: "300px", marginTop: 20 }}></div>
        </Card>
        
      )}



      <FiveDayForecast dailyForecast={dailyForecast} />
      <RangeForecast rangeForecast={rangeForecast} />
    </>
  );
}
