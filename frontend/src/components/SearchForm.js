import React from "react";
import { TextField, Button, Radio, RadioGroup, FormControlLabel } from "@mui/material";

export default function SearchForm({
  searchType, setSearchType, inputValue, setInputValue,
  startDate, setStartDate, endDate, setEndDate,
  onSearch, onUseCurrentLocation
}) {
  return (
    <form onSubmit={onSearch} style={{ marginBottom: 20 }}>
      <RadioGroup row value={searchType} 
        onChange={e => {
            setSearchType(e.target.value)
            setInputValue("")
        }}>
        <FormControlLabel value="city" control={<Radio />} label="City" />
        <FormControlLabel value="zip" control={<Radio />} label="Zip" />
        <FormControlLabel value="coord" control={<Radio />} label="Coordinates" />
        <FormControlLabel value="landmark" control={<Radio />} label="Landmark" />
      </RadioGroup>
      <TextField
          type={searchType === "zip" ? "number" : "text"}
          label={searchType === "coord" ? "Latitude,Longitude" : "Enter " + searchType.charAt(0).toUpperCase() + searchType.slice(1)}
          placeholder={searchType === "coord" || searchType === "zip" ? "Enter only numbers" : `Enter ${searchType}`}
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          style={{ marginRight: 16, marginTop: 10 }}
      />
      <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
      <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
      <Button type="submit" variant="contained" color="primary" style={{ marginLeft: 16 }}>Search</Button>
      <Button variant="contained" color="secondary" style={{ marginLeft: 8 }} onClick={onUseCurrentLocation}>Use Current Location</Button>
    </form>
  );
}
