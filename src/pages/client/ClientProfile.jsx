import React, { useEffect, useState } from "react";
import { Box, Typography, Skeleton } from "@mui/material";
import ClientProfileForm from "../../components/ClientPortal/ClientProfileForm";
import API_URLS from "../../utilities/apiConfig";

const ClientProfile = () => {
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Assuming clientCode is stored in localStorage after verification
  const clientCode = localStorage.getItem("clientCode") || "default-code";

  useEffect(() => {
    fetch(`${API_URLS.CLIENTS}/code/${clientCode}`)
      .then((response) => response.json())
      .then((data) => {
        setClientData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [clientCode]);

  if (loading) {
    return (
      <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, md: 4 } }}>
        {/* Skeleton placeholders for heading and form */}
        <Skeleton variant="text" width="80%" height={50} sx={{ mb: 3, mx: "auto" }} />
        <Skeleton variant="rectangular" width="100%" height={400} />
      </Box>
    );
  }

  if (!clientData) {
    return (
      <Typography variant="h6" sx={{ mt: 5, textAlign: "center" }}>
        Client data not found.
      </Typography>
    );
  }

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: { xs: 2, md: 4 } }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}>
        Your Profile
      </Typography>
      <ClientProfileForm clientData={clientData} setClientData={setClientData} />
    </Box>
  );
};

export default ClientProfile;
