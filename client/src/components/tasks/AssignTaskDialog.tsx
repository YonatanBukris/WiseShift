import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import { ITask, IEmergencyTask } from "../../types/models";
import { emergencyAPI, taskAPI } from "../../services/api";

interface Props {
  task: ITask | IEmergencyTask | null;
  onClose: () => void;
  onAssign: (taskId: string, assignedTo: string) => void;
}

export const AssignTaskDialog = ({ task, onClose, onAssign }: Props) => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employees, setEmployees] = useState<
    Array<{
      _id: string;
      name: string;
      status?: {
        canWorkAsUsual: boolean;
      };
    }>
  >([]);

  useEffect(() => {
    if (task) {
      fetchEmployees();
    }
  }, [task]);

  const fetchEmployees = async () => {
    try {
      const response = task?.isEmergencyTask
        ? await emergencyAPI.getAllEmployees()
        : await taskAPI.getAllEmployees();

      if (response.success) {
        // Sort employees - available first, then unavailable
        const sortedEmployees = [...response.data].sort((a, b) => {
          if (a.status?.canWorkAsUsual && !b.status?.canWorkAsUsual) return -1;
          if (!a.status?.canWorkAsUsual && b.status?.canWorkAsUsual) return 1;
          return 0;
        });
        setEmployees(sortedEmployees);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleAssign = async () => {
    if (task && selectedEmployee) {
      try {
        if (task.isEmergencyTask) {
          const response = await emergencyAPI.assignTask(
            task._id,
            selectedEmployee
          );
          if (response.success) {
            await onAssign(task._id, selectedEmployee);
            onClose();
            setSelectedEmployee("");
          }
        } else {
          const response = await taskAPI.assignTask(task._id, selectedEmployee);
          if (response.success) {
            await onAssign(task._id, selectedEmployee);
            onClose();
            setSelectedEmployee("");
          }
        }
      } catch (error) {
        console.error("Error assigning task:", error);
      }
    }
  };

  const handleClose = () => {
    setSelectedEmployee("");
    onClose();
  };

  return (
    <Dialog open={!!task} onClose={onClose}>
      <DialogTitle>שיבוץ עובד למשימה: {task?.title}</DialogTitle>
      <DialogContent>
        <Select
          fullWidth
          value={selectedEmployee}
          onChange={(e) => setSelectedEmployee(e.target.value)}
        >
          {employees.map((emp) => (
            <MenuItem
              key={emp._id}
              value={emp._id}
              sx={{
                backgroundColor: emp.status?.canWorkAsUsual
                  ? "rgba(76, 175, 80, 0.1)"
                  : "rgba(158, 158, 158, 0.1)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                "&:hover": {
                  backgroundColor: emp.status?.canWorkAsUsual
                    ? "rgba(76, 175, 80, 0.2)"
                    : "rgba(158, 158, 158, 0.2)",
                },
              }}
            >
              <span>{emp.name}</span>
              <span
                style={{
                  fontSize: "0.8rem",
                  color: emp.status?.canWorkAsUsual ? "#4caf50" : "#9e9e9e",
                }}
              >
                {emp.status?.canWorkAsUsual ? "זמין" : "לא זמין"}
              </span>
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>ביטול</Button>
        <Button onClick={handleAssign} variant="contained" color="primary">
          שבץ
        </Button>
      </DialogActions>
    </Dialog>
  );
};
