import { useState, useEffect } from "react";
import { Box, Button, Typography, Alert, Snackbar } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { TaskForm } from "../components/tasks/TaskForm";
import { TaskList } from "../components/tasks/TaskList";
import { taskAPI, CreateTaskData } from "../services/api";
import { ITask } from "../types/models";
import { useAuth } from "../contexts/AuthContext";

export const TaskManagement = () => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [employees] = useState<Array<{ id: string; name: string }>>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await taskAPI.getTasks();
      if (response.success && response.data) {
        setTasks(response.data || []);
      }
    } catch (err) {
      setError("Failed to fetch tasks");
      console.error(err);
    }
  };

  const handleCreateTask = async (taskData: CreateTaskData) => {
    try {
      console.log("Sending task data:", taskData);
      const response = await taskAPI.createTask(taskData);
      if (response.success && response.data) {
        setSuccessMessage("Task created successfully");
        fetchTasks();
        setIsFormOpen(false);
      }
    } catch (error: any) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : error.response?.data?.message || "Unknown error";
      setError(`Failed to create task: ${errorMessage}`);
      console.error("Task creation error:", error);
    }
  };

  const handleEditTask = async (task: ITask) => {
    // TODO: Implement edit functionality
    console.log("Edit task:", task);
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await taskAPI.deleteTask(taskId);
      if (response.success) {
        setSuccessMessage("Task deleted successfully");
        fetchTasks();
      }
    } catch (err) {
      setError("Failed to delete task");
      console.error(err);
    }
  };

  const handleStatusChange = async (
    taskId: string,
    newStatus: ITask["status"]
  ) => {
    try {
      const response = await taskAPI.updateTask(taskId, { status: newStatus });
      if (response.success) {
        setSuccessMessage("Task status updated successfully");
        fetchTasks();
      }
    } catch (err) {
      setError("Failed to update task status");
      console.error(err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Typography variant="h5">ניהול משימות</Typography>
        {user?.role === "manager" && (
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setIsFormOpen(true)}
          >
            משימה חדשה
          </Button>
        )}
      </Box>

      <TaskList
        tasks={tasks}
        onEdit={handleEditTask}
        onDelete={handleDeleteTask}
        onStatusChange={handleStatusChange}
      />

      <TaskForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={handleCreateTask}
        employees={employees}
      />

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage("")}
      >
        <Alert severity="success" onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};
