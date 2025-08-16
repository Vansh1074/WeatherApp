import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Card, Typography, Button } from "@mui/material";

export default function ReadDialog({ open, onClose, data }) {
  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>📂 Database Records</DialogTitle>
      <DialogContent dividers>
        {Array.isArray(data) && data.length > 0 ? (
          data.map((rec) => (
            <Card key={rec._id} style={{ marginBottom: 10, padding: 10 }}>
              <Typography variant="subtitle1">📍 {rec.city} → <i> Lat: {rec.lat}, Lon: {rec.lon} </i> </Typography>
              <Typography variant="subtitle3">🆔  {rec._id}</Typography>
              {rec.start_date && <Typography variant="body2">📅 {rec.start_date} → {rec.end_date}</Typography>}
              {rec.temperatures && Array.isArray(rec.temperatures) && rec.temperatures.length > 0 && (
                <div style={{ marginTop: 4 }}>
                  {rec.temperatures.map((t, i) => (
                    <Typography key={i} variant="body2">
                      {t.date}: {t.min_temp}° - {t.max_temp}° {t.unit}
                    </Typography>
                  ))}
                </div>
              )}

            </Card>
          ))
        ) : (
          <Typography>No records found.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Close</Button>
      </DialogActions>
    </Dialog>
  );
}
