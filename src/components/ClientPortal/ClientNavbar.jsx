// src/components/ClientNavbar.jsx
import React from 'react';
import { AppBar, Toolbar, Typography, IconButton, Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useMediaQuery } from '@mui/material';

const ClientNavbar = ({ handleDrawerToggle }) => {
  const navigate = useNavigate();
  // Use the same custom query so that when width is 1300px or below, it's considered "mobile"
  const isMobile = useMediaQuery('(max-width:1300px)');
  const clientCode = localStorage.getItem('clientCode');

  const handleLogout = () => {
    localStorage.removeItem('clientVerified');
    localStorage.removeItem('clientCode');
    localStorage.removeItem('clientData');
    navigate('/client-portal'); // Redirect to client login
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        bgcolor: 'primary.main',
      }}
    >
      <Toolbar>
        {/* Show hamburger menu on screens 1300px wide and below */}
        {isMobile && (
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" sx={{ flexGrow: 1 }}>
          Amas Client Portal
        </Typography>
        {/* Show full nav links only on larger screens */}
        {!isMobile && (
          <Box>
            <Button
              color="inherit"
              onClick={() =>
                navigate(clientCode ? `/client-portal/${clientCode}/profile` : '/client-portal/profile')
              }
            >
              Profile
            </Button>
            <Button
              color="inherit"
              onClick={() =>
                navigate(clientCode ? `/client-portal/${clientCode}/properties` : '/client-portal/properties')
              }
            >
              Properties
            </Button>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default ClientNavbar;
