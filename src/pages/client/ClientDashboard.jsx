// ClientDashboard.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, Skeleton } from "@mui/material";
import ClientDetails from "../../components/ClientPortal/ClientDetails";
import AssignedProperties from "../../components/ClientPortal/AssignedPropertiesList";
import API_URLS from "../../utilities/apiConfig";

const ClientDashboard = () => {
  const { clientCode } = useParams();
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = "auto";
  }, []);

  useEffect(() => {
    if (clientCode) {
      setLoading(true);
      fetch(`${API_URLS.CLIENTS}/code/${clientCode}`)
        .then((response) => {
          if (!response.ok) throw new Error("Client not found");
          return response.json();
        })
        .then((data) => {
          setClientData(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching client data:", err);
          setLoading(false);
        });
    }
  }, [clientCode]);

  if (loading) {
    return (
      <Box
        sx={{
          p: { xs: 3, md: 5 },
          maxWidth: 1000,
          mx: "auto",
          background: "linear-gradient(to bottom, #f8fafc, #ffffff)",
          minHeight: "100vh",
        }}
      >
        <Skeleton
          variant="text"
          width="40%"
          height={50}
          sx={{ mx: "auto", mb: 4, borderRadius: "8px" }}
        />
        <Skeleton variant="rectangular" width="100%" height={250} sx={{ mb: 4, borderRadius: "16px" }} />
        <Skeleton variant="rectangular" width="100%" height={350} sx={{ borderRadius: "16px" }} />
      </Box>
    );
  }

  if (!clientData) {
    return (
      <Box
        sx={{
          p: 4,
          textAlign: "center",
          background: "#f8fafc",
          borderRadius: "16px",
          maxWidth: 600,
          mx: "auto",
          mt: 8,
        }}
      >
        <Typography
          variant="h5"
          sx={{ fontWeight: 600, color: "#1e293b", letterSpacing: "-0.5px" }}
        >
          Client data not found
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 3, md: 5 },
        maxWidth: 1000,
        mx: "auto",
        background: "linear-gradient(to bottom, #f8fafc, #ffffff)",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontWeight: 700,
          color: "#0f172a",
          mb: 5,
          textAlign: "center",
          letterSpacing: "-1px",
        }}
      >
        Welcome, {clientData.first_name}
      </Typography>
      <ClientDetails clientData={clientData} />
      <AssignedProperties clientCode={clientData.code} properties={clientData.assigned_properties} />
    </Box>
  );
};

export default ClientDashboard;