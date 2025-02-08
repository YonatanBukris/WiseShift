import {
  TableRow,
  TableCell,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Button,
} from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { ITask } from "../../types/models";
import { useAuth } from "../../contexts/AuthContext";

interface Props {
  task: ITask;
  onEdit: (task: ITask) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: ITask["status"]) => void;
  onAssign: (task: ITask) => void;
}

export const TaskRow = ({ task, onEdit, onDelete, onAssign }: Props) => {
  const { user } = useAuth();
  const isManager = user?.role === "manager";

  console.log(JSON.stringify(task));

  return (
    <TableRow>
      <TableCell align="right">
        <Typography variant="body1">{task.title}</Typography>
        {task.description && (
          <Typography variant="body2" color="textSecondary">
            {task.description}
          </Typography>
        )}
      </TableCell>
      <TableCell align="right">
        <Chip
          label={task.priority}
          color={getPriorityColor(task.priority)}
          size="small"
        />
      </TableCell>
      <TableCell align="right">
        <Chip
          label={getStatusLabel(task.status)}
          color={getStatusColor(task.status)}
          size="small"
        />
      </TableCell>
      {isManager && (
        <TableCell align="right">
          {typeof task.assignedTo === "string"
            ? "לא משויך"
            : task.assignedTo?.name || "לא משויך"}
        </TableCell>
      )}

      {isManager && (
        <TableCell align="right">
          <Box sx={{ display: "flex", gap: 1, justifyContent: "flex-end" }}>
            <Tooltip title="ערוך">
              <IconButton
                size="small"
                onClick={() => onEdit(task)}
                color="primary"
              >
                <EditIcon />
              </IconButton>
            </Tooltip>
            <Tooltip title="מחק">
              <IconButton
                size="small"
                onClick={() => onDelete(task._id)}
                color="error"
              >
                <DeleteIcon />
              </IconButton>
            </Tooltip>
            {task.status === "pending" && !task.assignedTo && (
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => onAssign(task)}
              >
                שבץ עובד
              </Button>
            )}
          </Box>
        </TableCell>
      )}
    </TableRow>
  );
};

const getPriorityColor = (priority: ITask["priority"]) => {
  switch (priority) {
    case "critical":
      return "error";
    case "high":
      return "warning";
    case "medium":
      return "info";
    case "low":
      return "success";
    default:
      return "default";
  }
};

const getStatusColor = (status: ITask["status"]) => {
  switch (status) {
    case "completed":
      return "success";
    case "inProgress":
      return "info";
    case "pending":
      return "warning";
    case "cancelled":
      return "error";
    default:
      return "default";
  }
};

const getStatusLabel = (status: ITask["status"]) => {
  switch (status) {
    case "completed":
      return "הושלם";
    case "inProgress":
      return "בביצוע";
    case "pending":
      return "ממתין";
    case "cancelled":
      return "בוטל";
    case "transferred":
      return "הועבר";
    default:
      return status;
  }
};
