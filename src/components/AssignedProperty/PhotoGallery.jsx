// src/components/AssignedProperty/PhotoGallery.jsx
import React from "react";
import { Box, Typography, Paper, Grid } from "@mui/material";

const PhotoGallery = ({ galleryPhotos, setCurrentIndex, setLightboxOpen }) => {
  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Gallery
      </Typography>
      <Grid container spacing={2}>
        {galleryPhotos.map((photo, index) => (
          <Grid item xs={6} sm={4} md={3} key={index}>
            <Box
              onClick={() => {
                setCurrentIndex(index);
                setLightboxOpen(true);
              }}
              sx={{ cursor: "pointer" }}
            >
              <img
                src={photo.url}
                alt={`Property photo ${index + 1}`}
                style={{
                  width: "100%",
                  height: "150px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
            </Box>
            <Typography variant="body2" align="center" sx={{ mt: 1 }}>
              {photo.label.replace("_", " ")}
            </Typography>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );
};

export default PhotoGallery;
