import React, { useEffect, useState } from "react";
import { Box, Typography, Skeleton, Container } from "@mui/material";
import API_URLS from "../../utilities/apiConfig";
import AssignedProperties from "../../components/ClientPortal/AssignedPropertiesList";

// Custom styled components for modern feel
const HeaderBox = ({ children }) => (
  <Box
    sx={{
      background: "linear-gradient(90deg, #1976d2 0%, #42a5f5 100%)",
      py: 3,
      mb: 4,
      borderRadius: 2,
      boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      transition: "transform 0.3s ease",
      "&:hover": {
        transform: "translateY(-2px)",
      },
    }}
  >
    <Typography
      variant="h4"
      sx={{
        color: "#fff",
        fontWeight: 700,
        textAlign: "center",
        textShadow: "1px 1px 4px rgba(0, 0, 0, 0.2)",
      }}
    >
      {children}
    </Typography>
  </Box>
);

const ClientProperties = () => {
  const [clientData, setClientData] = useState(null);
  const [loading, setLoading] = useState(true);
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

  // Loading State with Modern Skeleton
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ maxWidth: 1000, mx: "auto" }}>
          <Skeleton
            variant="text"
            width="60%"
            height={60}
            sx={{ mb: 4, mx: "auto", bgcolor: "grey.200" }}
          />
          <Skeleton
            variant="rectangular"
            width="100%"
            height={350}
            sx={{ borderRadius: 2, bgcolor: "grey.200" }}
          />
        </Box>
      </Container>
    );
  }

  // Error State
  if (!clientData) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h5"
          sx={{
            color: "#757575",
            textAlign: "center",
            fontWeight: 500,
            py: 2,
            borderRadius: 1,
            bgcolor: "#f5f5f5",
            maxWidth: 600,
            mx: "auto",
          }}
        >
          Client data not found.
        </Typography>
      </Container>
    );
  }

  // Main Content
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ maxWidth: 1000, mx: "auto" }}>
        <HeaderBox>Your Properties</HeaderBox>
        <Box
          sx={{
            bgcolor: "#fff",
            borderRadius: 2,
            boxShadow: "0 2px 10px rgba(0, 0, 0, 0.05)",
            p: { xs: 2, md: 4 },
            transition: "all 0.3s ease",
            "&:hover": {
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
            },
          }}
        >
          <AssignedProperties
            clientCode={clientData.code}
            properties={clientData.assigned_properties}
          />
        </Box>
      </Box>
    </Container>
  );
};

export default ClientProperties;