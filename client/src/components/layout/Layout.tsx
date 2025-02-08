import { ReactNode } from "react";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Assignment as TaskIcon,
  ExitToApp as LogoutIcon,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import logo from "../../assets/logo.png"; // Import the logo

const DRAWER_WIDTH = 240;

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    {
      text: "לוח בקרה",
      icon: <DashboardIcon />,
      path: "/dashboard",
    },
    {
      text: "משימות",
      icon: <TaskIcon />,
      path: "/tasks",
    },
  ];

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        position="fixed"
        sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
      >
        <Toolbar sx={{ justifyContent: "space-between" }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box
              component="img"
              src={logo}
              alt="WiseShift Logo"
              sx={{
                height: 40,
                mr: 2,
                transition: "filter 0.2s ease-in-out",
                "&:hover": {
                  filter: "hue-rotate(170deg) saturate(150%)", // Subtle color shift on hover
                },
              }}
            />
            <Typography variant="h6" noWrap>
              מערכת ניהול משימות
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography>{user?.name}</Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_WIDTH,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: DRAWER_WIDTH,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar /> {/* Spacer for AppBar */}
        <Box sx={{ overflow: "auto" }}>
          <List>
            {menuItems.map((item) => (
              <ListItem
                button
                key={item.text}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          ml: `${DRAWER_WIDTH}px`, // Add margin to account for drawer
          pt: "64px", // Height of AppBar
        }}
      >
        {children}
      </Box>
    </Box>
  );
};
