import { Box, Paper, Typography, Avatar, Grid, Divider } from "@mui/material";
import { useAuth } from "../contexts/AuthContext";

export const Profile = () => {
  const { user } = useAuth();

  return (
    <Box sx={{ p: 3 }}>
      <Paper
        sx={{
          p: 3,
          maxWidth: 800,
          mx: "auto",
          borderRadius: 4,
          boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
          background: "linear-gradient(to right, #ffffff, #f8feff)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            mb: 4,
            p: 3,
            borderRadius: 3,
            bgcolor: "primary.light",
            boxShadow: "inset 0 2px 10px rgba(0,0,0,0.05)",
          }}
        >
          <Avatar
            sx={{
              width: 120,
              height: 120,
              mr: 4,
              border: "4px solid white",
              boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
            }}
            src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${user?.name}`}
          >
            {user?.name[0]}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
              {user?.name}
            </Typography>
            <Typography
              variant="subtitle1"
              sx={{
                color: "primary.main",
                bgcolor: "white",
                px: 2,
                py: 0.5,
                mr: 1,
                borderRadius: 2,
                display: "inline-block",
              }}
            >
              {user?.role === "manager" ? "מנהל" : "עובד"}
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ my: 4, borderColor: "primary.light" }} />

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "primary.main", mb: 3 }}
            >
              פרטים אישיים
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <Typography color="text.secondary">אימייל</Typography>
                <Typography>{user?.email}</Typography>
              </Box>
              <Box>
                <Typography color="text.secondary">מחלקה</Typography>
                <Typography>{user?.department}</Typography>
              </Box>
              <Box>
                <Typography color="text.secondary">טלפון</Typography>
                <Typography>{user?.phoneNumber}</Typography>
              </Box>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Typography
              variant="h6"
              gutterBottom
              sx={{ color: "primary.main", mb: 3 }}
            >
              סטטוס נוכחי
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Box>
                <Typography color="text.secondary">זמינות</Typography>
                <Typography>
                  {user?.status?.canWorkAsUsual ? "זמין" : "לא זמין"}
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary">שעות זמינות</Typography>
                <Typography>
                  {user?.status?.availableHours || 0} שעות
                </Typography>
              </Box>
              <Box>
                <Typography color="text.secondary">עדכון אחרון</Typography>
                <Typography>
                  {new Date(
                    user?.status?.lastUpdated || ""
                  ).toLocaleDateString()}
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};
