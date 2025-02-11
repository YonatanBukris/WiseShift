import { TableBody } from "@mui/material";
import { TaskRow } from "./TaskRow";
import { ITask, IEmergencyTask, TaskStatus } from "../../types/models";

interface Props {
  tasks: (ITask | IEmergencyTask)[];
  page: number;
  rowsPerPage: number;
  onEdit: (task: ITask | IEmergencyTask) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onAssign: (task: ITask | IEmergencyTask) => void;
  onAddNote: (taskId: string, note: { text?: string; file?: File }) => void;
  onDeleteNote: (taskId: string, noteId: string) => void;
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
