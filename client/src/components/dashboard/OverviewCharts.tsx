import React from "react";
import { useNavigate } from "react-router-dom";

import {
  VictoryPie,
  VictoryBar,
  VictoryChart,
  VictoryAxis,
  VictoryTooltip,
  VictoryLabel,
  VictoryContainer,
  VictoryLegend,
} from "victory";
import { Paper, Typography, Grid } from "@mui/material";
import { ManagerDashboardData } from "../../types/models";
import { useTask } from "../../contexts/TaskContext";

interface Props {
  data: ManagerDashboardData;
}

const COLORS = ["#00C49F", "#FF8042", "#0088FE"];

export const OverviewCharts: React.FC<Props> = ({ data }) => {
  const { tasks } = useTask();
  const totalEmployees = data.employeeStats.totalEmployees;
  const availablePercentage = Math.round(
    (data.employeeStats.availableEmployees / totalEmployees) * 100
  );
  const navigate = useNavigate();

  const employeeData = [
    { x: "זמינים", y: data.employeeStats.availableEmployees },
    { x: "לא זמינים", y: data.employeeStats.unavailableEmployees },
  ];

  const formData = [
    { x: "הוגשו", y: data.formStats.submittedToday, fill: COLORS[0] },
    {
      x: "ממתינים",
      y: data.employeeStats.totalEmployees - data.formStats.submittedToday,
      fill: COLORS[1],
    },
  ];

  const taskData = [
    {
      x: "לא משויכות",
      y: tasks.filter((task) => !task.assignedTo).length,
      fill: COLORS[0],
    },
    {
      x: "בתהליך",
      y: tasks.filter((task) => task.assignedTo && task.status !== "completed")
        .length,
      fill: COLORS[1],
    },
    {
      x: "הושלמו",
      y: tasks.filter((task) => task.status === "completed").length,
      fill: COLORS[2],
    },
  ];

  const handleChartClick = (chartType: string) => {
    switch (chartType) {
      case "tasks":
        navigate("/tasks");
        break;
      case "employees":
        navigate("/employees");
        break;
    }
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={4}>
        <Paper
          sx={{
            p: 3,
            height: "400px",
            cursor: "pointer",
            "&:hover": {
              boxShadow: 6,
              transform: "scale(1.02)",
              transition: "all 0.2s ease-in-out",
            },
          }}
          onClick={() => handleChartClick("tasks")}
        >
          <Typography variant="h6" align="center" gutterBottom>
            סטטוס משימות
          </Typography>
          <VictoryChart
            domainPadding={{ x: 100 }}
            height={400}
            padding={{ top: 50, bottom: 50, left: 50, right: 50 }}
          >
            <VictoryLegend
              x={50}
              y={0}
              orientation="horizontal"
              gutter={20}
              style={{
                labels: { fontSize: 16, fontWeight: "bold", fill: "#333" }, // Change font size and color
              }}
              data={[
                { name: "לא משויכות", symbol: { fill: COLORS[0] } },
                { name: "בתהליך", symbol: { fill: COLORS[1] } },
                { name: "הושלמו", symbol: { fill: COLORS[2] } },
              ]}
            />
            <VictoryAxis
              tickLabelComponent={<VictoryLabel angle={0} />}
              style={{
                tickLabels: { fontSize: 12, padding: 5 },
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(t) => Math.round(t)}
              style={{
                tickLabels: { fontSize: 12, padding: 5 },
              }}
            />
            <VictoryBar
              barRatio={0.8}
              alignment="middle"
              data={taskData}
              style={{
                data: {
                  fill: ({ datum }) => datum.fill,
                },
              }}
              labels={({ datum }) => datum.y}
              labelComponent={
                <VictoryTooltip
                  flyoutStyle={{ fill: "white" }}
                  style={{ fontSize: 14 }}
                />
              }
            />
          </VictoryChart>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper
          sx={{
            p: 3,
            height: "400px",
            cursor: "pointer",
            "&:hover": {
              boxShadow: 6,
              transform: "scale(1.02)",
              transition: "all 0.2s ease-in-out",
            },
          }}
          onClick={() => handleChartClick("employees")}
        >
          <Typography variant="h6" align="center" gutterBottom>
            סטטוס עובדים
          </Typography>
          <div style={{ position: "relative", height: "300px" }}>
            <VictoryPie
              data={employeeData}
              colorScale={COLORS}
              innerRadius={100}
              labelComponent={
                <VictoryTooltip
                  flyoutStyle={{ fill: "white" }}
                  style={{ fontSize: 14 }}
                />
              }
              labels={({ datum }) => `${datum.x}: ${datum.y}`}
              animate={{ duration: 500 }}
              containerComponent={<VictoryContainer responsive={true} />}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                textAlign: "center",
              }}
            >
              <Typography variant="h4" color="primary">
                {availablePercentage}%
              </Typography>
            </div>
          </div>
        </Paper>
      </Grid>

      <Grid item xs={12} md={4}>
        <Paper
          sx={{
            p: 3,
            height: "400px",
            cursor: "pointer",
            "&:hover": {
              boxShadow: 6,
              transform: "scale(1.02)",
              transition: "all 0.2s ease-in-out",
            },
          }}
        >
          <Typography variant="h6" align="center" gutterBottom>
            סטטוס טפסים
          </Typography>
          <VictoryChart
            domainPadding={{ x: 100 }}
            height={400}
            padding={{ top: 50, bottom: 50, left: 50, right: 50 }}
          >
            <VictoryLegend
              x={50}
              y={0}
              orientation="horizontal"
              gutter={20}
              style={{
                labels: { fontSize: 16, fontWeight: "bold", fill: "#333" }, // Change font size and color
              }}
              data={[
                { name: "הוגשו", symbol: { fill: COLORS[0] } },
                { name: "ממתינים", symbol: { fill: COLORS[1] } },
              ]}
            />
            <VictoryAxis
              tickLabelComponent={<VictoryLabel angle={0} />}
              style={{
                tickLabels: { fontSize: 12, padding: 5 },
              }}
            />
            <VictoryAxis
              dependentAxis
              tickFormat={(t) => Math.round(t)}
              style={{
                tickLabels: { fontSize: 12, padding: 5 },
              }}
            />
            <VictoryBar
              barRatio={0.8}
              alignment="middle"
              data={formData}
              style={{
                data: {
                  fill: ({ datum }) => datum.fill,
                },
              }}
              labels={({ datum }) => datum.y}
              labelComponent={
                <VictoryTooltip
                  flyoutStyle={{ fill: "white" }}
                  style={{ fontSize: 14 }}
                />
              }
            />
          </VictoryChart>
        </Paper>
      </Grid>
    </Grid>
  );
};
