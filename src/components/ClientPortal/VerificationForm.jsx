// src/components/ClientPortal/VerificationForm.jsx
import React from "react";
import { Box, Typography, Paper, TextField, Button, Snackbar, Alert } from "@mui/material";

const VerificationForm = ({
  inputSecret,
  setInputSecret,
  handleVerify,
  snackbarOpen,
  snackbarMessage,
  snackbarSeverity,
  handleSnackbarClose,
}) => {
  return (
    <Box
      sx={{
        p: 3,
        maxWidth: 400,
        mx: "auto",
        mt: { xs: 5, md: 8 },
        textAlign: "center",
      }}
    >
      <Typography variant="h5" sx={{ mb: 2, fontWeight: "bold" }}>
        Enter Your Access Code
      </Typography>
      <Paper elevation={3} sx={{ p: 3 }}>
        <TextField
          label="Access Code"
          value={inputSecret}
          onChange={(e) => setInputSecret(e.target.value)}
          fullWidth
        />
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2 }}
          fullWidth
          onClick={handleVerify}
        >
          Verify
        </Button>
      </Paper>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: "100%" }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default VerificationForm;
