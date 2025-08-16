import React from "react";
import { Card, CardContent, Typography } from "@mui/material";

export default function RangeForecast({ rangeForecast }) {
  if (!rangeForecast || rangeForecast.length === 0) return null;

  return (
    <div style={{ marginTop: 30 }}>
      <Typography variant="h6">Range Forecast ({rangeForecast.length} Days)</Typography>
      <div style={{ display: 'flex', gap: '16px', overflowX: 'auto' }}>
        {rangeForecast.map((day, idx) => (
          <Card key={idx} style={{ minWidth: 140 }}>
            <CardContent>
              <Typography variant="subtitle1">{day.date || day.interval?.startTime?.slice(0,10)}</Typography>
              <Typography>
                High: {day.max_temp ?? day.maxTemperature?.degrees}°{day.maxTemperature?.unit ?? ''}
              </Typography>
              <Typography>
                Low: {day.min_temp ?? day.minTemperature?.degrees}°{day.minTemperature?.unit ?? ''}
              </Typography>
              {day.description && <Typography>{day.description}</Typography>}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
