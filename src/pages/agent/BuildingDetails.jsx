import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Snackbar,
  Alert,
  FormControl,
} from "@mui/material";
import API_URLS from "../../utilities/apiConfig";
import useBuildingData from "../../hooks/useBuildingData";
import useNotification from "../../hooks/useNotification";
import usePhotoManager from "../../hooks/usePhotoManager"; // reuse your photo modal hook/component
import PhotoGalleryModal from "../../components/PropertyDetails/PhotoGalleryModal"; // if you want to reuse the same component

const BuildingDetails = () => {
  const { buildingId } = useParams();
  const navigate = useNavigate();
  const { buildingData, setBuildingData, loading, saving, saveBuildingData } = useBuildingData(buildingId);
  const { notification, showNotification, closeNotification } = useNotification();
  const { isPhotoModalOpen, openPhotoModal, closePhotoModal } = usePhotoManager();

  const handleChange = (field, value) => {
    setBuildingData((prev) => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return <Typography>Loading building data...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
        {buildingId === "new"
          ? "Add New Building"
          : `Building Details (ID: ${buildingId})`}
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Building Info
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Building Name *"
              value={buildingData.name || ""}
              onChange={(e) => handleChange("name", e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Year Built"
              value={buildingData.year_built || ""}
              onChange={(e) => handleChange("year_built", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nearest BTS"
              value={buildingData.nearest_bts || ""}
              onChange={(e) => handleChange("nearest_bts", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Nearest MRT"
              value={buildingData.nearest_mrt || ""}
              onChange={(e) => handleChange("nearest_mrt", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Distance to BTS"
              value={buildingData.distance_to_bts || ""}
              onChange={(e) => handleChange("distance_to_bts", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Distance to MRT"
              value={buildingData.distance_to_mrt || ""}
              onChange={(e) => handleChange("distance_to_mrt", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Facilities"
              value={buildingData.facilities || ""}
              onChange={(e) => handleChange("facilities", e.target.value)}
              fullWidth
              multiline
              rows={2}
            />
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={openPhotoModal} sx={{ mt: 2 }}>
              Manage Photos
            </Button>
          </Grid>
        </Grid>

        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button variant="contained" color="primary" onClick={() => saveBuildingData(showNotification, navigate)} disabled={saving}>
            {saving
              ? buildingId === "new"
                ? "Creating..."
                : "Saving..."
              : buildingId === "new"
              ? "Create Building"
              : "Save Changes"}
          </Button>
          <Button variant="outlined" onClick={() => navigate(-1)} disabled={saving}>
            Back
          </Button>
        </Box>
      </Paper>

      <Snackbar
        open={notification.open}
        autoHideDuration={3000}
        onClose={closeNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={closeNotification} severity={notification.severity} sx={{ width: "100%" }}>
          {notification.message}
        </Alert>
      </Snackbar>

      <PhotoGalleryModal
        open={isPhotoModalOpen}
        onClose={closePhotoModal}
        photoUrls={buildingData.photo_urls}
        updatePhotoUrls={(newUrls) =>
          setBuildingData((prev) => ({ ...prev, photo_urls: newUrls }))
        }
      />
    </Box>
  );
};

export default BuildingDetails;
