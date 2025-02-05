import { useAuth } from "../../contexts/AuthContext";
import { ManagerDashboard } from "./ManagerDashboard";
import { EmployeeDashboard } from "./EmployeeDashboard";

const Dashboard = () => {
  const { user } = useAuth();

  return user?.role === "manager" ? (
    <ManagerDashboard />
  ) : (
    <EmployeeDashboard />
  );
};

export default Dashboard;
