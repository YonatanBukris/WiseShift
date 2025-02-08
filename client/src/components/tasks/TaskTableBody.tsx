import { TableBody } from "@mui/material";
import { TaskRow } from "./TaskRow";
import { ITask } from "../../types/models";

interface Props {
  tasks: ITask[];
  page: number;
  rowsPerPage: number;
  onEdit: (task: ITask) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: ITask["status"]) => void;
  onAssign: (task: ITask) => void;
}

export const TaskTableBody = ({
  tasks,
  page,
  rowsPerPage,
  ...props
}: Props) => (
  <TableBody>
    {tasks
      .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
      .map((task) => (
        <TaskRow key={task._id} task={task} {...props} />
      ))}
  </TableBody>
);
