import { useState } from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  TablePagination,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Schedule as ScheduleIcon,
} from "@mui/icons-material";
import { ITask } from "../../types/models";
import { format } from "date-fns";

interface TaskListProps {
  tasks: ITask[];
  onEdit: (task: ITask) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: ITask["status"]) => void;
}

export const TaskList = ({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskListProps) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

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

  return (
    <Paper>
      <TableContainer>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>כותרת</TableCell>
              <TableCell>דחיפות</TableCell>
              <TableCell>סטטוס</TableCell>
              <TableCell>תאריך יעד</TableCell>
              <TableCell>שעות מוערכות</TableCell>
              <TableCell>פעולות</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tasks
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((task) => (
                <TableRow key={task._id}>
                  <TableCell>
                    <Typography variant="body1">{task.title}</Typography>
                    {task.description && (
                      <Typography
                        variant="body2"
                        color="textSecondary"
                        sx={{
                          maxWidth: 300,
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {task.description}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={task.priority}
                      color={getPriorityColor(task.priority)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStatusLabel(task.status)}
                      color={getStatusColor(task.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    {task.deadline
                      ? format(new Date(task.deadline), "dd/MM/yyyy HH:mm")
                      : "-"}
                  </TableCell>
                  <TableCell>{task.estimatedHours || "-"}</TableCell>
                  <TableCell>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <Tooltip title="ערוך">
                        <IconButton
                          size="small"
                          onClick={() => onEdit(task)}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      {task.status !== "completed" && (
                        <Tooltip title="סמן כהושלם">
                          <IconButton
                            size="small"
                            onClick={() =>
                              onStatusChange(task._id, "completed")
                            }
                            color="success"
                          >
                            <CheckCircleIcon />
                          </IconButton>
                        </Tooltip>
                      )}
                      {task.status === "pending" && (
                        <Tooltip title="התחל טיפול">
                          <IconButton
                            size="small"
                            onClick={() =>
                              onStatusChange(task._id, "inProgress")
                            }
                            color="info"
                          >
                            <ScheduleIcon />
                          </IconButton>
                        </Tooltip>
                      )}
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
                </TableRow>
              ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        component="div"
        count={tasks.length}
        page={page}
        onPageChange={(_, newPage) => setPage(newPage)}
        rowsPerPage={rowsPerPage}
        onRowsPerPageChange={(event) => {
          setRowsPerPage(parseInt(event.target.value, 10));
          setPage(0);
        }}
        labelRowsPerPage="שורות בעמוד"
      />
    </Paper>
  );
};
