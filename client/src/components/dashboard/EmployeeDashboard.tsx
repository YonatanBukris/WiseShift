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
import { EmployeeOverviewChart } from "./EmployeeOverviewChart";

export const EmployeeDashboard = () => {
  const [dashboardData, setDashboardData] =
    useState<EmployeeDashboardData | null>(null);
  const [error, setError] = useState("");
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [hasAssessmentForm, setHasAssessmentForm] = useState(false);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await dashboardAPI.getEmployeeDashboard();
        if (response.success && response.data) {
          setDashboardData(response.data);
        }
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error(err);
      }
    };

    const checkAssessmentForm = async () => {
      try {
        const response = await assessmentAPI.checkPendingForm();
        setHasAssessmentForm(response.data.hasPendingForm);
      } catch (error) {
        console.error("Error checking assessment form:", error);
      }
    };

    fetchDashboard();
    checkAssessmentForm();
  }, []);

  const handleFormSubmit = async (formData: AssessmentFormData) => {
    try {
      const response = await assessmentAPI.submitForm(formData);
      if (response.success) {
        setHasAssessmentForm(false);
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

      {/* Regular status update form - always available */}
      <AssessmentForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleFormSubmit}
      />

      {/* Manager triggered form */}
      {hasAssessmentForm && (
        <AssessmentForm
          open={true}
          onClose={() => setHasAssessmentForm(false)}
          onSubmit={handleFormSubmit}
          title="טופס הערכת מצב - נשלח על ידי המנהל"
        />
      )}

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          {dashboardData && <EmployeeOverviewChart data={dashboardData} />}
        </Grid>

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
    </Box>
  );
};
