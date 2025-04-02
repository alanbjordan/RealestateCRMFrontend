// src/components/PropertyDetails/PhotoGalleryModal.jsx
import React, { useState, useRef } from "react";
import {
  Box,
  Typography,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import API_URLS from "../../utilities/apiConfig";

const ALLOWED_LABELS = [
  "main",
  "bathroom",
  "bedroom",
  "kitchen",
  "living_room",
  "balcony",
  "closet",
  "amenities",
];

const PhotoGalleryModal = ({ open, onClose, photoUrls, updatePhotoUrls }) => {
  // State for managing selected files along with individual labels.
  const [fileUploads, setFileUploads] = useState([]);
  // State to indicate if an upload is in progress.
  const [uploading, setUploading] = useState(false);
  
  // Ref for the file input so we can reset its value.
  const fileInputRef = useRef(null);

  // Flatten photos from photoUrls into an array of { label, url } objects.
  const flattenedPhotos = Object.entries(photoUrls).flatMap(([label, urls]) =>
    urls.map((url) => ({ label, url }))
  );

  // Delete a photo from its label array.
  const handleDeletePhoto = (oldLabel, photoUrl) => {
    const updatedPhotos = {
      ...photoUrls,
      [oldLabel]: photoUrls[oldLabel].filter((url) => url !== photoUrl),
    };
    updatePhotoUrls(updatedPhotos);
  };

  // Change a photo's label.
  const handleChangeLabel = (oldLabel, photoUrl, newLabel) => {
    if (oldLabel === newLabel) return;
    const updatedOldLabel = photoUrls[oldLabel].filter((url) => url !== photoUrl);
    const updatedNewLabel = photoUrls[newLabel]
      ? [...photoUrls[newLabel], photoUrl]
      : [photoUrl];
    const updatedPhotos = {
      ...photoUrls,
      [oldLabel]: updatedOldLabel,
      [newLabel]: updatedNewLabel,
    };
    updatePhotoUrls(updatedPhotos);
  };

  // Handle file input changes.
  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files).map((file) => ({
      file,
      label: "", // Start with an empty label
    }));
    setFileUploads(filesArray);
  };

  // Update label for a specific file in fileUploads.
  const handleFileLabelChange = (index, newLabel) => {
    setFileUploads((prev) =>
      prev.map((item, idx) =>
        idx === index ? { ...item, label: newLabel } : item
      )
    );
  };

  // Upload selected files.
  const handleUploadFiles = async () => {
    setUploading(true);
    const uploadedUrlsByLabel = {};
    // Process each file individually.
    for (let i = 0; i < fileUploads.length; i++) {
      const { file, label } = fileUploads[i];
      // Only proceed if a label is chosen.
      if (!label) continue;
      const formData = new FormData();
      formData.append("file", file);
      formData.append("label", label);
      try {
        const response = await fetch(`${API_URLS.UPLOAD}`, {
          method: "POST",
          body: formData,
        });
        const data = await response.json();
        if (response.ok) {
          // Accumulate URLs under their label.
          uploadedUrlsByLabel[label] = uploadedUrlsByLabel[label]
            ? [...uploadedUrlsByLabel[label], data.url]
            : [data.url];
        } else {
          console.error("Upload failed: ", data.error);
        }
      } catch (error) {
        console.error("Upload error: ", error);
      }
    }
    // Merge new uploads with existing photos.
    const updatedPhotos = { ...photoUrls };
    for (const label in uploadedUrlsByLabel) {
      updatedPhotos[label] = updatedPhotos[label]
        ? [...updatedPhotos[label], ...uploadedUrlsByLabel[label]]
        : uploadedUrlsByLabel[label];
    }
    updatePhotoUrls(updatedPhotos);
    // Clear selected files and reset file input.
    setFileUploads([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setUploading(false);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Photo Gallery</DialogTitle>
      <DialogContent dividers>
        {flattenedPhotos.length === 0 && (
          <Typography>No photos uploaded.</Typography>
        )}
        <Grid container spacing={2}>
          {flattenedPhotos.map(({ label, url }, index) => (
            <Grid item key={index} xs={4}>
              <img
                src={url}
                alt={`Photo ${index + 1}`}
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  borderRadius: 4,
                  display: "block",
                  margin: "auto",
                }}
              />
              <FormControl fullWidth sx={{ mt: 1 }}>
                <InputLabel>Change Label</InputLabel>
                {/* Use value instead of defaultValue so it updates correctly */}
                <Select
                  label="Change Label"
                  value={label}
                  onChange={(e) =>
                    handleChangeLabel(label, url, e.target.value)
                  }
                >
                  {ALLOWED_LABELS.map((option) => (
                    <MenuItem key={option} value={option}>
                      {option.replace("_", " ")}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button
                variant="outlined"
                color="error"
                onClick={() => handleDeletePhoto(label, url)}
                sx={{ mt: 1 }}
                startIcon={<CloseIcon />}
              >
                Delete
              </Button>
            </Grid>
          ))}
        </Grid>
        {/* Upload New Photos Section */}
        <Box sx={{ mt: 4 }}>
          <Typography variant="h6">Upload New Photos</Typography>
          <Grid container spacing={2} alignItems="center" sx={{ mt: 1 }}>
            <Grid item xs={12}>
              <input
                type="file"
                multiple
                onChange={handleFileChange}
                ref={fileInputRef}
                style={{ marginTop: 8 }}
              />
            </Grid>
            {fileUploads.length > 0 && (
              <Grid item xs={12}>
                <Typography variant="subtitle1">Assign Labels</Typography>
                <Grid container spacing={2}>
                  {fileUploads.map((item, index) => (
                    <Grid item xs={12} sm={6} key={index}>
                      <Typography variant="body2">
                        {item.file.name}
                      </Typography>
                      <FormControl fullWidth size="small">
                        <InputLabel>Select Label</InputLabel>
                        <Select
                          label="Select Label"
                          value={item.label}
                          onChange={(e) =>
                            handleFileLabelChange(index, e.target.value)
                          }
                        >
                          {ALLOWED_LABELS.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option.replace("_", " ")}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}
            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={handleUploadFiles}
                disabled={uploading || fileUploads.length === 0}
                startIcon={uploading ? <CircularProgress size={20} /> : null}
              >
                {uploading ? "Uploading..." : "Upload Photos"}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};

export default PhotoGalleryModal;
