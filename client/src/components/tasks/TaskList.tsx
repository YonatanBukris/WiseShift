import { useState } from "react";
import { Table, TableContainer, TablePagination } from "@mui/material";

import { ITask } from "../../types/models";
import { useAuth } from "../../contexts/AuthContext";
import { useTask } from "../../contexts/TaskContext";
import { emergencyAPI, taskAPI } from "../../services/api";
import { TaskTableHeader } from "./TaskTableHeader";
import { TaskTableBody } from "./TaskTableBody";
import { AssignTaskDialog } from "./AssignTaskDialog";

interface TaskListProps {
  tasks: ITask[];
  onEdit: (task: ITask) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: ITask["status"]) => void;
  fetchTasks: () => Promise<void>;
}

export const TaskList = ({
  tasks,
  onEdit,
  onDelete,
  onStatusChange,
  fetchTasks,
}: TaskListProps) => {
  const { user } = useAuth();
  const isManager = user?.role === "manager";
  const { emergencyTasks } = useTask();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTask, setSelectedTask] = useState<ITask | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<string>("");

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  // Sort tasks: emergency first, then by priority
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.isEmergencyTask && !b.isEmergencyTask) return -1;
    if (!a.isEmergencyTask && b.isEmergencyTask) return 1;

    const priorityOrder = {
      critical: 0,
      high: 1,
      medium: 2,
      low: 3,
    };

    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const handleAssign = async () => {
    if (selectedTask && selectedEmployee) {
      try {
        if (selectedTask.isEmergencyTask) {
          await emergencyAPI.assignTask(selectedTask._id, selectedEmployee);
        } else {
          await taskAPI.assignTask(selectedTask._id, selectedEmployee);
        }
        await fetchTasks();
        setSelectedTask(null);
        setSelectedEmployee("");
      } catch (error) {
        console.error("Error assigning task:", error);
      }
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
    </>
  );
};
