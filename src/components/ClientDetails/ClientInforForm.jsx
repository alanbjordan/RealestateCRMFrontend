// src/components/ClientDetails/ClientInfoForm.jsx
import React from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";

const ClientInfoForm = ({ clientData, handleChange, handleSave, navigateBack, countries, saving, clientId }) => {
  return (
    <Paper sx={{ p: 2, mb: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Client Info
      </Typography>
      <Grid container spacing={2}>
        {/* Code Field */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Code *"
            value={clientData.code || ""}
            onChange={(e) => handleChange("code", e.target.value)}
            fullWidth
            required
            disabled={clientId !== "new"}
          />
        </Grid>
        {/* Title */}
        <Grid item xs={12} sm={2}>
          <FormControl fullWidth>
            <InputLabel>Title</InputLabel>
            <Select
              label="Title"
              value={clientData.title || ""}
              onChange={(e) => handleChange("title", e.target.value)}
            >
              <MenuItem value="Mr.">Mr.</MenuItem>
              <MenuItem value="Ms.">Ms.</MenuItem>
              <MenuItem value="Mrs.">Mrs.</MenuItem>
              <MenuItem value="Miss">Miss</MenuItem>
              <MenuItem value="Dr.">Dr.</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* First Name */}
        <Grid item xs={12} sm={5}>
          <TextField
            label="First Name *"
            value={clientData.first_name || ""}
            onChange={(e) => handleChange("first_name", e.target.value)}
            fullWidth
            required
          />
        </Grid>
        {/* Last Name */}
        <Grid item xs={12} sm={5}>
          <TextField
            label="Last Name *"
            value={clientData.last_name || ""}
            onChange={(e) => handleChange("last_name", e.target.value)}
            fullWidth
            required
          />
        </Grid>
        {/* Nationality */}
        <Grid item xs={12} sm={6}>
          <FormControl fullWidth>
            <InputLabel>Nationality</InputLabel>
            <Select
              label="Nationality"
              value={clientData.nationality || ""}
              onChange={(e) => handleChange("nationality", e.target.value)}
            >
              {countries.map((country) => (
                <MenuItem key={country} value={country}>
                  {country}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        {/* Contact Type */}
        <Grid item xs={12} sm={4}>
          <FormControl fullWidth>
            <InputLabel>Contact Type</InputLabel>
            <Select
              label="Contact Type"
              value={clientData.contact_type || ""}
              onChange={(e) => handleChange("contact_type", e.target.value)}
            >
              <MenuItem value="WhatsApp">WhatsApp</MenuItem>
              <MenuItem value="Line">Line</MenuItem>
              <MenuItem value="Phone">Phone</MenuItem>
              <MenuItem value="Email">Email</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* Contact (Now required) */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Contact *"
            value={clientData.contact || ""}
            onChange={(e) => handleChange("contact", e.target.value)}
            fullWidth
            required
          />
        </Grid>
        {/* Starting Date */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Starting Date"
            type="date"
            value={clientData.starting_date || ""}
            onChange={(e) => handleChange("starting_date", e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        {/* Move-in */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Move-in"
            type="date"
            value={clientData.move_in || ""}
            onChange={(e) => handleChange("move_in", e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        {/* Budget */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="Budget"
            value={clientData.budget || ""}
            onChange={(e) => handleChange("budget", e.target.value)}
            fullWidth
            InputProps={{
              startAdornment: <InputAdornment position="start">฿</InputAdornment>,
            }}
          />
        </Grid>
        {/* Bedrooms */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="Bedrooms"
            value={clientData.bedrooms || ""}
            onChange={(e) => handleChange("bedrooms", e.target.value)}
            fullWidth
          />
        </Grid>
        {/* Bath */}
        <Grid item xs={12} sm={4}>
          <TextField
            label="Bath"
            value={clientData.bath || ""}
            onChange={(e) => handleChange("bath", e.target.value)}
            fullWidth
          />
        </Grid>
        {/* Area */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Area"
            value={clientData.area || ""}
            onChange={(e) => handleChange("area", e.target.value)}
            fullWidth
          />
        </Grid>
        {/* Status */}
        <Grid item xs={12} sm={6}>
          <TextField
            label="Status"
            value={clientData.status || ""}
            onChange={(e) => handleChange("status", e.target.value)}
            fullWidth
          />
        </Grid>
        {/* Preferred */}
        <Grid item xs={12}>
          <TextField
            label="Preferred"
            value={clientData.preferred || ""}
            onChange={(e) => handleChange("preferred", e.target.value)}
            fullWidth
            multiline
            rows={3}
          />
        </Grid>
        {/* Work Sheet */}
        <Grid item xs={12}>
          <TextField
            label="Work Sheet"
            value={clientData.work_sheet || ""}
            onChange={(e) => handleChange("work_sheet", e.target.value)}
            fullWidth
          />
        </Grid>
      </Grid>
      <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
        <Button variant="contained" color="primary" onClick={handleSave} disabled={saving}>
          {saving
            ? clientId === "new"
              ? "Creating..."
              : "Saving..."
            : clientId === "new"
            ? "Create Client"
            : "Save Changes"}
        </Button>
        <Button variant="outlined" onClick={navigateBack} disabled={saving}>
          Back
        </Button>
      </Box>
    </Paper>
  );
};

export default ClientInfoForm;
