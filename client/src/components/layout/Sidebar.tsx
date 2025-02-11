import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
  Avatar,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Assignment as TasksIcon,
  Group as EmployeesIcon,
  Assessment as ReportsIcon,
  Warning as EmergencyIcon,
} from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

export const DRAWER_WIDTH = 240;

export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const isManager = user?.role === "manager";

  const menuItems = [
    { title: "סקירה כללית", icon: <DashboardIcon />, path: "/dashboard" },
    { title: "משימות", icon: <TasksIcon />, path: "/tasks" },
    ...(isManager
      ? [
          { title: "עובדים", icon: <EmployeesIcon />, path: "/employees" },
          { title: "דוחות", icon: <ReportsIcon />, path: "/reports" },
          { title: "מצב חירום", icon: <EmergencyIcon />, path: "/emergency" },
        ]
      : []),
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: DRAWER_WIDTH,
          boxSizing: "border-box",
          bgcolor: "background.paper",
          borderLeft: "1px solid",
          borderColor: "divider",
          right: 0,
          left: "auto",
        },
      }}
    >
      <Box sx={{ p: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: "primary.main",
          }}
        >
          WS
        </Avatar>
        <Typography variant="h6" color="primary.main">
          אגף רווחה
        </Typography>
      </Box>

      <Box
        sx={{ p: 2 }}
        onClick={() => navigate("/profile")}
        style={{ cursor: "pointer" }}
      >
        <Box
          sx={{
            p: 1.5,
            bgcolor: "primary.light",
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            gap: 1,
          }}
        >
          <Avatar src={user?.name[0]} sx={{ width: 32, height: 32 }} />
          <Box>
            <Typography variant="subtitle2">{user?.name}</Typography>
            <Typography variant="caption">
              {user?.role === "manager" ? "מנהל" : "עובד"}
            </Typography>
          </Box>
        </Box>
      </Box>

      <List>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => navigate(item.path)}
            sx={{
              mx: 1,
              borderRadius: 1,
              mb: 0.5,
              "&.Mui-selected": {
                bgcolor: "primary.light",
                "&:hover": {
                  bgcolor: "primary.light",
                },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
            <ListItemText primary={item.title} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};
