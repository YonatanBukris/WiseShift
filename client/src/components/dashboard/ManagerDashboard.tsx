import { useEffect, useState } from "react";
import { Box, Typography, Button, Card, CardContent } from "@mui/material";
import { format } from "date-fns";
import { he } from "date-fns/locale";
import { dashboardAPI, emergencyAPI, assessmentAPI } from "../../services/api";
import { ManagerDashboardData } from "../../types/models";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import WarningIcon from "@mui/icons-material/Warning";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import SendIcon from "@mui/icons-material/Send";
import { OverviewCharts } from "./OverviewCharts";

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
        window.location.reload();
      }
    } catch (err) {
      setError("Failed to activate emergency mode");
      console.error(err);
    }
  };

  const handleEmergencyReset = async () => {
    try {
      if (window.confirm("האם אתה בטוח שברצונך לסיים את מצב החירום?")) {
        const response = await emergencyAPI.deactivateEmergency();
        if (response.success) {
          window.location.reload();
        }
      }
    } catch (err) {
      setError("Failed to reset emergency state");
      console.error(err);
    }
  };

  const handleSendAssessmentForms = async () => {
    try {
      if (window.confirm("האם אתה בטוח שברצונך לשלוח טפסים לכל העובדים?")) {
        const response = await assessmentAPI.triggerAssessmentForms();
        if (response.success) {
          alert("הטפסים נשלחו בהצלחה");
          window.location.reload();
        }
      }
    } catch (err) {
      setError("שגיאה בשליחת הטפסים");
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
        <Button
          variant="contained"
          color="info"
          onClick={handleSendAssessmentForms}
          startIcon={<SendIcon />}
        >
          שלח טופס
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

      {/* Overview Section */}
      <Typography variant="h5" sx={{ mb: 2 }}>
        סקירה כללית
      </Typography>
      {dashboardData && <OverviewCharts data={dashboardData} />}
    </Box>
  );
};
