// src/components/Properties/PropertiesFilterModal.jsx
import React from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: { xs: "95%", sm: "90%" },
  maxWidth: 600,
  maxHeight: { xs: "90vh", sm: "80vh" },
  overflowY: "auto",
  bgcolor: "background.paper",
  borderRadius: 2,
  boxShadow: 24,
  p: 3,
};

const PropertiesFilterModal = ({
  open,
  onClose,
  onApply, // new callback for applying filters
  filters = { building: "", owner: "", status: "" },
  setFilters,
  numericFilters = {
    size: { min: "", max: "" },
    bedrooms: { min: "", max: "" },
    bathrooms: { min: "", max: "" },
    price: { min: "", max: "" },
  },
  setNumericFilters,
  handleResetFilters,
}) => {
  const handleFilterChange = (field, value) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
  };

  const handleNumericFilterChange = (field, bound, value) => {
    setNumericFilters((prev) => ({
      ...prev,
      [field]: { ...prev[field], [bound]: value },
    }));
  };

  const handleApply = () => {
    // You can add additional logic here if needed.
    // For now, we'll simply call the onApply callback if provided.
    if (onApply) {
      onApply();
    } else {
      onClose();
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        {/* Modal Header */}
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h6">Filter Properties</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>

        {/* General Filters */}
        <Typography variant="subtitle1" sx={{ mt: 1, mb: 1, fontWeight: "bold" }}>
          General Filters
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Building Name"
              value={filters.building}
              onChange={(e) => handleFilterChange("building", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Owner Name"
              value={filters.owner}
              onChange={(e) => handleFilterChange("owner", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Property Status"
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              fullWidth
            />
          </Grid>
        </Grid>

        {/* Numeric Filters */}
        <Typography variant="subtitle1" sx={{ mt: 2, mb: 1, fontWeight: "bold" }}>
          Numeric Filters (Range)
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          {/* Size */}
          <Grid item xs={12} sm={4}>
            <Typography>Size (SQM)</Typography>
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              label="Min"
              value={numericFilters.size.min}
              onChange={(e) =>
                handleNumericFilterChange("size", "min", e.target.value)
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              label="Max"
              value={numericFilters.size.max}
              onChange={(e) =>
                handleNumericFilterChange("size", "max", e.target.value)
              }
              fullWidth
            />
          </Grid>

          {/* Bedrooms */}
          <Grid item xs={12} sm={4}>
            <Typography>Bedrooms</Typography>
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              label="Min"
              value={numericFilters.bedrooms.min}
              onChange={(e) =>
                handleNumericFilterChange("bedrooms", "min", e.target.value)
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              label="Max"
              value={numericFilters.bedrooms.max}
              onChange={(e) =>
                handleNumericFilterChange("bedrooms", "max", e.target.value)
              }
              fullWidth
            />
          </Grid>

          {/* Bathrooms */}
          <Grid item xs={12} sm={4}>
            <Typography>Bathrooms</Typography>
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              label="Min"
              value={numericFilters.bathrooms.min}
              onChange={(e) =>
                handleNumericFilterChange("bathrooms", "min", e.target.value)
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              label="Max"
              value={numericFilters.bathrooms.max}
              onChange={(e) =>
                handleNumericFilterChange("bathrooms", "max", e.target.value)
              }
              fullWidth
            />
          </Grid>

          {/* Price */}
          <Grid item xs={12} sm={4}>
            <Typography>Price</Typography>
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              label="Min"
              value={numericFilters.price.min}
              onChange={(e) =>
                handleNumericFilterChange("price", "min", e.target.value)
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={6} sm={4}>
            <TextField
              label="Max"
              value={numericFilters.price.max}
              onChange={(e) =>
                handleNumericFilterChange("price", "max", e.target.value)
              }
              fullWidth
            />
          </Grid>
        </Grid>

        <Box display="flex" justifyContent="space-between" mt={2}>
          <Button variant="outlined" onClick={handleResetFilters}>
            Reset Filters
          </Button>
          <Button variant="contained" onClick={handleApply}>
            Apply Filters
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default PropertiesFilterModal;
