import React from 'react';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Toolbar,
  Box,
} from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import PersonIcon from '@mui/icons-material/Person';
import ApartmentIcon from '@mui/icons-material/Apartment';
import ExitToAppIcon from '@mui/icons-material/ExitToApp';
import { useNavigate, useLocation } from 'react-router-dom';

const ClientSidebar = ({ mobileOpen, handleDrawerToggle, drawerWidth = 240 }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get client code from localStorage (if available)
  const clientCode = localStorage.getItem('clientCode');

  const menuItems = [
    { 
      text: 'Home', 
      path: clientCode ? `/client-portal/client/${clientCode}` : '/client-portal', 
      icon: <HomeIcon /> 
    },
    { 
      text: 'Profile', 
      path: clientCode ? `/client-portal/client/${clientCode}/profile` : '/client-portal/profile', 
      icon: <PersonIcon /> 
    },
    { 
      text: 'Properties', 
      path: clientCode ? `/client-portal/client/${clientCode}/properties` : '/client-portal/properties', 
      icon: <ApartmentIcon /> 
    },
    { text: 'Logout', path: '/client-portal', icon: <ExitToAppIcon />, action: 'logout' },
  ];

  const drawerContent = (
    <Box>
      <Toolbar />
      <Divider />
      <List>
        {menuItems.map(({ text, path, icon, action }) => {
          const isActive = location.pathname === path;
          return (
            <ListItemButton
              key={text}
              selected={isActive}
              onClick={() => {
                if (action === 'logout') {
                  localStorage.removeItem('clientVerified');
                  localStorage.removeItem('clientCode');
                  localStorage.removeItem('clientData');
                  navigate('/client-portal'); // Redirect to client-portal instead of "/"
                } else {
                  navigate(path);
                }
                if (handleDrawerToggle) handleDrawerToggle();
              }}
            >
              <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'inherit' }}>
                {icon}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          );
        })}
      </List>
    </Box>
  );

  return (
    <>
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{ keepMounted: true }}
        sx={{
          display: { xs: 'block', sm: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
      >
        {drawerContent}
      </Drawer>

      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', sm: 'block' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </>
  );
};

export default ClientSidebar;
