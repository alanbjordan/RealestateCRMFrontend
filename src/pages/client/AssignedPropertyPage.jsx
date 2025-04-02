import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, Button, Snackbar, Alert } from "@mui/material";
import API_URLS from "../../utilities/apiConfig";
import PropertyCard from "../../components/AssignedProperty/PropertyCard";
import PhotoGallery from "../../components/AssignedProperty/PhotoGallery";
import PropertyNotes from "../../components/AssignedProperty/PropertyNotes";
import LightboxModal from "../../components/AssignedProperty/LightboxModal";

const AssignedPropertyPage = () => {
  // Extract clientCode and propertyId from the URL
  const { clientCode, propertyId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [property, setProperty] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("success");

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetch(`${API_URLS.PROPERTIES}/${propertyId}`)
      .then((response) => {
        if (!response.ok) throw new Error("Property not found");
        return response.json();
      })
      .then((data) => {
        data.photo_urls = data.photo_urls || {};
        setProperty(data);
        setNotes(data.notes || []);
      })
      .catch((error) => {
        showSnackbar("Property not found.", "error");
        navigate(`/client-portal/client/${clientCode}`);
      });
  }, [propertyId, clientCode, navigate]);

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  // Back button always routes to the All Properties page
  const handleBack = () => {
    navigate(`/client-portal/client/${clientCode}/properties`);
  };

  if (!property) {
    return <Typography sx={{ p: 3 }}>Loading property details...</Typography>;
  }

  // Compute main photo
  const mainPhoto =
    property.photo_urls?.main && property.photo_urls.main.length > 0
      ? property.photo_urls.main[0]
      : "https://via.placeholder.com/400x300";

  // Build gallery photos array
  const galleryPhotos = [];
  Object.entries(property.photo_urls || {}).forEach(([label, urls]) => {
    if (label === "main") {
      if (urls.length > 1) {
        urls.slice(1).forEach((url) => galleryPhotos.push({ label, url }));
      }
    } else {
      urls.forEach((url) => galleryPhotos.push({ label, url }));
    }
  });

  const handleAddNote = () => {
    if (!newNote.trim()) return;
    const updatedNotes = [...notes, newNote];
    setNotes(updatedNotes);
    setNewNote("");
    showSnackbar("Note added successfully.", "success");
  };

  const handleRequestViewing = () => {
    showSnackbar("Viewing request sent!", "success");
  };

  return (
    <Box sx={{ p: { xs: 2, md: 4 }, maxWidth: 1000, mx: "auto" }}>
      <Typography
        variant="h4"
        sx={{ fontWeight: "bold", mb: 3, textAlign: "center" }}
      >
        Property Details
      </Typography>
      <Button variant="outlined" onClick={handleBack} sx={{ mb: 2 }}>
        Back to All Properties
      </Button>
      <PropertyCard
        property={property}
        mainPhoto={mainPhoto}
        handleRequestViewing={handleRequestViewing}
      />
      {galleryPhotos.length > 0 && (
        <PhotoGallery
          galleryPhotos={galleryPhotos}
          setCurrentIndex={setCurrentIndex}
          setLightboxOpen={setLightboxOpen}
        />
      )}
      <PropertyNotes
        notes={notes}
        newNote={newNote}
        setNewNote={setNewNote}
        handleAddNote={handleAddNote}
      />
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      <LightboxModal
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        galleryPhotos={galleryPhotos}
        currentIndex={currentIndex}
        setCurrentIndex={setCurrentIndex}
      />
    </Box>
  );
};

export default AssignedPropertyPage;
