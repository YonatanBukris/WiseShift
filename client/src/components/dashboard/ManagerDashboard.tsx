import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Grid,
  Paper,
  Card,
  CardContent,
} from "@mui/material";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { dashboardAPI, emergencyAPI } from "../../services/api";
import { ManagerDashboardData } from "../../types/models";
import WarningIcon from "@mui/icons-material/Warning";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { StatisticsCircle } from "./StatisticsCircle";

export const ManagerDashboard = () => {
  const [dashboardData, setDashboardData] =
    useState<ManagerDashboardData | null>(null);
  const [error, setError] = useState("");
  const [currentTime, setCurrentTime] = useState(new Date());

  const fetchDashboard = async () => {
    try {
      const response = await dashboardAPI.getManagerDashboard();
      if (response.success && response.data) {
        setDashboardData(response.data);
      }
    } catch (err) {
      setError("Failed to load dashboard data");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDashboard();
    // Update time every minute
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const handleEmergencyActivation = async () => {
    try {
      if (window.confirm("האם אתה בטוח שברצונך להפעיל מצב חירום?")) {
        await emergencyAPI.activateEmergency("Emergency Activated", []);
        await fetchDashboard();
      }
    } catch (err) {
      setError("Failed to activate emergency mode");
      console.error(err);
    }
  };

  const handleEmergencyReset = async () => {
    try {
      if (window.confirm("האם אתה בטוח שברצונך לסיים את מצב החירום?")) {
        await emergencyAPI.deactivateEmergency();
        await fetchDashboard();
      }
    } catch (err) {
      setError("Failed to reset emergency state");
      console.error(err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
        <Button
          variant="contained"
          color="error"
          onClick={handleEmergencyActivation}
          startIcon={<WarningIcon />}
        >
          הפעל מצב חירום
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={handleEmergencyReset}
          startIcon={<RestartAltIcon />}
        >
          סיום מצב חירום
        </Button>
      </Box>

      {/* Calendar Card */}
      <Card sx={{ mb: 3, bgcolor: "primary.light", color: "white" }}>
        <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <CalendarTodayIcon fontSize="large" />
          <Box>
            <Typography variant="h5">
              {format(currentTime, "EEEE, d בMMMM yyyy", { locale: he })}
            </Typography>
            <Typography variant="h6">{format(currentTime, "HH:mm")}</Typography>
          </Box>
        </CardContent>
      </Card>

      {/* Dashboard Stats */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <StatisticsCircle
              value={dashboardData?.employeeStats.totalEmployees || 0}
              total={dashboardData?.employeeStats.totalEmployees || 0}
              label="סה״כ עובדים"
              color="primary.main"
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <StatisticsCircle
              value={dashboardData?.employeeStats.availableEmployees || 0}
              total={dashboardData?.employeeStats.totalEmployees || 0}
              label="עובדים זמינים"
              color="success.main"
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <StatisticsCircle
              value={dashboardData?.taskStats.active || 0}
              total={dashboardData?.taskStats.total || 0}
              label="משימות בביצוע"
              color="info.main"
            />
          </Paper>
        </Grid>
        <Grid item xs={12} md={3}>
          <Paper sx={{ p: 2 }}>
            <StatisticsCircle
              value={dashboardData?.formStats.submittedToday || 0}
              total={dashboardData?.formStats.total || 0}
              label="טפסים מלאים"
              color="warning.main"
            />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
