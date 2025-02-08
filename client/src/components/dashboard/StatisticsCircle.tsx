import { Box, Typography, CircularProgress } from "@mui/material";

interface StatisticsCircleProps {
  value: number;
  total: number;
  label: string;
  color: string;
}

export const StatisticsCircle = ({
  value,
  total,
  label,
  color,
}: StatisticsCircleProps) => {
  const percentage = (value / total) * 100;

  return (
    <Box
      sx={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Box sx={{ position: "relative", display: "inline-flex" }}>
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={120}
          thickness={4}
          sx={{ color }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Typography variant="h4" component="div" color="text.primary">
            {value}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
        {label}
      </Typography>
    </Box>
  );
};
