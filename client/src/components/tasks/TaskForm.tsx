import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from "@mui/material";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { CreateTaskData } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

interface TaskFormProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTaskData) => void;
  employees: Array<{ id: string; name: string }>;
}

export const TaskForm = ({
  open,
  onClose,
  onSubmit,
  employees,
}: TaskFormProps) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState<CreateTaskData>({
    title: "",
    description: "",
    priority: "medium",
    department: user?.department || "",
    estimatedHours: 0,
  });

  const handleSubmit = () => {
    if (!formData.title) {
      return;
    }

    const taskData = {
      ...formData,
      deadline: formData.deadline ? new Date(formData.deadline) : undefined,
    };

    onSubmit(taskData);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      disableEnforceFocus
      disableAutoFocus
      aria-labelledby="task-form-title"
    >
      <DialogTitle id="task-form-title">יצירת משימה חדשה</DialogTitle>
      <DialogContent>
        <Grid
          container
          spacing={2}
          sx={{ mt: 1 }}
          role="form"
          aria-label="טופס יצירת משימה"
        >
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="כותרת"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="תיאור"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>דחיפות</InputLabel>
              <Select
                value={formData.priority}
                label="דחיפות"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: e.target.value as CreateTaskData["priority"],
                  }))
                }
              >
                <MenuItem value="critical">דחוף</MenuItem>
                <MenuItem value="high">גבוהה</MenuItem>
                <MenuItem value="medium">בינונית</MenuItem>
                <MenuItem value="low">נמוכה</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>עובד אחראי</InputLabel>
              <Select
                value={formData.assignedTo || ""}
                label="עובד אחראי"
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    assignedTo: e.target.value,
                  }))
                }
              >
                <MenuItem value="">לא הוקצה</MenuItem>
                {employees.map((emp) => (
                  <MenuItem key={emp.id} value={emp.id}>
                    {emp.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <DateTimePicker
              label="תאריך יעד"
              onChange={(date) =>
                setFormData((prev) => ({
                  ...prev,
                  deadline: date || undefined,
                }))
              }
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="שעות מוערכות"
              value={formData.estimatedHours}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  estimatedHours: parseInt(e.target.value) || 0,
                }))
              }
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ביטול</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          צור משימה
        </Button>
      </DialogActions>
    </Dialog>
  );
};
