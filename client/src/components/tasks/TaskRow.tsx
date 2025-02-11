import {
  TableRow,
  TableCell,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
  Button,
  Link,
  Dialog,
  DialogTitle,
  DialogActions,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { ITask, IEmergencyTask, TaskStatus } from "../../types/models";
import { useAuth } from "../../contexts/AuthContext";
import { useState } from "react";
import { AddNoteDialog } from "./AddNoteDialog";
import { getFileUrl } from "../../services/api";

interface Props {
  task: ITask | IEmergencyTask;
  onEdit: (task: ITask | IEmergencyTask) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onAssign: (task: ITask | IEmergencyTask) => void;
  onAddNote: (taskId: string, note: { text?: string; file?: File }) => void;
  onDeleteNote: (taskId: string, noteId: string) => void;
}

const priorityLabels: Record<string, string> = {
  critical: "דחוף",
  high: "גבוה",
  medium: "בינוני",
  low: "נמוך",
};

const priorityColors: Record<string, string> = {
  critical: "#8c1c06",
  high: "#d1310d",
  medium: "#c77006",
  low: "#ffa63b",
};

const getPriorityOrCriticality = (task: ITask | IEmergencyTask) => {
  return "priority" in task ? task.priority : task.criticality;
};

const departmentLabels: Record<string, string> = {
  family: "משפחה",
  "special needs": "צרכים מיוחדים",
  "senior citizens": "אזרחים ותיקים",
  sturdiness: "חוסן",
  community: "קהילה",
};

export const TaskRow = ({
  task,
  onEdit,
  onDelete,
  onStatusChange,
  onAssign,
  onAddNote,
  onDeleteNote,
}: Props) => {
  const { user } = useAuth();
  const isManager = user?.role === "manager";
  const [isAddNoteOpen, setIsAddNoteOpen] = useState(false);
  const [isCompleteDialogOpen, setIsCompleteDialogOpen] = useState(false);

  const handleStatusClick = () => {
    if (task.status === "assigned" || task.status === "inProgress") {
      setIsCompleteDialogOpen(true);
    }
  };

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
        {departmentLabels[task.department] || task.department}
      </TableCell>
      <TableCell align="right">
        <Chip
          label={priorityLabels[getPriorityOrCriticality(task)]}
          sx={{
            bgcolor: priorityColors[getPriorityOrCriticality(task)],
            color: "white",
            borderRadius: 1,
            height: 32,
          }}
        />
      </TableCell>
      <TableCell align="right">
        {task.status === "pending" && isManager ? (
          <Button
            variant="contained"
            color="inherit"
            size="small"
            onClick={() => onAssign(task)}
          >
            שבץ
          </Button>
        ) : (
          <Chip
            label={getStatusLabel(task.status)}
            color={getStatusColor(task.status)}
            size="small"
            onClick={handleStatusClick}
            sx={{
              fontWeight: "medium",
              borderRadius: 1,
              height: 32,
              cursor:
                task.status === "assigned" || task.status === "inProgress"
                  ? "pointer"
                  : "default",
            }}
          />
        )}
        <Dialog
          open={isCompleteDialogOpen}
          onClose={() => setIsCompleteDialogOpen(false)}
        >
          <DialogTitle>האם המשימה הושלמה?</DialogTitle>
          <DialogActions>
            <Button onClick={() => setIsCompleteDialogOpen(false)}>לא</Button>
            <Button
              onClick={() => {
                onStatusChange(task._id, "completed");
                setIsCompleteDialogOpen(false);
              }}
              autoFocus
            >
              כן
            </Button>
          </DialogActions>
        </Dialog>
      </TableCell>
      {isManager && (
        <TableCell align="right">
          {typeof task.assignedTo === "string"
            ? "לא משויך"
            : task.assignedTo?.name || "לא משויך"}
        </TableCell>
      )}
      <TableCell align="right">
        <Box>
          {task.notes?.map((note, index) => (
            <Box
              key={index}
              sx={{ mb: 1, display: "flex", alignItems: "center", gap: 1 }}
            >
              {note.text && (
                <Typography variant="body2">{note.text}</Typography>
              )}
              {note.file && (
                <Link
                  href={getFileUrl(note.file.path, note.file.filename)}
                  target="_blank"
                >
                  {decodeURIComponent(escape(note.file.filename))}
                </Link>
              )}
              {note.createdBy === user?._id && (
                <IconButton
                  size="small"
                  onClick={() => onDeleteNote(task._id, note._id)}
                  sx={{ ml: 1 }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>
          ))}
          <Button
            size="small"
            onClick={() => setIsAddNoteOpen(true)}
            startIcon={<AddIcon />}
          >
            הוסף הערה
          </Button>
        </Box>
        <AddNoteDialog
          open={isAddNoteOpen}
          onClose={() => setIsAddNoteOpen(false)}
          onSubmit={(note) => {
            onAddNote(task._id, note);
            setIsAddNoteOpen(false);
          }}
        />
      </TableCell>
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
          </Box>
        </TableCell>
      )}
    </TableRow>
  );
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "success";
    case "assigned":
      return "primary";
    case "pending":
      return "default";
    case "cancelled":
      return "error";
    default:
      return "default";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "completed":
      return "הושלמה";
    case "assigned":
      return "בתהליך";
    case "pending":
      return "לא שויך";
    case "cancelled":
      return "בוטל";
    case "transferred":
      return "הועבר";
    default:
      return status;
  }
};
