import { TableHead, TableRow, TableCell } from "@mui/material";

export const TaskTableHeader = ({ isManager }: { isManager: boolean }) => {
  return (
    <TableHead>
      <TableRow>
        <TableCell align="right">כותרת</TableCell>
        <TableCell align="right">תא</TableCell>
        <TableCell align="right">דחיפות</TableCell>
        <TableCell align="right">סטטוס</TableCell>
        {isManager && <TableCell align="right">משויך ל</TableCell>}
        <TableCell align="right">הערות</TableCell>
        {isManager && <TableCell align="right">פעולות</TableCell>}
      </TableRow>
    </TableHead>
  );
};
