import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Slider,
  Typography,
  Box,
  Grid,
} from "@mui/material";

interface Props {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: AssessmentFormData) => void;
  title?: string;
}

export interface AssessmentFormData {
  stressLevel: number;
  physicallyInjured: boolean;
  injuryDetails?: string;
  spouseAvailable: boolean;
  availableHours: number;
  canWorkAsUsual: boolean;
  constraints?: string;
}

interface FormErrors {
  stressLevel?: string;
  availableHours?: string;
}

export const AssessmentForm = ({
  open,
  onClose,
  onSubmit,
  title = "עדכון סטטוס",
}: Props) => {
  const [formData, setFormData] = useState<AssessmentFormData>({
    stressLevel: 0,
    physicallyInjured: false,
    spouseAvailable: true,
    availableHours: 0,
    canWorkAsUsual: true,
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (formData.stressLevel < 1 || formData.stressLevel > 10) {
      newErrors.stressLevel = "רמת דחק חייבת להיות בין 1 ל-10";
    }

    if (formData.availableHours < 0 || formData.availableHours > 24) {
      newErrors.availableHours = "שעות זמינות חייבות להיות בין 0 ל-24";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit(formData);
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Typography gutterBottom>
                בסולם של 1-10, כמה גבוהה רמת הלחץ שלך?
              </Typography>
              <Slider
                value={formData.stressLevel}
                onChange={(_, value) =>
                  setFormData((prev) => ({
                    ...prev,
                    stressLevel: value as number,
                  }))
                }
                min={1}
                max={10}
                marks
                valueLabelDisplay="auto"
              />
              {errors.stressLevel && (
                <Typography color="error" variant="caption">
                  {errors.stressLevel}
                </Typography>
              )}
            </Grid>

            <Grid item>
              <FormControl component="fieldset">
                <Typography>האם נפגעת פיזית?</Typography>
                <RadioGroup
                  value={formData.physicallyInjured}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      physicallyInjured: e.target.value === "true",
                    }))
                  }
                >
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="לא"
                  />
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="כן"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            {formData.physicallyInjured && (
              <Grid item>
                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  margin="normal"
                  label="פירוט הפגיעה"
                  value={formData.injuryDetails || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      injuryDetails: e.target.value,
                    }))
                  }
                />
              </Grid>
            )}

            <Grid item>
              <FormControl component="fieldset">
                <Typography>האם בן/בת הזוג זמין/ה לטיפול בילדים?</Typography>
                <RadioGroup
                  value={formData.spouseAvailable}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      spouseAvailable: e.target.value === "true",
                    }))
                  }
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="כן"
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="לא"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item>
              <TextField
                fullWidth
                type="number"
                margin="normal"
                label="שעות זמינות לעבודה"
                value={formData.availableHours}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    availableHours: parseInt(e.target.value) || 0,
                  }))
                }
                error={!!errors.availableHours}
                helperText={errors.availableHours}
              />
            </Grid>

            <Grid item>
              <FormControl component="fieldset">
                <Typography>האם ביכולתך לעבוד כרגיל?</Typography>
                <RadioGroup
                  value={formData.canWorkAsUsual}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      canWorkAsUsual: e.target.value === "true",
                    }))
                  }
                >
                  <FormControlLabel
                    value={true}
                    control={<Radio />}
                    label="כן"
                  />
                  <FormControlLabel
                    value={false}
                    control={<Radio />}
                    label="לא"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>

            <Grid item>
              <TextField
                fullWidth
                multiline
                rows={2}
                margin="normal"
                label="מגבלות נוספות"
                value={formData.constraints || ""}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    constraints: e.target.value,
                  }))
                }
              />
            </Grid>
          </Grid>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>ביטול</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          שלח
        </Button>
      </DialogActions>
    </Dialog>
  );
};
