import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  CircularProgress
} from "@mui/material";
import Logo from "../assets/logo.svg";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please enter both email and password.");
      return;
    }

    setLoading(true);
    setError("");

    const herokuUrl = "https://amas-684e6c6cf352.herokuapp.com/signin";
    const localUrl = "http://127.0.0.1:5000/signin";
    const payload = JSON.stringify({ email, password });

    try {
      // Try the primary (Heroku) endpoint first
      let response = await fetch(herokuUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      });

      if (!response.ok) {
        // If response status is not ok, throw an error to trigger fallback
        throw new Error("Heroku endpoint failed");
      }

      const data = await response.json();
      console.log("Heroku server response:", data);
      setLoading(false);
      navigate("/dashboard");
    } catch (err) {
      console.error("Primary login attempt failed, trying fallback:", err);
      // Fallback: Try the local endpoint
      try {
        let response = await fetch(localUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: payload,
        });

        if (!response.ok) {
          const errorData = await response.json();
          setError(errorData.error || "Invalid email or password on fallback.");
          setLoading(false);
          return;
        }

        const data = await response.json();
        console.log("Fallback server response:", data);
        setLoading(false);
        navigate("/dashboard");
      } catch (fallbackErr) {
        console.error("Fallback login attempt failed:", fallbackErr);
        setError("Both primary and fallback login attempts failed. Please try again later.");
        setLoading(false);
      }
    }
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
      {/* Logo */}
      <Box
        component="img"
        src={Logo}
        alt="App Logo"
        sx={{ mb: 4, width: "150px" }}
      />

      {/* Login Form Card */}
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
          Login
        </Typography>

        {/* Error Message */}
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
          <TextField
            label="Email"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            required
          />
          <TextField
            label="Password"
            variant="outlined"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            required
          />
          <Button
            variant="contained"
            color="primary"
            type="submit"
            fullWidth
            disabled={loading}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              "Login"
            )}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
