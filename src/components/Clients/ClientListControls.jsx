// src/components/Clients/ClientListControls.jsx
import React from "react";
import { Box, Button, TextField } from "@mui/material";

const ClientListControls = ({ searchQuery, setSearchQuery, onRefresh, onAddClient }) => {
  return (
    <Box
      sx={{
        mb: 2,
        display: "flex",
        flexWrap: "wrap",
        gap: 2,
        alignItems: "center",
        justifyContent: { xs: "space-between", sm: "flex-start" },
      }}
    >
      <Button variant="contained" color="primary" onClick={onAddClient}>
        Add Client
      </Button>

      <Button variant="contained" color="secondary" onClick={onRefresh}>
        Refresh List
      </Button>

      <TextField
        label="Search"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        sx={{ minWidth: { xs: 120, sm: 200 } }} // narrower on mobile
      />
    </Box>
  );
};

export default ClientListControls;
