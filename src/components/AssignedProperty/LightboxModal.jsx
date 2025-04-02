// src/components/AssignedProperty/LightboxModal.jsx
import React from "react";
import { Box, Typography, Dialog, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const LightboxModal = ({ open, onClose, galleryPhotos, currentIndex, setCurrentIndex }) => {
  if (!galleryPhotos || galleryPhotos.length === 0) return null;
  const currentPhoto = galleryPhotos[currentIndex];

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  const handleNext = () => {
    if (currentIndex < galleryPhotos.length - 1) setCurrentIndex(currentIndex + 1);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <Box sx={{ position: "relative", textAlign: "center", backgroundColor: "black" }}>
        <img
          src={currentPhoto.url}
          alt={`Enlarged view ${currentIndex + 1}`}
          style={{
            maxWidth: "100%",
            maxHeight: "80vh",
            objectFit: "contain",
            margin: "auto",
            display: "block",
          }}
        />
        <Typography variant="h6" sx={{ color: "white", mt: 2 }}>
          {currentPhoto.label.replace("_", " ")}
        </Typography>
        <Button onClick={onClose} sx={{ position: "absolute", top: 16, right: 16, color: "white" }}>
          <CloseIcon />
        </Button>
        {currentIndex > 0 && (
          <Button
            onClick={handlePrev}
            sx={{
              position: "absolute",
              top: "50%",
              left: 16,
              transform: "translateY(-50%)",
              color: "white",
            }}
          >
            <ArrowBackIosNewIcon />
          </Button>
        )}
        {currentIndex < galleryPhotos.length - 1 && (
          <Button
            onClick={handleNext}
            sx={{
              position: "absolute",
              top: "50%",
              right: 16,
              transform: "translateY(-50%)",
              color: "white",
            }}
          >
            <ArrowForwardIosIcon />
          </Button>
        )}
      </Box>
    </Dialog>
  );
};

export default LightboxModal;
