// src/hooks/useClientData.js
import { useState, useEffect } from "react";
import API_URLS from "../utilities/apiConfig";

const defaultClientData = {
  code: "",
  title: "",
  first_name: "",
  last_name: "",
  nationality: "",
  contact_type: "",
  contact: "",
  starting_date: "",
  move_in: "",
  budget: "",
  bedrooms: "",
  bath: "",
  area: "",
  preferred: "",
  status: "",
  work_sheet: "",
};

const useClientData = (clientId) => {
  const [clientData, setClientData] = useState(defaultClientData);
  const [assignedProperties, setAssignedProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch client data
  useEffect(() => {
    if (clientId && clientId !== "new") {
      fetch(`${API_URLS.CLIENTS}/${clientId}`)
        .then((response) => {
          if (!response.ok) throw new Error("Failed to fetch client data");
          return response.json();
        })
        .then((data) => {
          setClientData(data);
          if (data.assigned_properties) {
            setAssignedProperties(data.assigned_properties);
          }
          setLoading(false);
        })
        .catch((error) => {
          console.error("Error fetching client:", error);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [clientId]);

  // Save (create/update) client data
  const saveClientData = async (showNotification, navigate) => {
    if (clientId === "new") {
      if (!clientData.code.trim()) {
        showNotification("Client code is required!", "error");
        return;
      }
      if (!clientData.first_name.trim()) {
        showNotification("First name is required!", "error");
        return;
      }
      if (!clientData.last_name.trim()) {
        showNotification("Last name is required!", "error");
        return;
      }
    }
    setSaving(true);
    try {
      const method = clientId === "new" ? "POST" : "PUT";
      const endpoint =
        clientId === "new" ? `${API_URLS.CLIENTS}` : `${API_URLS.CLIENTS}/${clientId}`;
      const response = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      });
      if (!response.ok) {
        throw new Error(method === "POST" ? "Failed to create client" : "Failed to update client");
      }
      localStorage.removeItem("clients");
      showNotification(
        method === "POST" ? "Client created successfully!" : "Client updated successfully!",
        "success"
      );
      setTimeout(() => {
        navigate("/clients");
      }, 1500);
    } catch (err) {
      console.error("Error saving client:", err);
      showNotification("Error saving client. Check console for details.", "error");
      setSaving(false);
    }
  };

  return {
    clientData,
    setClientData,
    assignedProperties,
    setAssignedProperties,
    loading,
    saving,
    saveClientData,
  };
};

export default useClientData;
