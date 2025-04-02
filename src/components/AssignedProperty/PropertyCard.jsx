// src/components/AssignedProperty/PropertyCard.jsx
import React from "react";
import { Box, Typography, Paper, Button, Grid, Divider } from "@mui/material";

const PropertyCard = ({ property, mainPhoto, handleRequestViewing }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Grid container spacing={2}>
        {/* Left Column: Main Photo */}
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              width: "100%",
              height: "300px",
              borderRadius: "8px",
              overflow: "hidden",
            }}
          >
            <img
              src={mainPhoto}
              alt="Main Property"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </Box>
        </Grid>
        {/* Right Column: Property Details */}
        <Grid item xs={12} md={6}>
          <Typography variant="h5" sx={{ fontWeight: "bold", mb: 1 }}>
            {property.building} - {property.unit}
          </Typography>
          <Divider sx={{ my: 1 }} />
          <Typography>Status: {property.status}</Typography>
          <Typography>Size: {property.size} sqm</Typography>
          <Typography>Bedrooms: {property.bedrooms}</Typography>
          <Typography>Bathrooms: {property.bathrooms}</Typography>
          <Typography>Price: {property.price}</Typography>
          <Button variant="contained" color="primary" sx={{ mt: 2 }} onClick={handleRequestViewing}>
            Request Viewing
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default PropertyCard;
