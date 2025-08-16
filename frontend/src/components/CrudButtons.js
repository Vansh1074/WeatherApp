import { Button } from "@mui/material";

export default function CrudButtons({ onInsert, onRead, onUpdate, onDelete }) {


  return (
    <div style={{ marginTop: 16, display: 'flex', alignItems: 'center' }}>
      <Button variant="contained" color="success" onClick={onInsert} style={{ marginRight: 8 }}>
        Insert
      </Button>
      <Button variant="contained" color="info" onClick={onRead} style={{ marginRight: 8 }}>
        Read
      </Button>
      <Button variant="contained" color="warning" onClick={onUpdate} style={{ marginRight: 8 }}>
        Update
      </Button>
      <Button variant="contained" color="error" onClick={onDelete}>
        Delete
      </Button>

    </div>
  );
}
