import { Dashboard } from "../dashboard/Dashboard";
import { TaskProvider } from "../../context/TaskContext";

export const DashboardPage = () => {
  return (
    <TaskProvider>
      <Dashboard></Dashboard>
    </TaskProvider>
  );
};
