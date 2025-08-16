import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

export default function FiveDayForecast({ dailyForecast }) {
  if (!dailyForecast || dailyForecast.length === 0) return null;

  return (
    <div style={{ marginTop: 30 }}>
      <Typography variant="h6">5-Day Forecast</Typography>
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto' }}>
        {dailyForecast.map((day, idx) => {
          const date = new Date(day.interval.startTime);
          const dateString = date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });
          return (
            <Card key={idx} style={{ minWidth: 140 }}>
              <CardContent>
                <Typography variant="subtitle1">{dateString}</Typography>
                {day.daytimeForecast?.weatherCondition?.iconBaseUri && (
                  <img
                    src={`${day.daytimeForecast.weatherCondition.iconBaseUri}.svg`}
                    alt={day.daytimeForecast.weatherCondition.description?.text || "Weather"}
                    style={{ width: 40, height: 40 }}
                  />
                )}
                <Typography>
                  {day.daytimeForecast?.weatherCondition?.description?.text || "N/A"}
                </Typography>
                <Typography>
                  High: {day.maxTemperature?.degrees}°{day.maxTemperature?.unit}
                </Typography>
                <Typography>
                  Low: {day.minTemperature?.degrees}°{day.minTemperature?.unit}
                </Typography>
                <Typography>
                  Precipitation: {day.daytimeForecast?.precipitation?.probability?.percent ?? "N/A"}%
                </Typography>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
