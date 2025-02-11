import { useState } from "react";
import {
  Table,
  TableContainer,
  TablePagination,
  Snackbar,
  Alert,
} from "@mui/material";

import { ITask, IEmergencyTask, TaskStatus } from "../../types/models";
import { useAuth } from "../../contexts/AuthContext";
import { emergencyAPI, taskAPI } from "../../services/api";
import { TaskTableHeader } from "./TaskTableHeader";
import { TaskTableBody } from "./TaskTableBody";
import { AssignTaskDialog } from "./AssignTaskDialog";

interface Props {
  tasks: (ITask | IEmergencyTask)[];
  onEdit: (task: ITask | IEmergencyTask) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onAddNote: (taskId: string, note: { text?: string; file?: File }) => void;
  fetchTasks: () => void;
  onDeleteNote: (taskId: string, noteId: string) => void;
}

export const TaskList = ({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  onAddNote,

  fetchTasks,
  onDeleteNote,
}: Props) => {
  const { user } = useAuth();
  const isManager = user?.role === "manager";
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTask, setSelectedTask] = useState<
    ITask | IEmergencyTask | null
  >(null);
  const [successMessage, setSuccessMessage] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getPriorityOrCriticality = (task: ITask | IEmergencyTask) => {
    return "priority" in task ? task.priority : task.criticality;
  };

  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.isEmergencyTask && !b.isEmergencyTask) return -1;
    if (!a.isEmergencyTask && b.isEmergencyTask) return 1;

    const priorityOrder = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
    };

    return (
      priorityOrder[getPriorityOrCriticality(a)] -
      priorityOrder[getPriorityOrCriticality(b)]
    );
  });

  const handleAssign = async (taskId: string, assignedTo: string) => {
    try {
      const task = tasks.find((t) => t._id === taskId);
      if (!task) return;

      if (task.isEmergencyTask) {
        await emergencyAPI.updateTask(taskId, { assignedTo });
      } else {
        await taskAPI.updateTask(taskId, { assignedTo });
      }

      setSuccessMessage("המשימה שובצה בהצלחה");
      await fetchTasks();
      setSelectedTask(null);
    } catch (error) {
      setError("שגיאה בשיבוץ המשימה");
      console.error(error);
    }
  };

  return (
    <>
      <TableContainer>
        <Table>
          <TaskTableHeader isManager={isManager} />
          <TaskTableBody
            tasks={sortedTasks}
            page={page}
            rowsPerPage={rowsPerPage}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
            onAssign={(task) => setSelectedTask(task)}
            onAddNote={onAddNote}
            onDeleteNote={onDeleteNote}
          />
        </Table>
        <TablePagination
          component="div"
          count={sortedTasks.length}
          page={page}
          onPageChange={handleChangePage}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="שורות בעמוד"
        />
      </TableContainer>

      <AssignTaskDialog
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
        onAssign={handleAssign}
      />

      <Snackbar
        open={!!successMessage}
        autoHideDuration={6000}
        onClose={() => setSuccessMessage("")}
      >
        <Alert severity="success" onClose={() => setSuccessMessage("")}>
          {successMessage}
        </Alert>
      </Snackbar>

      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError("")}
      >
        <Alert severity="error" onClose={() => setError("")}>
          {error}
        </Alert>
      </Snackbar>
    </>
  );
};
