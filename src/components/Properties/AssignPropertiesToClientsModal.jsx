// src/components/Properties/AssignPropertiesToClientsModal.jsx
import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import API_URLS from "../../utilities/apiConfig";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: "80%" },
  maxWidth: 600,
  maxHeight: { xs: "90vh", sm: "80vh" },
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

const AssignPropertiesToClientsModal = ({
  open,
  onClose,
  filteredProperties, // the list of properties from finalList
  onAssignmentComplete, // optional callback to notify parent after assignment
}) => {
  const [clients, setClients] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [clientSearch, setClientSearch] = useState("");
  const [selectedClientIds, setSelectedClientIds] = useState([]);
  const [assigning, setAssigning] = useState(false);

  // Fetch clients when the modal opens
  useEffect(() => {
    if (open) {
      setLoadingClients(true);
      fetch(API_URLS.CLIENTS)
        .then((response) => response.json())
        .then((data) => {
          setClients(data);
          setLoadingClients(false);
        })
        .catch((err) => {
          console.error("Failed to fetch clients", err);
          setLoadingClients(false);
        });
    }
  }, [open]);

  const handleToggleClient = (clientId) => {
    setSelectedClientIds((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId]
    );
  };

  const filteredClients = clients.filter((client) => {
    const search = clientSearch.toLowerCase();
    // Filtering by client code or name (adjust as needed)
    return (
      String(client.code).toLowerCase().includes(search) ||
      String(client.first_name).toLowerCase().includes(search) ||
      String(client.last_name).toLowerCase().includes(search)
    );
  });

  const handleAssign = async () => {
    if (selectedClientIds.length === 0) {
      alert("Please select at least one client.");
      return;
    }
    if (filteredProperties.length === 0) {
      alert("There are no properties to assign.");
      return;
    }
    setAssigning(true);
    try {
      // For each selected client, assign every property from the filtered list.
      const assignmentPromises = [];
      for (const clientId of selectedClientIds) {
        for (const property of filteredProperties) {
          const promise = fetch(`${API_URLS.CLIENTS}/${clientId}/properties`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ property_id: property.id }),
          });
          assignmentPromises.push(promise);
        }
      }
      const responses = await Promise.all(assignmentPromises);
      const failed = responses.filter((res) => !res.ok);
      if (failed.length > 0) {
        throw new Error("Some property assignments failed.");
      }
      // Notify parent if needed
      if (onAssignmentComplete) onAssignmentComplete();
      onClose();
    } catch (error) {
      console.error("Error assigning properties:", error);
      alert("Error assigning properties. Check the console for details.");
    } finally {
      setAssigning(false);
      setSelectedClientIds([]);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {/* Modal Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Assign Filtered Properties to Client(s)</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* Search Input */}
        <TextField
          label="Search Clients"
          value={clientSearch}
          onChange={(e) => setClientSearch(e.target.value)}
          fullWidth
          sx={{ mb: 2 }}
        />

        {loadingClients ? (
          <Box display="flex" justifyContent="center" my={2}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {filteredClients.map((client) => (
              <ListItem
                key={client.id}
                button
                onClick={() => handleToggleClient(client.id)}
              >
                <Checkbox checked={selectedClientIds.includes(client.id)} />
                <ListItemText
                  primary={`${client.code} - ${client.first_name} ${client.last_name}`}
                  secondary={client.nationality}
                />
              </ListItem>
            ))}
          </List>
        )}

        {/* Action Buttons */}
        <Box display="flex" justifyContent="flex-end" mt={2} gap={2}>
          <Button variant="outlined" onClick={onClose} disabled={assigning}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleAssign} disabled={assigning}>
            {assigning ? "Assigning..." : "Apply"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default AssignPropertiesToClientsModal;
