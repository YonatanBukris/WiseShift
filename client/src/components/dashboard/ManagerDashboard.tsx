import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { dashboardAPI } from "../../services/api";
import { ManagerDashboardData } from "../../types/models";

export const ManagerDashboard = () => {
  const [dashboardData, setDashboardData] =
    useState<ManagerDashboardData | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
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

    fetchDashboard();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={3}>
        {/* Form Submissions Status */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              סטטוס טפסים
            </Typography>
            <Card>
              <CardContent>
                <Typography>
                  טפסים שהוגשו היום:{" "}
                  {dashboardData?.formStats.submittedToday || 0}
                </Typography>
                <Typography>
                  סה״כ עובדים: {dashboardData?.formStats.totalEmployees || 0}
                </Typography>
                <Typography>
                  אחוז הגשה:{" "}
                  {dashboardData
                    ? Math.round(
                        (dashboardData.formStats.submittedToday /
                          dashboardData.formStats.totalEmployees) *
                          100
                      )
                    : 0}
                  %
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        {/* Critical Cases */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              מקרים קריטיים
            </Typography>
            {dashboardData?.formStats.criticalCases.length === 0 ? (
              <Alert severity="success">אין מקרים קריטיים כרגע</Alert>
            ) : (
              <List>
                {dashboardData?.formStats.criticalCases.map((employee) => (
                  <div key={employee.employeeId.toString()}>
                    <ListItem>
                      <ListItemText
                        primary={employee.name}
                        secondary={
                          <>
                            <Typography component="span" variant="body2">
                              רמת לחץ: {employee.stressLevel}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2">
                              {employee.physicallyInjured
                                ? "נפגע פיזית"
                                : "לא נפגע"}
                            </Typography>
                            <br />
                            <Typography component="span" variant="body2">
                              {employee.canWorkAsUsual
                                ? "יכול לעבוד"
                                : "לא יכול לעבוד"}
                            </Typography>
                          </>
                        }
                      />
                    </ListItem>
                    <Divider />
                  </div>
                ))}
              </List>
            )}
          </Paper>
        </Grid>

        {/* Employee Status Overview */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              סטטוס עובדים
            </Typography>
            <Card>
              <CardContent>
                <Typography>
                  סה"כ עובדים:{" "}
                  {dashboardData?.employeeStats.totalEmployees || 0}
                </Typography>
                <Typography>
                  זמינים: {dashboardData?.employeeStats.availableEmployees || 0}
                </Typography>
                <Typography>
                  לא זמינים:{" "}
                  {dashboardData?.employeeStats.unavailableEmployees || 0}
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>

        {/* Department Tasks */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              משימות מחלקתיות
            </Typography>
            <Card>
              <CardContent>
                <Typography>
                  משימות פעילות: {dashboardData?.taskStats.active || 0}
                </Typography>
                <Typography>
                  משימות שהושלמו: {dashboardData?.taskStats.completed || 0}
                </Typography>
                <Typography>
                  משימות בהמתנה: {dashboardData?.taskStats.pending || 0}
                </Typography>
              </CardContent>
            </Card>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
