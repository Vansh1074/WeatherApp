import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Card, Typography, Button, TextField } from "@mui/material";

export default function UpdateDialog({
  open, onClose, data, editOpen, setEditOpen, selectedRecord, openEditDialog, editForm, handleEditChange, handleSaveUpdate
}) {
  return (
    <Dialog open={open || editOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>✏️ Update Record</DialogTitle>
      <DialogContent dividers>
        {!editOpen ? (
          Array.isArray(data) && data.length > 0 ? (
            data.map((rec) => (
              <Card key={rec._id} style={{ marginBottom: 10, padding: 10, cursor: "pointer" }} onClick={() => openEditDialog(rec)}>
                <Typography>📍 {rec.city} - <i>{rec.lat}, {rec.lon}</i></Typography>
                <Typography>🆔 {rec._id}</Typography>
                {rec.start_date && (
                  <Typography>📅 {rec.start_date} → {rec.end_date}</Typography>
                )}
              </Card>
            ))
          ) : <Typography>No records found.</Typography>
        ) : (
          <>
            <TextField
              label="City"
              value={editForm.city || ""}
              onChange={(e) => handleEditChange("city", e.target.value)}
              fullWidth margin="dense"
            />
            <TextField
              label="Latitude"
              value={editForm.lat || ""}
              onChange={(e) => handleEditChange("lat", e.target.value)}
              fullWidth margin="dense"
            />
            <TextField
              label="Longitude"
              value={editForm.lon || ""}
              onChange={(e) => handleEditChange("lon", e.target.value)}
              fullWidth margin="dense"
            />
            <TextField
              label="Start Date"
              type="date"
              value={editForm.start_date || ""}
              onChange={(e) => handleEditChange("start_date", e.target.value)}
              fullWidth margin="dense"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              value={editForm.end_date || ""}
              onChange={(e) => handleEditChange("end_date", e.target.value)}
              fullWidth margin="dense"
              InputLabelProps={{ shrink: true }}
            />
          </>
        )}
      </DialogContent>
      <DialogActions>
        {editOpen ? (
          <>
            <Button onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveUpdate} variant="contained" color="primary">Save</Button>
          </>
        ) : (
          <Button onClick={onClose} color="primary">Close</Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
