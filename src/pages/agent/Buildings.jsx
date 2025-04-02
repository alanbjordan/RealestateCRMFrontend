// src/pages/Buildings.jsx
import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Snackbar,
  Alert,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { ArrowUpward, ArrowDownward } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useBuildings from "../../hooks/useBuildings";

const Buildings = () => {
  const navigate = useNavigate();
  const {
    buildings,
    isLoading,
    snackbar,
    handleSnackbarClose,
    handleRefresh,
    handleDelete,
    searchQuery,
    setSearchQuery,
  } = useBuildings();

  // Local sort state
  const [sortColumn, setSortColumn] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");

  // Handler for header click
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  // Memoized sorted buildings
  const sortedBuildings = useMemo(() => {
    if (!buildings) return [];
    return [...buildings].sort((a, b) => {
      const valA = a[sortColumn] || "";
      const valB = b[sortColumn] || "";
      if (typeof valA === "number" && typeof valB === "number") {
        return sortOrder === "asc" ? valA - valB : valB - valA;
      }
      return sortOrder === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    });
  }, [buildings, sortColumn, sortOrder]);

  // Define headers (hiding ID)
  const headers = [
    { key: "name", label: "Name" },
    { key: "year_built", label: "Year Built" },
    { key: "nearest_bts", label: "Nearest BTS" },
    { key: "nearest_mrt", label: "Nearest MRT" },
    { key: "actions", label: "Actions" },
  ];

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        Building Management
      </Typography>

      {/* Controls */}
      <Box sx={{ mb: 2, display: "flex", flexWrap: "wrap", gap: 2 }}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate("/building/new")}
        >
          Add Building
        </Button>
        <Button variant="contained" color="secondary" onClick={handleRefresh}>
          Refresh List
        </Button>
        <Box sx={{ flexGrow: 1 }}>
          <input
            type="text"
            placeholder="Search buildings..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ width: "100%", padding: "0.5rem" }}
          />
        </Box>
      </Box>

      {/* Buildings Table */}
      <TableContainer component={Paper}>
        {isLoading ? (
          <Typography sx={{ p: 2 }}>Loading buildings...</Typography>
        ) : sortedBuildings.length === 0 ? (
          <Typography sx={{ p: 2 }}>No buildings found.</Typography>
        ) : (
          <Table sx={{ width: "100%" }}>
            <TableHead sx={{ backgroundColor: "#f5f5f5" }}>
              <TableRow>
                {headers.map((header) => (
                  <TableCell
                    key={header.key}
                    sx={{
                      padding: "8px",
                      textAlign: "left",
                      fontWeight: "bold",
                      cursor: header.key !== "actions" ? "pointer" : "default",
                    }}
                    onClick={() =>
                      header.key !== "actions" && handleSort(header.key)
                    }
                  >
                    {header.label}
                    {header.key !== "actions" && sortColumn === header.key && (
                      sortOrder === "asc" ? (
                        <ArrowUpward fontSize="small" />
                      ) : (
                        <ArrowDownward fontSize="small" />
                      )
                    )}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {sortedBuildings.map((b) => (
                <TableRow
                  key={b.id}
                  sx={{
                    cursor: "pointer",
                    borderBottom: "1px solid #ddd",
                    "&:hover": { backgroundColor: "#f5f5f5" },
                  }}
                  onClick={() => navigate(`/building/${b.id}`)}
                >
                  <TableCell sx={{ padding: "8px" }}>{b.name}</TableCell>
                  <TableCell sx={{ padding: "8px" }}>
                    {b.year_built || "N/A"}
                  </TableCell>
                  <TableCell sx={{ padding: "8px" }}>
                    {b.nearest_bts || "N/A"}
                  </TableCell>
                  <TableCell sx={{ padding: "8px" }}>
                    {b.nearest_mrt || "N/A"}
                  </TableCell>
                  <TableCell sx={{ padding: "8px" }}>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(b.id, e);
                      }}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </TableContainer>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Buildings;
