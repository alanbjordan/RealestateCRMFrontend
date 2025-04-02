import React, { useState, useEffect } from 'react';
import { Box, CssBaseline, Toolbar, useMediaQuery } from '@mui/material';
import { Outlet } from 'react-router-dom';
import ClientNavbar from './ClientNavbar';
import ClientSidebar from './ClientSidebar';
import ClientMobileMenu from './ClientMobileMenu';

const ClientLayout = () => {
  const isMobile = useMediaQuery('(max-width:1300px)');
  const [mobileOpen, setMobileOpen] = useState(false);
  const handleDrawerToggle = () => setMobileOpen(!mobileOpen);
  const drawerWidth = 240;

  useEffect(() => {
    // Reset body overflow in case a modal left it disabled
    document.body.style.overflow = 'auto';
  }, []);

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <ClientNavbar handleDrawerToggle={handleDrawerToggle} />
      {isMobile ? (
        <ClientMobileMenu open={mobileOpen} onClose={handleDrawerToggle} />
      ) : (
        <ClientSidebar 
          mobileOpen={mobileOpen} 
          handleDrawerToggle={handleDrawerToggle} 
          drawerWidth={drawerWidth} 
        />
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: isMobile ? '100%' : `calc(100% - ${drawerWidth}px)`,
        }}
      >
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

export default ClientLayout;
