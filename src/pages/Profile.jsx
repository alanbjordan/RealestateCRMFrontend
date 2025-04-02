import React from "react";
import { Box, Typography, TextField, Button, Avatar } from "@mui/material";

const Profile = () => {
  return (
    <Box sx={{ maxWidth: 500, mx: "auto", mt: 4, p: 3, bgcolor: "white", borderRadius: 2, boxShadow: 3 }}>
      <Typography variant="h4" sx={{ mb: 3, textAlign: "center" }}>
        Profile
      </Typography>

      {/* Avatar */}
      <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
        <Avatar sx={{ width: 100, height: 100 }} />
      </Box>

      {/* Profile Form */}
      <TextField label="Full Name" variant="outlined" fullWidth sx={{ mb: 2 }} />
      <TextField label="Email Address" type="email" variant="outlined" fullWidth sx={{ mb: 2 }} />
      <TextField label="Phone Number" type="tel" variant="outlined" fullWidth sx={{ mb: 2 }} />

      <Button variant="contained" color="primary" fullWidth>
        Update Profile
      </Button>
    </Box>
  );
};

export default Profile;
