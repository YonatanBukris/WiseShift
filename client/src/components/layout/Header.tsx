import { AppBar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { LogoutRounded as LogoutIcon } from "@mui/icons-material";
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
const logo = "/assets/logo.png";
import { DRAWER_WIDTH } from "./Sidebar";

export const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        bgcolor: "background.paper",
        boxShadow: "none",
        borderBottom: "1px solid",
        borderColor: "divider",
        width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
        marginRight: `${DRAWER_WIDTH}px`,
        marginLeft: 0,
        right: 0,
        left: "auto",
      }}
    >
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <img src={logo} alt="Logo" style={{ height: 40, marginRight: 16 }} />
          <Typography variant="h5" color="text.primary">
            {`שלום, ${user?.name}`}
          </Typography>
        </Box>

        <Box>
          <IconButton onClick={handleLogout} color="primary">
            <LogoutIcon />
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
