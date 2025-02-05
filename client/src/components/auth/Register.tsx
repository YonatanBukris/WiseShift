import { useState, FormEvent } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { authAPI } from "../../services/api";
import {
  Box,
  Button,
  TextField,
  Typography,
  Container,
  Alert,
  Link,
  MenuItem,
} from "@mui/material";

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  department: string;
  phoneNumber: string;
  role: "manager" | "employee";
}

const departments = [
  "מחלקת תפעול",
  "מחלקת משאבי אנוש",
  "מחלקת כספים",
  "מחלקת שיווק",
  "מחלקת מכירות",
];

const Register = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    name: "",
    email: "",
    password: "",
    department: "",
    phoneNumber: "",
    role: "employee",
  });
  const [error, setError] = useState<string>("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      console.log("Submitting form data:", formData);
      const response = await authAPI.register(formData);
      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        login(response.data.data!, response.data.token);
        navigate("/dashboard");
      } else {
        console.error("Registration failed:", response.data);
        setError(response.data.message || "An error occurred");
      }
    } catch (err: any) {
      console.error("Registration error:", err);
      setError(err.response?.data?.message || "An error occurred");
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          הרשמה
        </Typography>
        {error && (
          <Alert severity="error" sx={{ width: "100%", mt: 2 }}>
            {error}
          </Alert>
        )}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="name"
            label="שם מלא"
            name="name"
            autoComplete="name"
            autoFocus
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="אימייל"
            name="email"
            autoComplete="email"
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="סיסמה"
            type="password"
            id="password"
            autoComplete="new-password"
            value={formData.password}
            onChange={(e) =>
              setFormData({ ...formData, password: e.target.value })
            }
          />
          <TextField
            select
            margin="normal"
            required
            fullWidth
            name="department"
            label="מחלקה"
            value={formData.department}
            onChange={(e) =>
              setFormData({ ...formData, department: e.target.value })
            }
          >
            {departments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="normal"
            required
            fullWidth
            name="phoneNumber"
            label="מספר טלפון"
            type="tel"
            value={formData.phoneNumber}
            onChange={(e) =>
              setFormData({ ...formData, phoneNumber: e.target.value })
            }
          />
          <TextField
            select
            margin="normal"
            required
            fullWidth
            name="role"
            label="תפקיד"
            value={formData.role}
            onChange={(e) =>
              setFormData({
                ...formData,
                role: e.target.value as "manager" | "employee",
              })
            }
          >
            <MenuItem value="employee">עובד</MenuItem>
            <MenuItem value="manager">מנהל</MenuItem>
          </TextField>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            הרשם
          </Button>
          <Box sx={{ textAlign: "center" }}>
            <Link component={RouterLink} to="/login" variant="body2">
              יש לך כבר חשבון? התחבר
            </Link>
          </Box>
        </Box>
      </Box>
    </Container>
  );
};

export default Register;
