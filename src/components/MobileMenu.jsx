// src/components/MobileMenu.jsx
import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Grid,
  Avatar,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import BusinessIcon from "@mui/icons-material/Business";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

const MobileMenu = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Updated navigation items including Buildings
  const menuItems = [
    { label: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { label: "Clients", path: "/clients", icon: <GroupIcon /> },
    { label: "Properties", path: "/property", icon: <HomeWorkIcon /> },
    { label: "Buildings", path: "/buildings", icon: <BusinessIcon /> },
    { label: "Settings", path: "/settings", icon: <SettingsIcon /> },
  ];

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "100%", // full screen on mobile
          maxWidth: 360,  // optionally control max width
          bgcolor: "#f9fafc",
          padding: 2,
        },
      }}
    >
      {/* Header Section with Close Icon */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          Amas Technologies
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Box>

      <Divider sx={{ mb: 2 }} />

      {/* Grid Layout for Menu Items */}
      <Grid container spacing={2}>
        {menuItems.map(({ label, path, icon }) => {
          const isActive = location.pathname === path;
          return (
            <Grid item xs={6} key={label}>
              <Box
                onClick={() => {
                  navigate(path);
                  onClose(); // close after navigation
                }}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  cursor: "pointer",
                  padding: 2,
                  borderRadius: 2,
                  bgcolor: isActive ? "#ebf1fe" : "transparent",
                  "&:hover": {
                    bgcolor: "#ebf1fe",
                  },
                }}
              >
                <Avatar
                  sx={{
                    mb: 1,
                    bgcolor: isActive ? "primary.main" : "grey.300",
                  }}
                >
                  {icon}
                </Avatar>
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: isActive ? "bold" : "medium",
                    color: isActive ? "primary.main" : "text.primary",
                  }}
                >
                  {label}
                </Typography>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      {/* Footer/Logout section at the bottom */}
      <Box sx={{ mt: "auto", pt: 2 }}>
        <Divider sx={{ mb: 2 }} />
        <Box
          onClick={() => {
            console.log("Logging out...");
            navigate("/");
            onClose();
          }}
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 1,
            cursor: "pointer",
            p: 2,
            borderRadius: 2,
            "&:hover": { bgcolor: "#fdecea" },
          }}
        >
          <Avatar sx={{ bgcolor: "error.main" }}>
            <LogoutIcon />
          </Avatar>
          <Typography variant="body1" sx={{ color: "error.main" }}>
            Logout
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default MobileMenu;
