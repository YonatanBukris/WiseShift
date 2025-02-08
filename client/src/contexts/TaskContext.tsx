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
  const [loading, setLoading] = useState(true);
  const isManager = user?.role === "manager";

  const fetchTasks = async () => {
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
                } as ITask)
            )
          );
        }
      } else {
        const response = await dashboardAPI.getEmployeeDashboard();

        if (response.success) {
          // Filter and process regular tasks
          const regularTasks = response.data.tasks.filter(
            (task) => task.assignedTo?.toString() === user?._id
          );

          // Filter and process emergency tasks
          const emergencyTasks = response.data.emergencyTasks
            .filter((task) => task.assignedTo?.toString() === user?._id)
            .map((task) => ({
              ...task,
              priority: task.criticality as
                | "critical"
                | "high"
                | "medium"
                | "low",
              isEmergencyTask: true,
            }));

          setTasks(regularTasks);
          setEmergencyTasks(emergencyTasks);
        }
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [isManager]);

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
