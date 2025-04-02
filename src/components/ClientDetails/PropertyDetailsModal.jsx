// src/components/ClientDetails/PropertyDetailsModal.jsx
import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Typography, Box } from "@mui/material";

const PropertyDetailsModal = ({ open, onClose, selectedProperty }) => {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Property Details</DialogTitle>
      <DialogContent dividers>
        {selectedProperty ? (
          <Box>
            <Typography variant="subtitle1">
              <strong>Property Code:</strong> {selectedProperty.property_code}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Building:</strong> {selectedProperty.building}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Unit:</strong> {selectedProperty.unit}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Owner:</strong> {selectedProperty.owner}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Contact:</strong> {selectedProperty.contact}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Size:</strong> {selectedProperty.size}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Bedrooms:</strong> {selectedProperty.bedrooms}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Bathrooms:</strong> {selectedProperty.bathrooms}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Year Built:</strong> {selectedProperty.year_built}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Floor:</strong> {selectedProperty.floor}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Area:</strong> {selectedProperty.area}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Status:</strong> {selectedProperty.status}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Price:</strong> {selectedProperty.price}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Sell Price:</strong> {selectedProperty.sell_price}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Sent:</strong> {selectedProperty.sent}
            </Typography>
            <Typography variant="subtitle1">
              <strong>Preferred Tenant:</strong> {selectedProperty.preferred_tenant}
            </Typography>
          </Box>
        ) : (
          <Typography>No property details available.</Typography>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PropertyDetailsModal;
