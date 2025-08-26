import { Dashboard } from "../dashboard/Dashboard";
import { TaskProvider } from "../../context/TaskContext";
import { DashboardProvider } from "../../context/DashboardContext";

export const DashboardPage = () => {
  return (
    <TaskProvider>
      <DashboardProvider>
        <Dashboard />
      </DashboardProvider>
    </TaskProvider>
  );
};
