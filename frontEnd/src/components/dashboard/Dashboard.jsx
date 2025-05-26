import stylesDashboard from "./Dashboard.module.css";
import Statistics from "./statistics/Statistics";
import Header from "../header/Header";
import { TasksThisWeek } from "./tasksThisWeek/TasksThisWeek";
import { UserDataProvider } from "../../context/userDataContext";

export const Dashboard = () => {
  return (
    <>
      <div className={stylesDashboard.containDashboard}>
        <UserDataProvider>
          <Header></Header>   
        </UserDataProvider>
        <div className={stylesDashboard.rowDashboard}>
          <Statistics></Statistics>
          <TasksThisWeek></TasksThisWeek>
        </div>
      </div>
    </>
  );
};
