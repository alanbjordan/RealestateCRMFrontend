import React, { useState } from "react";
import {
  Paper,
  Typography,
  Box,
  IconButton,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Icons
import KingBedIcon from "@mui/icons-material/KingBed";
import BathtubIcon from "@mui/icons-material/Bathtub";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import BusinessIcon from "@mui/icons-material/Business";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const PropertyCard = ({ property, clientCode }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // Flatten all photo arrays into a single array
  const allPhotos = Object.values(property.photo_urls || {}).flat();
  // Fallback image if none
  const photos = allPhotos.length > 0 ? allPhotos : ["https://via.placeholder.com/400"];

  const handlePrev = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? photos.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === photos.length - 1 ? 0 : prev + 1));
  };

  // Open property in new tab
  const openPropertyInNewTab = () => {
    const url = `${window.location.origin}/client-portal/client/${clientCode}/property/${property.id}`;
    window.open(url, "_blank");
  };

  return (
    <Paper
      elevation={4}
      sx={{
        maxWidth: 400,
        margin: "16px auto",
        borderRadius: 5,
        overflow: "hidden",
        cursor: "pointer",
        transition: "all 0.3s ease",
        "&:hover": {
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
          transform: "translateY(-4px)",
        },
      }}
      onClick={openPropertyInNewTab}
    >
      {/* Image Container with Modern Overlay */}
      <Box
        sx={{
          position: "relative",
          width: "100%",
          height: 250,
          overflow: "hidden",
        }}
      >
        <img
          src={photos[currentIndex]}
          alt="Property"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "opacity 0.3s ease",
          }}
        />

        {photos.length > 1 && (
          <>
            <IconButton
              onClick={handlePrev}
              sx={{
                position: "absolute",
                top: "50%",
                left: 12,
                transform: "translateY(-50%)",
                color: "#fff",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "50%",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
              }}
            >
              <ArrowBackIosIcon fontSize="small" />
            </IconButton>

            <IconButton
              onClick={handleNext}
              sx={{
                position: "absolute",
                top: "50%",
                right: 12,
                transform: "translateY(-50%)",
                color: "#fff",
                backgroundColor: "rgba(0, 0, 0, 0.5)",
                borderRadius: "50%",
                "&:hover": { backgroundColor: "rgba(0, 0, 0, 0.7)" },
              }}
            >
              <ArrowForwardIosIcon fontSize="small" />
            </IconButton>
          </>
        )}

        {/* Overlay with Property Status or Badge */}
        <Box
          sx={{
            position: "absolute",
            top: 12,
            left: 12,
            backgroundColor: "#ff5722",
            color: "#fff",
            padding: "4px 12px",
            borderRadius: 8,
            fontSize: "0.75rem",
            fontWeight: "bold",
          }}
        >
          For Rent
        </Box>
      </Box>

      {/* Property Details Section */}
      <Box sx={{ p: 2 }}>
        {/* Add Area / Location Data */}
        <Typography
          variant="subtitle2"
          sx={{ color: "#666", fontSize: "0.875rem", mb: 1 }}
        >
          {property.location || ""}
        </Typography>

        {/* Building and Price (Vertical Layout) */}
        <Box sx={{ mb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {property.building || "A Space"} - {property.unit || "Unit 624"}
          </Typography>
          <Typography
            variant="h6"
            sx={{ fontWeight: 600, color: "#ff5722" }}
          >
            {property.price ? `฿${property.price}/month` : "฿--/month"}
          </Typography>
        </Box>

        {/* Details Row */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 2,
            mb: 2,
            alignItems: "center",
          }}
        >
          <InfoItem
            icon={<KingBedIcon fontSize="small" />}
            label={`${property.bedrooms ?? 0} Beds`}
          />
          <InfoItem
            icon={<BathtubIcon fontSize="small" />}
            label={`${property.bathrooms ?? 0} Baths`}
          />
          <InfoItem
            icon={<SquareFootIcon fontSize="small" />}
            label={property.size ? `${property.size} sqm` : "-- sqm"}
          />
          <InfoItem
            icon={<BusinessIcon fontSize="small" />}
            label={property.year_built ? `${property.year_built}` : "--"}
          />
        </Box>

        {/* Additional Info */}
        <Typography
          variant="caption"
          sx={{ color: "#757575", display: "block", mb: 1 }}
        >
          Listed on {property.listed_date || "Mar 18, 2025"} ({property.days_ago || "0"} days ago)
        </Typography>

        {/* Contact Button */}
        <Button
          variant="contained"
          color="primary"
          size="small"
          fullWidth
          sx={{
            borderRadius: 8,
            textTransform: "none",
            fontWeight: 500,
          }}
          onClick={(e) => {
            e.stopPropagation();
            console.log("Contact Agent clicked");
          }}
        >
          Request Viewing
        </Button>
      </Box>
    </Paper>
  );
};

/** Small helper component to display an icon + label together */
const InfoItem = ({ icon, label }) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
    {icon}
    <Typography variant="body2" sx={{ color: "#424242" }}>
      {label}
    </Typography>
  </Box>
);

export default PropertyCard;
