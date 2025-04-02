// src/components/Properties/PropertiesControls.jsx
import React from "react";
import { Box, Button, TextField } from "@mui/material";

const PropertiesControls = ({ searchQuery, setSearchQuery, onRefresh, onAddProperty }) => {
  return (
    <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
      <Button variant="contained" color="primary" onClick={onAddProperty}>
        Add Property
      </Button>
      <Button variant="contained" color="secondary" onClick={onRefresh}>
        Refresh List
      </Button>
      <TextField
        label="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ minWidth: 200 }}
      />
    </Box>
  );
};

export default PropertiesControls;
