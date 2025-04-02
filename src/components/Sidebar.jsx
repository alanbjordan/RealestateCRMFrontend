// src/components/Sidebar.jsx
import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Box,
  Typography,
  Divider,
  IconButton,
  Collapse,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import GroupIcon from "@mui/icons-material/Group";
import HomeWorkIcon from "@mui/icons-material/HomeWork";
import BusinessIcon from "@mui/icons-material/Business";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";

const Sidebar = ({ collapsed, onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [openProperties, setOpenProperties] = useState(false);

  // Set drawer width based on collapsed state
  const drawerWidth = collapsed ? 60 : 240;

  // Updated menu items array including Buildings
  const menuItems = [
    { text: "Dashboard", path: "/dashboard", icon: <DashboardIcon /> },
    { text: "Clients", path: "/clients", icon: <GroupIcon /> },
    {
      text: "Properties",
      icon: <HomeWorkIcon />,
      children: [
        { text: "All Properties", path: "/property" },
        { text: "Bulk Upload", path: "/property/bulk-upload" },
      ],
    },
    { text: "Buildings", path: "/buildings", icon: <BusinessIcon /> },
    { text: "Settings", path: "/settings", icon: <SettingsIcon /> },
  ];

  const handleItemClick = (path) => {
    navigate(path);
  };

  const renderMenuItem = (item) => {
    const isActive = location.pathname === item.path;
    if (item.children) {
      // Check if any child route is active
      const isAnyChildActive = item.children.some(
        (child) => location.pathname === child.path
      );
      return (
        <React.Fragment key={item.text}>
          <ListItemButton
            onClick={() => setOpenProperties(!openProperties)}
            selected={isAnyChildActive}
            sx={{
              "&.Mui-selected": { bgcolor: "#ebf1fe" },
              "&:hover": { bgcolor: "#ebf1fe" },
              justifyContent: collapsed ? "center" : "flex-start",
              px: collapsed ? 2 : 3,
            }}
          >
            <ListItemIcon
              sx={{
                color: isAnyChildActive ? "primary.main" : "inherit",
                minWidth: collapsed ? 0 : "auto",
                mr: collapsed ? 0 : 2,
                justifyContent: "center",
              }}
            >
              {item.icon}
            </ListItemIcon>
            {!collapsed && (
              <ListItemText primary={item.text} sx={{ flexGrow: 1 }} />
            )}
            {!collapsed && (openProperties ? <ExpandLess /> : <ExpandMore />)}
          </ListItemButton>
          <Collapse in={openProperties} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => {
                const isChildActive = location.pathname === child.path;
                return (
                  <ListItemButton
                    key={child.text}
                    onClick={() => handleItemClick(child.path)}
                    sx={{
                      pl: collapsed ? 2 : 4,
                      "&.Mui-selected": { bgcolor: "#ebf1fe" },
                      "&:hover": { bgcolor: "#ebf1fe" },
                    }}
                    selected={isChildActive}
                  >
                    <ListItemText primary={child.text} />
                  </ListItemButton>
                );
              })}
            </List>
          </Collapse>
        </React.Fragment>
      );
    } else {
      return (
        <ListItemButton
          key={item.text}
          selected={isActive}
          onClick={() => handleItemClick(item.path)}
          sx={{
            "&.Mui-selected": { bgcolor: "#ebf1fe" },
            "&:hover": { bgcolor: "#ebf1fe" },
            justifyContent: collapsed ? "center" : "flex-start",
            px: collapsed ? 2 : 3,
          }}
        >
          <ListItemIcon
            sx={{
              color: isActive ? "primary.main" : "inherit",
              minWidth: collapsed ? 0 : "auto",
              mr: collapsed ? 0 : 2,
              justifyContent: "center",
            }}
          >
            {item.icon}
          </ListItemIcon>
          {!collapsed && <ListItemText primary={item.text} />}
        </ListItemButton>
      );
    }
  };

  return (
    <Box
      component="nav"
      sx={{
        width: { sm: drawerWidth },
        flexShrink: { sm: 0 },
        display: { xs: "none", sm: "block" },
      }}
    >
      <Drawer
        variant="permanent"
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
            transition: "width 0.3s",
          },
        }}
        open
      >
        <Toolbar
          sx={{
            bgcolor: "#fff",
            justifyContent: collapsed ? "center" : "space-between",
            px: collapsed ? 0 : 2,
          }}
        >
          {collapsed ? (
            <Typography variant="h6" noWrap>
              AT
            </Typography>
          ) : (
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Amas Technologies
            </Typography>
          )}
          <IconButton onClick={onToggle}>
            {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </Toolbar>
        <Divider />
        <List>
          {menuItems.map((item) => renderMenuItem(item))}
        </List>
        <Divider />
        <List>
          <ListItemButton
            onClick={() => {
              console.log("Logging out...");
              navigate("/");
            }}
            sx={{
              color: "error.main",
              "&:hover": { bgcolor: "#fdecea" },
              justifyContent: collapsed ? "center" : "flex-start",
              px: collapsed ? 2 : 3,
            }}
          >
            <ListItemIcon
              sx={{
                color: "error.main",
                minWidth: collapsed ? 0 : "auto",
                mr: collapsed ? 0 : 2,
                justifyContent: "center",
              }}
            >
              <LogoutIcon />
            </ListItemIcon>
            {!collapsed && <ListItemText primary="Logout" />}
          </ListItemButton>
        </List>
      </Drawer>
    </Box>
  );
};

export default Sidebar;
