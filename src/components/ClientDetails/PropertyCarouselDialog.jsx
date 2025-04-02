// src/components/ClientDetails/PropertyCarouselDialog.jsx
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Box, IconButton, Button } from "@mui/material";
import { ArrowBackIos, ArrowForwardIos } from "@mui/icons-material";

const PropertyCarouselDialog = ({ open, onClose, carouselImages, currentIndex, handlePrevImage, handleNextImage }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Property Images</DialogTitle>
      <DialogContent>
        <Box display="flex" alignItems="center" justifyContent="center">
          <IconButton onClick={handlePrevImage} disabled={currentIndex === 0}>
            <ArrowBackIos />
          </IconButton>
          <img
            src={carouselImages[currentIndex]}
            alt={`Image ${currentIndex + 1}`}
            style={{ maxWidth: "100%", maxHeight: "400px", margin: "0 16px" }}
          />
          <IconButton onClick={handleNextImage} disabled={currentIndex === carouselImages.length - 1}>
            <ArrowForwardIos />
          </IconButton>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PropertyCarouselDialog;
