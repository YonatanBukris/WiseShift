import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
} from "@mui/material";
import { dashboardAPI, assessmentAPI } from "../../services/api";
import { EmployeeDashboardData } from "../../types/models";
import { AssessmentForm, AssessmentFormData } from "../forms/AssessmentForm";
import { StatisticsCircle } from "./StatisticsCircle";

export const EmployeeDashboard = () => {
  const [dashboardData, setDashboardData] =
    useState<EmployeeDashboardData | null>(null);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dashboardAPI.getEmployeeDashboard();
        if (response.success && response.data) {
          setDashboardData(response.data);
          // Only open form if not submitted today
          if (!response.data.personalStats.formSubmittedToday) {
            setIsFormOpen(true);
          }
        }
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      }
    };

    fetchDashboard();
  }, []);

  const handleFormSubmit = async (formData: AssessmentFormData) => {
    try {
      const response = await assessmentAPI.submitForm(formData);
      if (response.success) {
        // Refresh dashboard data after submission
        const dashResponse = await dashboardAPI.getEmployeeDashboard();
        if (dashResponse.success && dashResponse.data) {
          setDashboardData(dashResponse.data);
        }
      }
    } catch (err) {
      setError("Failed to submit form");
      console.error(err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 2 }}>
        לוח בקרה אישי
      </Typography>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Circular Statistics Section */}
      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          סטטיסטיקת משימות
        </Typography>
        <Box sx={{ display: "flex", justifyContent: "space-around", py: 3 }}>
          <StatisticsCircle
            value={dashboardData?.personalStats.currentTasks || 0}
            total={
              (dashboardData?.personalStats.currentTasks || 0) +
              (dashboardData?.personalStats.completedTasks || 0) +
              (dashboardData?.personalStats.emergencyTasks || 0)
            }
            label="משימות רגילות"
            color="#28a745"
          />
          <StatisticsCircle
            value={dashboardData?.personalStats.completedTasks || 0}
            total={
              (dashboardData?.personalStats.currentTasks || 0) +
              (dashboardData?.personalStats.completedTasks || 0) +
              (dashboardData?.personalStats.emergencyTasks || 0)
            }
            label="משימות שהושלמו"
            color="#0078d4"
          />
          <StatisticsCircle
            value={dashboardData?.personalStats.emergencyTasks || 0}
            total={
              (dashboardData?.personalStats.currentTasks || 0) +
              (dashboardData?.personalStats.completedTasks || 0) +
              (dashboardData?.personalStats.emergencyTasks || 0)
            }
            label="משימות חירום"
            color="#dc3545"
          />
        </Box>
      </Paper>

      <Grid container spacing={3}>
        {/* Personal Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography variant="h6">הסטטוס שלי</Typography>
              <Button
                variant="outlined"
                color="primary"
                onClick={() => setIsFormOpen(true)}
              >
                עדכן סטטוס
              </Button>
            </Box>
            <Card>
              <CardContent>
                <Typography>
                  מחלקה: {dashboardData?.personalStats.department}
                </Typography>
                <Typography>
                  זמינות:{" "}
                  {dashboardData?.personalStats.canWorkAsUsual
                    ? "זמין"
                    : "לא זמין"}
                </Typography>
                <Typography>
                  שעות זמינות:{" "}
                  {dashboardData?.personalStats.availableHours || 0}
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>

      <AssessmentForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />
    </Box>
  );
};
