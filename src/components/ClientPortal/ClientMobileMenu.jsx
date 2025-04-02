import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Drawer, Box, Typography, IconButton, Divider, Grid, Avatar } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import PersonIcon from "@mui/icons-material/Person";
import ApartmentIcon from "@mui/icons-material/Apartment";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const ClientMobileMenu = ({ open, onClose }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Retrieve client code from localStorage
  const clientCode = localStorage.getItem("clientCode");

  // Define client-specific menu items
  const menuItems = [
    {
      label: "Home",
      path: clientCode ? `/client-portal/client/${clientCode}` : "/client-portal",
      icon: <HomeIcon />,
    },
    {
      label: "Profile",
      path: clientCode ? `/client-portal/client/${clientCode}/profile` : "/client-portal/profile",
      icon: <PersonIcon />,
    },
    {
      label: "Properties",
      path: clientCode ? `/client-portal/client/${clientCode}/properties` : "/client-portal/properties",
      icon: <ApartmentIcon />,
    },
  ];

  return (
    <Drawer
      anchor="left"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: "100%", // Full screen on mobile
          maxWidth: 360,
          bgcolor: "#f9fafc",
          padding: 2,
        },
      }}
    >
      {/* Header Section with Close Icon */}
      <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: "bold" }}>
          CondoApp Client Portal
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
                  onClose(); // Close menu after navigation
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
            localStorage.removeItem("clientVerified");
            localStorage.removeItem("clientCode");
            localStorage.removeItem("clientData");
            navigate("/client-portal"); // Redirect to client login
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
            <ExitToAppIcon />
          </Avatar>
          <Typography variant="body1" sx={{ color: "error.main" }}>
            Logout
          </Typography>
        </Box>
      </Box>
    </Drawer>
  );
};

export default ClientMobileMenu;
