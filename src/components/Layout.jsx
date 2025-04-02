import React, { useState } from "react";
import { Box, CssBaseline, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileMenu from "./MobileMenu";

const Layout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed((prev) => !prev);
  };

  // Set drawer width based on collapsed state
  const drawerWidth = sidebarCollapsed ? 60 : 240;

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />

      {/* Pass collapsed state to Navbar */}
      <Navbar handleDrawerToggle={handleDrawerToggle} collapsed={sidebarCollapsed} />

      <Sidebar collapsed={sidebarCollapsed} onToggle={handleSidebarToggle} />

      {isMobile && (
        <MobileMenu open={mobileOpen} onClose={handleDrawerToggle} />
      )}

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, sm: 8 },
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
};

export default Layout;
