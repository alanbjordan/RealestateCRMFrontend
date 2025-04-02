// src/pages/Clients.jsx
import React, { useState, useEffect } from "react";
import { Box, Typography, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import API_URLS from "../../utilities/apiConfig";
import ClientListControls from "../../components/Clients/ClientListControls";
import ClientsTable from "../../components/Clients/ClientsTable";

const Clients = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Search and sorting state
  const [searchQuery, setSearchQuery] = useState("");
  const [sortColumn, setSortColumn] = useState("code");
  const [sortOrder, setSortOrder] = useState("asc");

  // ---------------------------------------
  // 1. Fetch Clients from API or localStorage
  // ---------------------------------------
  const fetchClients = () => {
    setIsLoading(true);
    fetch(`${API_URLS.CLIENTS}`)
      .then((response) => response.json())
      .then((data) => {
        // Ensure that we always work with an array.
        const clientsArray = Array.isArray(data) ? data : [];
        setClients(clientsArray);
        localStorage.setItem("clients", JSON.stringify(clientsArray));
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching clients:", error);
        setSnackbarMessage("Failed to fetch clients.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
        setIsLoading(false);
      });
  };
  

    useEffect(() => {
      const storedClients = localStorage.getItem("clients");
      if (storedClients) {
        const parsedClients = JSON.parse(storedClients);
        setClients(Array.isArray(parsedClients) ? parsedClients : []);
      } else {
        fetchClients();
      }
    }, []);
  

  // ---------------------------------------
  // 2. Refresh Clients
  // ---------------------------------------
  const handleUpdateClients = () => {
    fetchClients();
  };

  // ---------------------------------------
  // 3. Delete a Client
  // ---------------------------------------
  const handleDeleteClient = async (clientId) => {
    if (!window.confirm("Are you sure you want to delete this client?")) {
      return;
    }
    try {
      const response = await fetch(`${API_URLS.CLIENTS}/${clientId}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        throw new Error("Failed to delete client.");
      }
      setSnackbarMessage("Client deleted successfully.");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);
      fetchClients();
    } catch (error) {
      console.error("Error deleting client:", error);
      setSnackbarMessage("Error deleting client.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  // ---------------------------------------
  // 4. Sorting Handler
  // ---------------------------------------
  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  // ---------------------------------------
  // 5. Filtering and Sorting Data
  // ---------------------------------------
  const filteredClients = clients.filter((client) => {
    const query = searchQuery.toLowerCase();
    return Object.values(client)
      .filter((val) => typeof val === "string" || typeof val === "number")
      .some((val) => String(val).toLowerCase().includes(query));
  });

  const sortedClients = filteredClients.sort((a, b) => {
    const fieldA = a[sortColumn] || "";
    const fieldB = b[sortColumn] || "";
    if (typeof fieldA === "number" && typeof fieldB === "number") {
      return sortOrder === "asc" ? fieldA - fieldB : fieldB - fieldA;
    }
    return sortOrder === "asc"
      ? String(fieldA).localeCompare(String(fieldB))
      : String(fieldB).localeCompare(String(fieldA));
  });

  const headers = [
    { key: "id", label: "ID" },
    { key: "code", label: "Code" },
    { key: "client", label: "Client" },
    { key: "nationality", label: "Nationality" },
    { key: "contact", label: "Contact" },
    { key: "move_in", label: "Move-in" },
    { key: "budget", label: "BG" },
    { key: "bedrooms", label: "BR" },
    { key: "bath", label: "BA" },
    { key: "area", label: "Area" },
    { key: "status", label: "Status" },
    { key: "actions", label: "Actions" },
  ];

  const handleRowClick = (clientId) => {
    navigate(`/client/${clientId}`);
  };

  const handleSnackbarClose = () => {
    setSnackbarOpen(false);
  };

  const handleAddClient = () => {
    navigate("/client/new");
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3 } }}>
      <Typography
        variant="h4"
        sx={{
          mb: 3,
          fontWeight: "bold",
          fontSize: { xs: "1.5rem", sm: "2rem" }, // smaller on mobile
        }}
      >
        Client Management
      </Typography>

      <ClientListControls
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onRefresh={handleUpdateClients}
        onAddClient={handleAddClient}
      />

      <ClientsTable
        clients={sortedClients}
        isLoading={isLoading}
        searchQuery={searchQuery}
        headers={headers}
        sortColumn={sortColumn}
        sortOrder={sortOrder}
        handleSort={handleSort}
        onDeleteClient={handleDeleteClient}
        onRowClick={handleRowClick}
      />

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Clients;
