import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  Grid,
  Avatar,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Stack,
} from "@mui/material";
import { taskAPI } from "../services/api";

interface Employee {
  _id: string;
  name: string;
  email: string;
  department: string;
  phoneNumber?: string;
  status?: {
    canWorkAsUsual: boolean;
    availableHours: number;
    lastUpdated: string;
  };
}

export const Employees = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  const departments = [...new Set(employees.map((emp) => emp.department))];

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      const response = await taskAPI.getAllEmployees();
      if (response.success) {
        const sortedEmployees = [...response.data].sort((a, b) => {
          if (a.status?.canWorkAsUsual && !b.status?.canWorkAsUsual) return -1;
          if (!a.status?.canWorkAsUsual && b.status?.canWorkAsUsual) return 1;
          return 0;
        });
        setEmployees(sortedEmployees);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredEmployees = employees.filter((employee) => {
    const matchesAvailability =
      availabilityFilter === "all" ||
      (availabilityFilter === "available" && employee.status?.canWorkAsUsual) ||
      (availabilityFilter === "unavailable" &&
        !employee.status?.canWorkAsUsual);

    const matchesDepartment =
      departmentFilter === "all" || employee.department === departmentFilter;

    const matchesSearch =
      searchTerm === "" ||
      employee.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesAvailability && matchesDepartment && matchesSearch;
  });

  if (loading)
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
        <CircularProgress />
      </Box>
    );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        עובדים
      </Typography>

      <Paper sx={{ p: 3, mb: 4, bgcolor: "background.default" }}>
        <Stack
          direction={{ xs: "column", md: "row" }}
          alignItems="center"
          sx={{
            "& .MuiFormControl-root": {
              minWidth: { xs: "100%", md: 220 },
            },
          }}
        >
          <TextField
            label="חיפוש לפי שם או אימייל"
            variant="outlined"
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flex: 1 }}
            InputProps={{
              startAdornment: (
                <Box component="span" sx={{ color: "text.secondary", mr: 1 }}>
                  🔍
                </Box>
              ),
            }}
          />

          <FormControl size="small">
            <InputLabel>זמינות</InputLabel>
            <Select
              value={availabilityFilter}
              label="זמינות"
              onChange={(e) => setAvailabilityFilter(e.target.value)}
            >
              <MenuItem value="all">כל העובדים</MenuItem>
              <MenuItem value="available">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label="זמין"
                    size="small"
                    color="success"
                    sx={{ height: 24 }}
                  />
                  <span>זמינים</span>
                </Box>
              </MenuItem>
              <MenuItem value="unavailable">
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Chip
                    label="לא זמין"
                    size="small"
                    color="default"
                    sx={{ height: 24 }}
                  />
                  <span>לא זמינים</span>
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          <FormControl size="small">
            <InputLabel>מחלקה</InputLabel>
            <Select
              value={departmentFilter}
              label="מחלקה"
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <MenuItem value="all">כל המחלקות</MenuItem>
              {departments.map((dept) => (
                <MenuItem key={dept} value={dept}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Box
                      sx={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        bgcolor: "primary.main",
                      }}
                    />
                    {dept}
                  </Box>
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 2, textAlign: "center" }}
        ></Typography>
      </Paper>

      <Grid container spacing={3}>
        {filteredEmployees.map((employee) => (
          <Grid item xs={12} sm={6} md={4} key={employee._id}>
            <Paper sx={{ p: 3, height: "100%" }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Avatar
                  src={`https://api.dicebear.com/7.x/lorelei/svg?seed=${employee.name}`}
                  sx={{ width: 60, height: 60 }}
                />
                <Box>
                  <Typography variant="h6">{employee.name}</Typography>
                  <Chip
                    label={employee.status?.canWorkAsUsual ? "זמין" : "לא זמין"}
                    color={
                      employee.status?.canWorkAsUsual ? "success" : "default"
                    }
                    size="small"
                    sx={{ mt: 0.5 }}
                  />
                </Box>
              </Box>

              <Stack spacing={1.5}>
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    מחלקה
                  </Typography>
                  <Typography>{employee.department}</Typography>
                </Box>

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    אימייל
                  </Typography>
                  <Typography>{employee.email}</Typography>
                </Box>

                {employee.phoneNumber && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      טלפון
                    </Typography>
                    <Typography>{employee.phoneNumber}</Typography>
                  </Box>
                )}

                {employee.status?.availableHours !== undefined && (
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      שעות זמינות
                    </Typography>
                    <Typography>
                      {employee.status.availableHours} שעות
                    </Typography>
                  </Box>
                )}

                <Box>
                  <Typography variant="body2" color="text.secondary">
                    עדכון אחרון
                  </Typography>
                  <Typography>
                    {new Date(
                      employee.status?.lastUpdated || ""
                    ).toLocaleDateString()}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
