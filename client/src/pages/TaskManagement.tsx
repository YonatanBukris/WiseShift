import { useState } from "react";
import { Box, Button, Typography, Alert, Snackbar, Paper } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { TaskForm } from "../components/tasks/TaskForm";
import { TaskList } from "../components/tasks/TaskList";
import { taskAPI, CreateTaskData } from "../services/api";
import { ITask, IEmergencyTask, TaskStatus } from "../types/models";
import { useAuth } from "../contexts/AuthContext";
import { useTask } from "../contexts/TaskContext";
import { emergencyAPI } from "../services/api";

export const TaskManagement = () => {
  const { user } = useAuth();
  const { tasks, emergencyTasks, fetchTasks } = useTask();
  const [employees] = useState<Array<{ id: string; name: string }>>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const isManager = user?.role === "manager";

  // Combine both task types
  const allTasks = [...tasks, ...emergencyTasks];

  const handleCreateTask = async (taskData: CreateTaskData) => {
    try {
      const response = await taskAPI.createTask(taskData);
      if (response.success && response.data) {
        setSuccessMessage("Task created successfully");
        fetchTasks();
        setIsFormOpen(false);
      }
    } catch (error: any) {
      setError(`Failed to create task: ${error.message}`);
      console.error("Task creation error:", error);
    }
  };

  const handleTaskUpdate = async (task: ITask | IEmergencyTask) => {
    try {
      if ("requiredSkills" in task) {
        // Type guard for IEmergencyTask
        await emergencyAPI.updateTask(task._id, task);
      } else {
        // handle regular task
        await taskAPI.updateTask(task._id, task);
      }
      await fetchTasks();
    } catch (error) {
      setError("שגיאה בעדכון המשימה");
    }
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

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const task = allTasks.find((t) => t._id === taskId);
      if (!task) return;

      if ("isEmergencyTask" in task) {
        await emergencyAPI.updateTask(taskId, { status: newStatus });
      } else {
        await taskAPI.updateTask(taskId, { status: newStatus });
      }

      setSuccessMessage("סטטוס המשימה עודכן בהצלחה");
      await fetchTasks();
    } catch (error) {
      setError("שגיאה בעדכון סטטוס המשימה");
      console.error(error);
    }
  };

  const handleAddNote = async (
    taskId: string,
    note: { text?: string; file?: File }
  ) => {
    try {
      const task = allTasks.find((t) => t._id === taskId);
      if (!task) return;

      if ("isEmergencyTask" in task) {
        await emergencyAPI.addNote(taskId, note);
      } else {
        await taskAPI.addNote(taskId, note);
      }

      setSuccessMessage("הערה נוספה בהצלחה");
      await fetchTasks();
    } catch (error) {
      setError("שגיאה בהוספת הערה");
      console.error(error);
    }
  };

  const handleDeleteNote = async (taskId: string, noteId: string) => {
    try {
      const task = allTasks.find((t) => t._id === taskId);
      if (!task) return;

      if ("isEmergencyTask" in task) {
        await emergencyAPI.deleteNote(taskId, noteId);
      } else {
        await taskAPI.deleteNote(taskId, noteId);
      }

      setSuccessMessage("הערה נמחקה בהצלחה");
      await fetchTasks();
    } catch (error) {
      setError("שגיאה במחיקת ההערה");
      console.error(error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Stats Section - Similar to the top cards in the image */}
      <Box sx={{ display: "flex", gap: 3, mb: 4 }}>
        <Paper
          sx={{
            flex: 1,
            p: 2,
            display: "flex",
            alignItems: "center",
            backgroundColor: "background.paper",
            borderRadius: 2,
          }}
        >
          <Box>
            <Typography variant="h4" color="primary.dark">
              {tasks.filter((t) => t.status !== "completed").length +
                emergencyTasks.filter((t) => t.status !== "completed").length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              משימות פעילות
            </Typography>
          </Box>
        </Paper>

        <Paper
          sx={{
            flex: 1,
            p: 2,
            display: "flex",
            alignItems: "center",
            backgroundColor: "background.paper",
            borderRadius: 2,
          }}
        >
          <Box>
            <Typography variant="h4" color="primary.dark">
              {tasks.filter((t) => t.status === "completed").length +
                emergencyTasks.filter((t) => t.status === "completed").length}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              משימות שהושלמו
            </Typography>
          </Box>
        </Paper>

        {isManager && (
          <Paper
            sx={{
              flex: 1,
              p: 2,
              display: "flex",
              alignItems: "center",
              backgroundColor: "background.paper",
              borderRadius: 2,
            }}
          >
            <Box>
              <Typography variant="h4" color="primary.dark">
                {tasks.filter((t) => !t.assignedTo).length +
                  emergencyTasks.filter((t) => !t.assignedTo).length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                משימות לא משובצות
              </Typography>
            </Box>
          </Paper>
        )}
      </Box>

      {/* Main Content Section */}
      <Paper
        sx={{
          p: 3,
          backgroundColor: "background.paper",
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" color="primary.dark">
            ניהול משימות
          </Typography>
          {isManager && (
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setIsFormOpen(true)}
              sx={{
                backgroundColor: "primary.main",
                "&:hover": {
                  backgroundColor: "primary.light",
                },
              }}
            >
              משימה חדשה
            </Button>
          )}
        </Box>

        <TaskList
          tasks={allTasks}
          onEdit={handleTaskUpdate}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
          onAddNote={handleAddNote}
          fetchTasks={fetchTasks}
          onDeleteNote={handleDeleteNote}
        />
      </Paper>

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
