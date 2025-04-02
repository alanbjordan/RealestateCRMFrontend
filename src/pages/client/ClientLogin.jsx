// src/components/ClientDetails/ClientLogin.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import Logo from "../../assets/logo.svg";
import API_URLS from "../../utilities/apiConfig";

const ClientLogin = () => {
  const { clientCode: urlClientCode } = useParams();
  const navigate = useNavigate();
  const [clientCode, setClientCode] = useState(urlClientCode || "");
  const [accessKey, setAccessKey] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "error" });

  useEffect(() => {
    if (urlClientCode) {
      setClientCode(urlClientCode);
    }
  }, [urlClientCode]);

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleSnackbarClose = () => setSnackbar({ ...snackbar, open: false });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!clientCode || !accessKey) {
      setError("Please enter both client code and access key.");
      return;
    }
    // Normalize both clientCode and accessKey to uppercase
    const normalizedClientCode = clientCode.trim().toUpperCase();
    const normalizedAccessKey = accessKey.trim().toUpperCase();

    setLoading(true);
    setError("");

    try {
      // Call the new client-signin route using API_URLS.CLIENT_SIGNIN
      const response = await fetch(API_URLS.CLIENT_SIGNIN, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          client_code: normalizedClientCode,
          access_key: normalizedAccessKey,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Sign-in failed");
      }
      // Save client info to localStorage
      localStorage.setItem("clientVerified", "true");
      localStorage.setItem("clientCode", normalizedClientCode);
      localStorage.setItem("clientData", JSON.stringify(data));
      showSnackbar("Access granted.", "success");
      // Redirect to the client dashboard using the client code
      navigate(`/client-portal/client/${normalizedClientCode}`);
    } catch (err) {
      showSnackbar(err.message, "error");
    }
    setLoading(false);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Box
        component="img"
        src={Logo}
        alt="Client Portal Logo"
        sx={{ mb: 4, width: "150px" }}
      />
      <Paper
        elevation={3}
        sx={{
          p: 4,
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
          Client Login
        </Typography>
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        <Box
          component="form"
          onSubmit={handleSubmit}
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
        >
          {/* Only render client code field if not provided via URL */}
          {!urlClientCode && (
            <TextField
              label="Client Code"
              variant="outlined"
              value={clientCode}
              onChange={(e) => setClientCode(e.target.value)}
              fullWidth
              required
            />
          )}
          <TextField
            label="Access Key"
            variant="outlined"
            value={accessKey}
            onChange={(e) => setAccessKey(e.target.value)}
            fullWidth
            required
          />
          <Button variant="contained" color="primary" type="submit" fullWidth disabled={loading}>
            {loading ? <CircularProgress size={24} color="inherit" /> : "Verify"}
          </Button>
        </Box>
      </Paper>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ClientLogin;
