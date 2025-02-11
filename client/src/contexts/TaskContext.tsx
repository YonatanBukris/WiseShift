import React, { createContext, useContext, useState, useEffect } from "react";
import { ITask, IEmergencyTask } from "../types/models";
import { taskAPI, emergencyAPI } from "../services/api";
import { useAuth } from "./AuthContext";

interface TaskContextType {
  tasks: (ITask | IEmergencyTask)[];
  emergencyTasks: ITask[];
  fetchTasks: () => Promise<void>;
  loading: boolean;
  addTask: (task: ITask | IEmergencyTask) => void;
  updateTask: (task: ITask | IEmergencyTask) => void;
  deleteTask: (taskId: string) => void;
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
      const [taskResponse, emergencyResponse] = await Promise.all([
        taskAPI.getTasks(),
        emergencyAPI.getEmergencyTasks(),
      ]);

      if (taskResponse.success) {
        // Filter tasks based on user role
        const filteredTasks = isManager
          ? taskResponse.data
          : taskResponse.data.filter(
              (task) =>
                typeof task.assignedTo === "object" &&
                task.assignedTo?._id === user._id
            );
        setTasks(filteredTasks);
      }

      if (emergencyResponse.success) {
        // Filter emergency tasks based on user role
        const mappedEmergencyTasks = emergencyResponse.data.map(
          (task) =>
            ({
              ...task,
              priority: task.criticality,
              isEmergencyTask: true,
              createdBy: task.assignedTo || "",
              department: (task as any).department || "",
              dependencies: [],
              comments: [],
              history: [],
              notes: task.notes || [],
              createdAt: new Date(),
              updatedAt: new Date(),
            } as ITask)
        );

        // Apply the same filtering logic to emergency tasks
        const filteredEmergencyTasks = isManager
          ? mappedEmergencyTasks
          : mappedEmergencyTasks.filter(
              (task) =>
                typeof task.assignedTo === "object" &&
                task.assignedTo?._id === user._id
            );
        setEmergencyTasks(filteredEmergencyTasks);
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

  const addTask = (task: ITask | IEmergencyTask) => {
    setTasks((prev) => [...prev, task as ITask]);
  };

  const updateTask = (task: ITask | IEmergencyTask) => {
    setTasks((prev) =>
      prev.map((t) => (t._id === task._id ? (task as ITask) : t))
    );
  };

  const deleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
  };

  return (
    <TaskContext.Provider
      value={{
        tasks,
        emergencyTasks,
        fetchTasks,
        loading,
        addTask,
        updateTask,
        deleteTask,
      }}
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
