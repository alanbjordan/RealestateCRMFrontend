import React, { useState, useEffect } from "react";
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
  InputAdornment,
  FormControl,
  CircularProgress,
  InputLabel,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import API_URLS from "../../utilities/apiConfig";
import PhotoGalleryModal from "../../components/PropertyDetails/PhotoGalleryModal";
import bangkokAreas from "../../utilities/propertyData";

// Import our custom hooks
import usePropertyData from "../../hooks/usePropertyData";
import useNotification from "../../hooks/useNotification";
import usePhotoManager from "../../hooks/usePhotoManager";

const PropertyDetails = () => {
  const { propertyId } = useParams();
  const navigate = useNavigate();

  const {
    propertyData,
    setPropertyData,
    loading,
    saving,
    savePropertyData,
  } = usePropertyData(propertyId);
  const { notification, showNotification, closeNotification } = useNotification();
  const { isPhotoModalOpen, openPhotoModal, closePhotoModal } = usePhotoManager();

  // State for building options and tracking selection
  const [buildingOptions, setBuildingOptions] = useState([]);
  const [buildingsLoading, setBuildingsLoading] = useState(false);
  // selectedBuilding can be an object (existing building) or a string (free text)
  const [selectedBuilding, setSelectedBuilding] = useState("");

  // Update selectedBuilding when propertyData changes
  useEffect(() => {
    if (propertyData.building) {
      setSelectedBuilding(propertyData.building);
    }
  }, [propertyData.building]);

  // Fetch building options on mount
  useEffect(() => {
    setBuildingsLoading(true);
    fetch(API_URLS.BUILDINGS)
      .then((res) => res.json())
      .then((data) => {
        // Sort building options alphabetically by name (A-Z)
        const sortedBuildings = data.sort((a, b) =>
          a.name.localeCompare(b.name)
        );
        setBuildingOptions(sortedBuildings);
        setBuildingsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching buildings:", err);
        setBuildingsLoading(false);
      });
  }, []);
  

  const handleChange = (field, value) => {
    setPropertyData((prev) => ({ ...prev, [field]: value }));
  };

  // Handle changes from the Autocomplete field
  const handleBuildingChange = (event, newValue) => {
    if (typeof newValue === "string") {
      // User typed a building name that doesn't match an option.
      handleChange("building_id", "");
      handleChange("building", newValue);
      setSelectedBuilding(newValue);
    } else if (newValue && newValue.inputValue) {
      // Option to "quick add" a new building was selected.
      createNewBuilding(newValue.inputValue);
    } else {
      // User selected an existing building object.
      handleChange("building_id", newValue ? newValue.id : "");
      handleChange("building", newValue ? newValue.name : "");
      setSelectedBuilding(newValue ? newValue.name : "");
    }
  };

  // Quick-add function to create a new building
  const createNewBuilding = (buildingName) => {
    fetch(API_URLS.BUILDINGS, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: buildingName }),
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to create new building");
        }
        return res.json();
      })
      .then((data) => {
        // Assuming the API returns an object with { building_id: newBuildingId, ... }
        const newBuilding = { id: data.building_id, name: buildingName };
        setBuildingOptions((prev) => [...prev, newBuilding]);
        handleChange("building_id", newBuilding.id);
        handleChange("building", newBuilding.name);
        setSelectedBuilding(newBuilding.name);
        showNotification("Building created successfully", "success");
      })
      .catch((error) => {
        console.error("Error creating building:", error);
        showNotification("Error creating building", "error");
      });
  };

  // Customize filtering: if no matching building is found, offer a quick add option.
  const filterOptions = (options, params) => {
    const filtered = options.filter((option) =>
      option.name.toLowerCase().includes(params.inputValue.toLowerCase())
    );
    if (params.inputValue !== "" && filtered.length === 0) {
      filtered.push({
        inputValue: params.inputValue,
        name: `Add "${params.inputValue}"`,
      });
    }
    return filtered;
  };

  // Update photo_urls handler remains unchanged
  const updatePhotoUrls = (newPhotoUrls) => {
    setPropertyData((prev) => ({
      ...prev,
      photo_urls: newPhotoUrls,
    }));
  };

  if (loading) {
    return <Typography>Loading property data...</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ fontWeight: "bold", mb: 2 }}>
        {propertyId === "new"
          ? "Add New Property"
          : `Property Details (ID: ${propertyId})`}
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Property Info
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Property Code *"
              value={propertyData.property_code || ""}
              onChange={(e) => handleChange("property_code", e.target.value)}
              fullWidth
              required
            />
          </Grid>
          {/* Building Autocomplete */}
          <Grid item xs={12} sm={6}>
            <Autocomplete
              freeSolo
              value={selectedBuilding}
              onChange={handleBuildingChange}
              filterOptions={filterOptions}
              options={buildingOptions}
              getOptionLabel={(option) =>
                typeof option === "string" ? option : option.name
              }
              loading={buildingsLoading}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Building *"
                  variant="outlined"
                  required
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {buildingsLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                />
              )}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Unit *"
              value={propertyData.unit || ""}
              onChange={(e) => handleChange("unit", e.target.value)}
              fullWidth
              required
            />
          </Grid>
          {/* Other fields remain unchanged */}
          <Grid item xs={12} sm={6}>
            <TextField
              label="Owner"
              value={propertyData.owner || ""}
              onChange={(e) => handleChange("owner", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Contact"
              value={propertyData.contact || ""}
              onChange={(e) => handleChange("contact", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Size (sqm)"
              value={propertyData.size || ""}
              onChange={(e) => handleChange("size", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Bedrooms"
              value={propertyData.bedrooms || ""}
              onChange={(e) => handleChange("bedrooms", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Bathrooms"
              value={propertyData.bathrooms || ""}
              onChange={(e) => handleChange("bathrooms", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Year Built"
              value={propertyData.year_built || ""}
              onChange={(e) => handleChange("year_built", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              label="Floor"
              value={propertyData.floor || ""}
              onChange={(e) => handleChange("floor", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <FormControl fullWidth>
              <InputLabel id="area-label">Area</InputLabel>
              <Autocomplete
                freeSolo
                value={propertyData.area || ""}
                onChange={(e, newValue) => handleChange("area", newValue)}
                options={bangkokAreas.map((area) => area.value)}
                renderInput={(params) => (
                  <TextField {...params} label="Area" variant="outlined" />
                )}
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Status"
              value={propertyData.status || ""}
              onChange={(e) => handleChange("status", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Price"
              value={propertyData.price || ""}
              onChange={(e) => handleChange("price", e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Sell Price (THB)"
              value={propertyData.sell_price || ""}
              onChange={(e) => handleChange("sell_price", e.target.value)}
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">฿</InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Sent (Yes/No)"
              value={propertyData.sent || ""}
              onChange={(e) => handleChange("sent", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Preferred Tenant"
              value={propertyData.preferred_tenant || ""}
              onChange={(e) => handleChange("preferred_tenant", e.target.value)}
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
          <Button
            variant="contained"
            color="primary"
            onClick={() => savePropertyData(showNotification, navigate)}
            disabled={saving}
          >
            {saving
              ? propertyId === "new"
                ? "Creating..."
                : "Saving..."
              : propertyId === "new"
              ? "Create Property"
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
        photoUrls={propertyData.photo_urls}
        updatePhotoUrls={updatePhotoUrls}
      />
    </Box>
  );
};

export default PropertyDetails;
