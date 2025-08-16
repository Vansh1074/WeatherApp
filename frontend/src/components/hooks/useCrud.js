import { useState } from 'react';

export default function useCrud({ city, inputValue, startDate, endDate, searchType }) {
  const [dbData, setDbData] = useState([]);
  const [readOpen, setReadOpen] = useState(false);
  const [updateListOpen, setUpdateListOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deleteListOpen, setDeleteListOpen] = useState(false);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState(null);

  // Insert
  const handleInsert = async () => {
    if (!inputValue || !startDate || !endDate) {
      alert("Location and date range both should be specified in order to insert data");
      return;
    }
    let lat, lon;
    if (searchType === "coord") {
      [lat, lon] = inputValue.split(",").map(v => v.trim());
    } else {
      try {
        const res = await fetch(
          `http://localhost:5000/get-coordinates?type=${searchType}&value=${encodeURIComponent(inputValue)}`
        );
        const location = await res.json();
        if (!location.lat || !location.lon) {
          alert("Unable to fetch coordinates");
          return;
        }
        lat = location.lat;
        lon = location.lon;
      } catch {
        alert("Error fetching coordinates");
        return;
      }
    }
    try {
      const res = await fetch(`http://localhost:5000/db/insert-range`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city: city, lat, lon, start_date: startDate, end_date: endDate })
      });
      const data = await res.json();
      if (res.ok && data.id) alert(`Inserted successfully with ID: ${data.id}`);
      else alert(data.error || "Insert failed");
    } catch (err) {
      alert("Error inserting from backend");
    }
  };

  // Read
  const handleRead = async () => {
    try {
      const res = await fetch("http://localhost:5000/db/read");
      const data = await res.json();
      setDbData(data);
      setReadOpen(true);
    } catch {
      alert("Error reading data from DB");
    }
  };

  // Update
  const handleUpdate = async () => {
    try {
      const res = await fetch("http://localhost:5000/db/read");
      const data = await res.json();
      setDbData(data);
      setUpdateListOpen(true);
    } catch {
      alert("Error loading records");
    }
  };
  const openEditDialog = (record) => {
    setSelectedRecord(record);
    setEditForm(record);
    setEditOpen(true);
  };
  const handleEditChange = (field, value) => {
    setEditForm({ ...editForm, [field]: value });
  };
  const handleSaveUpdate = async () => {
    if (!selectedRecord?._id) return;
    try {
      const res = await fetch(`http://localhost:5000/db/update/${selectedRecord._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (res.ok) {
        alert("Updated successfully!");
        setEditOpen(false);
        handleUpdate();
      } else {
        alert(data.error || "Update failed");
      }
    } catch {
      alert("Error updating record");
    }
  };

  // Delete
  const handleDelete = async () => {
    try {
      const res = await fetch("http://localhost:5000/db/read");
      const data = await res.json();
      setDbData(data);
      setDeleteListOpen(true);
    } catch {
      alert("Error loading records for delete");
    }
  };
  const requestDeleteRecord = (record) => {
    setRecordToDelete(record);
    setConfirmDeleteOpen(true);
  };
  const handleConfirmDelete = async () => {
    if (!recordToDelete?._id) return;
    try {
      const res = await fetch(`http://localhost:5000/db/delete/${recordToDelete._id}`, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok) {
        alert("Record deleted successfully!");
        setConfirmDeleteOpen(false);
        setDeleteListOpen(false);
        handleDelete();
      } else {
        alert(data.error || "Delete failed");
      }
    } catch {
      alert("Error deleting record");
    }
  };

  return {
    dbData, readOpen, setReadOpen,
    updateListOpen, setUpdateListOpen,
    editOpen, setEditOpen,
    selectedRecord, setSelectedRecord,
    editForm, setEditForm,
    openEditDialog, handleEditChange, handleSaveUpdate,
    deleteListOpen, setDeleteListOpen,
    confirmDeleteOpen, setConfirmDeleteOpen,
    recordToDelete, setRecordToDelete,
    requestDeleteRecord, handleConfirmDelete,
    handleInsert, handleRead, handleUpdate, handleDelete
  };
}
