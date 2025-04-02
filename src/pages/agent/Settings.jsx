import React from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  Switch,
  FormControlLabel,
  Button
} from "@mui/material";

const Settings = () => {
  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        p: 3,
        bgcolor: "white",
        borderRadius: 2,
        boxShadow: 3
      }}
    >
      {/* Page Title */}
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center", fontWeight: "bold" }}>
        Settings
      </Typography>

      {/* Profile Section */}
      <Box sx={{ textAlign: "center", mb: 4 }}>
        <Avatar sx={{ width: 100, height: 100, mx: "auto", mb: 2 }} />
        <TextField
          label="Full Name"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Email Address"
          type="email"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
        <TextField
          label="Phone Number"
          type="tel"
          variant="outlined"
          fullWidth
          sx={{ mb: 2 }}
        />
        <Button variant="contained" color="primary" fullWidth sx={{ mb: 2 }}>
          Update Profile
        </Button>
      </Box>

      {/* Divider (optional) */}
      <Box
        sx={{
          height: 1,
          backgroundColor: "#e0e0e0",
          my: 3
        }}
      />

      {/* Settings Toggles Section */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h5" sx={{ mb: 2, fontWeight: "medium" }}>
          Preferences
        </Typography>

        <FormControlLabel
          control={<Switch />}
          label="Enable Notifications"
          sx={{ mb: 2, display: "block" }}
        />
        <FormControlLabel
          control={<Switch />}
          label="Dark Mode"
          sx={{ mb: 2, display: "block" }}
        />
        <FormControlLabel
          control={<Switch />}
          label="Auto Updates"
          sx={{ mb: 2, display: "block" }}
        />

        <Button variant="contained" color="primary" fullWidth>
          Save Settings
        </Button>
      </Box>
    </Box>
  );
};

export default Settings;
