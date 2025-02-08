import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
} from "@mui/material";
import { RestartAlt as RestartAltIcon } from "@mui/icons-material";
import { emergencyAPI } from "../../services/api";

interface EmergencyTask {
  _id: string;
  title: string;
  description: string;
  criticality: "critical" | "high" | "medium" | "low";
  status: "pending" | "assigned" | "inProgress" | "completed";
  assignedTo?: string;
  location: string;
}

interface Employee {
  _id: string;
  name: string;
  availableHours: number;
  currentTasks: number;
}

interface Props {
  tasks: EmergencyTask[];
  availableEmployees: Employee[];
  onAssignTask: (taskId: string, employeeId: string) => void;
  fetchTasks: () => Promise<void>;
}

export const EmergencyTasksPanel = ({
  tasks,
  availableEmployees,
  onAssignTask,
  fetchTasks,
}: Props) => {
  const [selectedTask, setSelectedTask] = useState<EmergencyTask | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");

  const handleAssign = () => {
    if (selectedTask && selectedEmployee) {
      onAssignTask(selectedTask._id, selectedEmployee);
      setSelectedTask(null);
      setSelectedEmployee("");
    }
  };

  const handleReset = async () => {
    try {
      const response = await emergencyAPI.deactivateEmergency();
      if (response.success) {
        await fetchTasks();
      }
    } catch (error) {
      console.error("Error resetting emergency state:", error);
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h5" color="error" gutterBottom>
          משימות חירום פעילות
        </Typography>
        <Button
          variant="contained"
          color="secondary"
          onClick={handleReset}
          startIcon={<RestartAltIcon />}
        >
          סיום מצב חירום
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>כותרת</TableCell>
              <TableCell>דחיפות</TableCell>
              <TableCell>מיקום</TableCell>
              <TableCell>סטטוס</TableCell>
              <TableCell>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task._id}>
                <TableCell>{task.title}</TableCell>
                <TableCell>{task.criticality}</TableCell>
                <TableCell>{task.location}</TableCell>
                <TableCell>{task.status}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    disabled={task.status !== "pending"}
                    onClick={() => setSelectedTask(task)}
                  >
                    שבץ עובד
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={!!selectedTask} onClose={() => setSelectedTask(null)}>
        <DialogTitle>שיבוץ עובד למשימה: {selectedTask?.title}</DialogTitle>
        <DialogContent>
          <Select
            fullWidth
            value={selectedEmployee}
            onChange={(e) => setSelectedEmployee(e.target.value)}
          >
            {availableEmployees.map((employee) => (
              <MenuItem key={employee._id} value={employee._id}>
                {employee.name} (זמין: {employee.availableHours} שעות)
              </MenuItem>
            ))}
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedTask(null)}>ביטול</Button>
          <Button onClick={handleAssign} variant="contained" color="primary">
            שבץ
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
