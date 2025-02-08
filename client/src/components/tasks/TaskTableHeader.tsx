import { TableHead, TableRow, TableCell } from "@mui/material";

export const TaskTableHeader = ({ isManager }: { isManager: boolean }) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell align="right">כותרת</TableCell>
        <TableCell align="right">עדיפות</TableCell>
        <TableCell align="right">סטטוס</TableCell>
        {isManager && <TableCell align="right">משויך ל</TableCell>}
        {isManager && <TableCell align="right">פעולות</TableCell>}
      </TableRow>
    </TableHead>
  );
};
