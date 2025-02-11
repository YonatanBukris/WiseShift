import React from "react";
import { VictoryPie, VictoryContainer, VictoryTooltip } from "victory";
import { Paper, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { EmployeeDashboardData } from "../../types/models";
import { useTask } from "../../contexts/TaskContext";

interface Props {
  data: EmployeeDashboardData;
}

const COLORS = ["#00C49F", "#FF8042", "#dc3545"];

export const EmployeeOverviewChart: React.FC<Props> = ({ data }) => {
  const navigate = useNavigate();
  const { tasks, emergencyTasks } = useTask();

  console.log("Dashboard Data:", data);
  console.log("Personal Stats:", data.personalStats);

  const total =
    data.personalStats.currentTasks + data.personalStats.emergencyTasks;
  const percentage = total
    ? Math.round(
        ((tasks.filter((t) => t.status === "completed").length +
          emergencyTasks.filter((t) => t.status === "completed").length) /
          total) *
          100
      )
    : 0;

  const taskData = [
    { x: "משימות רגילות", y: data.personalStats.currentTasks },
    { x: "משימות שהושלמו", y: data.personalStats.completedTasks },
    { x: "משימות חירום", y: data.personalStats.emergencyTasks },
  ];

  console.log("Task Data for Chart:", taskData);

  return (
    <Paper
      sx={{
        p: 3,
        cursor: "pointer",
        "&:hover": {
          boxShadow: 6,
          transform: "scale(1.02)",
          transition: "all 0.2s ease-in-out",
        },
      }}
      onClick={() => navigate("/tasks")}
    >
      <Typography variant="h6" align="center" gutterBottom>
        סטטיסטיקת משימות
      </Typography>
      <div style={{ position: "relative", height: "300px" }}>
        <VictoryPie
          data={taskData}
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
            {percentage}%
          </Typography>
        </div>
      </div>
    </Paper>
  );
};
