import React, { createContext, useContext, useState, useEffect } from "react";
import { ITask } from "../types/models";
import { dashboardAPI, taskAPI, emergencyAPI } from "../services/api";
import { useAuth } from "./AuthContext";

interface TaskContextType {
  tasks: ITask[];
  emergencyTasks: ITask[];
  fetchTasks: () => Promise<void>;
  loading: boolean;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<ITask[]>([]);
  const [emergencyTasks, setEmergencyTasks] = useState<ITask[]>([]);
  const [loading, setLoading] = useState(false);
  const isManager = user?.role === "manager";

  const fetchTasks = async () => {
    if (!user) return;

    try {
      setLoading(true);

      if (isManager) {
        const [taskResponse, emergencyResponse] = await Promise.all([
          taskAPI.getTasks(),
          emergencyAPI.getEmergencyTasks(),
        ]);

        if (taskResponse.success) {
          setTasks(taskResponse.data);
        }
        if (emergencyResponse.success) {
          setEmergencyTasks(
            emergencyResponse.data.map(
              (task) =>
                ({
                  ...task,
                  priority: task.criticality,
                  isEmergencyTask: true,
                  createdBy: task.assignedTo || "",
                  department: task.location,
                  dependencies: [],
                  comments: [],
                  history: [],
                  createdAt: new Date(),
                  updatedAt: new Date(),
                } as ITask)
            )
          );
        }
      } else {
        const response = await dashboardAPI.getEmployeeDashboard();
        if (response.success) {
          setTasks(response.data.tasks);
          setEmergencyTasks(response.data.emergencyTasks);
        }
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user, isManager]);

  return (
    <TaskContext.Provider
      value={{ tasks, emergencyTasks, fetchTasks, loading }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
