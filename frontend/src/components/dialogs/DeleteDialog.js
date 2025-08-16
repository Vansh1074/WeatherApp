import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Card, Typography, Button } from "@mui/material";

export default function DeleteDialog({ open, onClose, data, requestDeleteRecord, confirmDeleteOpen, setConfirmDeleteOpen, recordToDelete, handleConfirmDelete }) {
  return (
    <Dialog open={open || confirmDeleteOpen} onClose={onClose} fullWidth maxWidth="md">
      <DialogTitle>🗑 Delete Record</DialogTitle>
      <DialogContent dividers>
        {!confirmDeleteOpen ? (
          Array.isArray(data) && data.length > 0 ? (
            data.map((rec) => (
              <Card key={rec._id} style={{ marginBottom: 10, padding: 10, cursor: "pointer" }} onClick={() => requestDeleteRecord(rec)}>
                <Typography>📍 {rec.city} - <i>{rec.lat}, {rec.lon}</i></Typography>
                <Typography>🆔 {rec._id}</Typography>
                {rec.start_date && (
                  <Typography>📅 {rec.start_date} → {rec.end_date}</Typography>
                )}
              </Card>
            ))
          ) : <Typography>No records found.</Typography>
        ) : (
          <Typography>
            Are you sure you want to delete record ID: {recordToDelete._id}?
          </Typography>
        )}
      </DialogContent>
      <DialogActions>
        {confirmDeleteOpen ? (
          <>
            <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
            <Button onClick={handleConfirmDelete} color="error" variant="contained">Delete</Button>
          </>
        ) : (
          <Button onClick={onClose} color="primary">Close</Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
