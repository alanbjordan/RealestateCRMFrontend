import React, { useState } from "react";
import {
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  Snackbar,
  Alert,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import API_URLS from "../../utilities/apiConfig";

const ClientProfileForm = ({ clientData, setClientData }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: clientData.title || "",
    first_name: clientData.first_name || "",
    last_name: clientData.last_name || "",
    nationality: clientData.nationality || "",
    contact: clientData.contact || "",
    move_in: clientData.move_in || "",
    budget: clientData.budget || "",
    bedrooms: clientData.bedrooms || "",
    bath: clientData.bath || "",
    // New field "size" added:
    size: clientData.size || "",
    // We'll remove "area" from its previous full-width row and include it with "size"
    area: clientData.area || "",
    preferred: clientData.preferred || "",
  });
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch(`${API_URLS.CLIENTS}/${clientData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        const updatedClient = await response.json();
        // Ensure the client code is preserved:
        const code = updatedClient.code || clientData.code || localStorage.getItem("clientCode");
        if (!code) {
          console.error("Client code is missing from the updated data.");
        }
        updatedClient.code = code; // Ensure code is set
        setClientData(updatedClient);
        localStorage.setItem("clientData", JSON.stringify(updatedClient));
        setSnackbar({ open: true, message: "Profile updated successfully", severity: "success" });
        // Redirect to the dashboard after a short delay and do not reset isSubmitting
        setTimeout(() => {
          navigate(`/client-portal/client/${code}`);
        }, 1500);
        return; // Exit early to avoid calling setIsSubmitting(false)
      } else {
        const err = await response.json();
        setSnackbar({ open: true, message: err.error || "Update failed", severity: "error" });
      }
    } catch (error) {
      console.error("Error during profile update:", error);
      setSnackbar({ open: true, message: "Update failed", severity: "error" });
    }
    // Only re-enable the button if an error occurred.
    setIsSubmitting(false);
  };
  

  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Edit Your Profile
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Row 1: Title, First Name */}
          <Grid item xs={12} sm={6}>
            <TextField label="Title" name="title" value={formData.title} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="First Name" name="first_name" value={formData.first_name} onChange={handleChange} fullWidth required />
          </Grid>
          {/* Row 2: Last Name, Nationality */}
          <Grid item xs={12} sm={6}>
            <TextField label="Last Name" name="last_name" value={formData.last_name} onChange={handleChange} fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Nationality" name="nationality" value={formData.nationality} onChange={handleChange} fullWidth />
          </Grid>
          {/* Row 3: Contact */}
          <Grid item xs={12}>
            <TextField label="Contact" name="contact" value={formData.contact} onChange={handleChange} fullWidth />
          </Grid>
          {/* Row 4: Move-In Date, Budget */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Move-In Date"
              name="move_in"
              type="date"
              value={formData.move_in}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Budget" name="budget" value={formData.budget} onChange={handleChange} fullWidth type="number" />
          </Grid>
          {/* Row 5: Bedrooms, Bath */}
          <Grid item xs={12} sm={6}>
            <TextField label="Bedrooms" name="bedrooms" value={formData.bedrooms} onChange={handleChange} fullWidth type="number" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Bath" name="bath" value={formData.bath} onChange={handleChange} fullWidth type="number" />
          </Grid>
          {/* Row 6: Area and Size (sqm) side by side */}
          <Grid item xs={12} sm={6}>
            <TextField label="Area" name="area" value={formData.area} onChange={handleChange} fullWidth />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Size (sqm)" name="size" value={formData.size} onChange={handleChange} fullWidth />
          </Grid>
          {/* Row 7: Preferences */}
          <Grid item xs={12}>
            <TextField label="Preferences" name="preferred" value={formData.preferred} onChange={handleChange} fullWidth multiline rows={3} />
          </Grid>
          {/* Submit Button */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" fullWidth disabled={isSubmitting}>
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Update Profile"}
            </Button>
          </Grid>
        </Grid>
      </form>
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
    </Paper>
  );
};

export default ClientProfileForm;
