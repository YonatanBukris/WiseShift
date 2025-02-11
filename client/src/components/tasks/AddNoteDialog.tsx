import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
} from "@mui/material";

interface AddNoteDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (note: { text?: string; file?: File }) => void;
}

export const AddNoteDialog = ({
  open,
  onClose,
  onSubmit,
}: AddNoteDialogProps) => {
  const [text, setText] = useState("");
  const [file, setFile] = useState<File | null>(null);

  const handleSubmit = () => {
    if (!text && !file) return;
    onSubmit({ text: text || undefined, file: file || undefined });
    setText("");
    setFile(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>הוספת הערה</DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            multiline
            rows={4}
            label="טקסט"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
          <input
            type="file"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ביטול</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          הוסף
        </Button>
      </DialogActions>
    </Dialog>
  );
};
