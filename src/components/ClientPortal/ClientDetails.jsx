// ClientDetails.jsx
import React from "react";
import { Paper, Typography, Box, Grid } from "@mui/material";

// Modern Styled Paper with glassmorphism effect
const StyledPaper = ({ children }) => (
  <Paper
    elevation={0}
    sx={{
      p: 4,
      mb: 4,
      borderRadius: "16px",
      background: "rgba(255, 255, 255, 0.8)",
      backdropFilter: "blur(12px)",
      border: "1px solid rgba(255, 255, 255, 0.2)",
      boxShadow: "0 8px 32px rgba(31, 38, 135, 0.1)",
      transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
      "&:hover": {
        transform: "translateY(-6px)",
        boxShadow: "0 12px 40px rgba(31, 38, 135, 0.15)",
      },
    }}
  >
    {children}
  </Paper>
);

const DetailSection = ({ label, value }) => (
  <Box sx={{ mb: 3 }}>
    <Typography
      variant="overline"
      sx={{
        color: "#64748b",
        fontWeight: 600,
        letterSpacing: "1px",
        textTransform: "uppercase",
        opacity: 0.9,
      }}
    >
      {label}
    </Typography>
    <Typography
      variant="h6"
      sx={{
        fontWeight: 500,
        color: "#1e293b",
        lineHeight: 1.2,
        wordBreak: "break-word",
        mt: 0.5,
      }}
    >
      {value || "—"}
    </Typography>
  </Box>
);

const ClientDetails = ({ clientData }) => {
  return (
    <StyledPaper>
      <Typography
        variant="h4"
        sx={{
          fontWeight: 700,
          color: "#0f172a",
          mb: 4,
          textAlign: "center",
          letterSpacing: "-0.5px",
          background: "linear-gradient(90deg, #3b82f6, #8b5cf6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        Your Preferences
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} sm={6}>
          <DetailSection label="Contact" value={clientData.contact} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <DetailSection label="Move-in Date" value={clientData.move_in} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <DetailSection label="Size" value={clientData.size ? `${clientData.size} sqm` : "—"} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DetailSection
            label="Budget"
            value={clientData.budget ? `฿${clientData.budget.toLocaleString()}` : "—"}
          />
        </Grid>
        <Grid item xs={6} sm={3}>
          <DetailSection label="Bedrooms" value={clientData.bedrooms || 0} />
        </Grid>
        <Grid item xs={6} sm={3}>
          <DetailSection label="Bathrooms" value={clientData.bath || 0} />
        </Grid>
        <Grid item xs={12}>
          <DetailSection label="Preferences" value={clientData.preferred} />
        </Grid>
      </Grid>
    </StyledPaper>
  );
};

export default ClientDetails;