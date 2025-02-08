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
import { ITask } from "../../types/models";
import { emergencyAPI, taskAPI } from "../../services/api";

interface Props {
  task: ITask | null;
  onClose: () => void;
  onAssign: () => void;
}

export const AssignTaskDialog = ({ task, onClose, onAssign }: Props) => {
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [employees, setEmployees] = useState<
    Array<{ _id: string; name: string }>
  >([]);

  useEffect(() => {
    if (task) {
      fetchEmployees();
    }
  }, [task]);

  const fetchEmployees = async () => {
    try {
      const response = task?.isEmergencyTask
        ? await emergencyAPI.getAvailableEmployees()
        : await taskAPI.getAvailableEmployees();

      if (response.success) {
        setEmployees(response.data);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const handleAssign = async () => {
    if (task && selectedEmployee) {
      try {
        if (task.isEmergencyTask) {
          await emergencyAPI.assignTask(task._id, selectedEmployee);
        } else {
          await taskAPI.assignTask(task._id, selectedEmployee);
        }
        onAssign(); // This will trigger the parent's fetchTasks
        onClose();
        setSelectedEmployee("");
      } catch (error) {
        console.error("Error assigning task:", error);
      }
    }
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
            <MenuItem key={emp._id} value={emp._id}>
              {emp.name}
            </MenuItem>
          ))}
        </Select>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ביטול</Button>
        <Button onClick={handleAssign} variant="contained" color="primary">
          שבץ
        </Button>
      </DialogActions>
    </Dialog>
  );
};
