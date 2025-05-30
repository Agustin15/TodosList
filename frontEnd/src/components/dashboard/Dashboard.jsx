import stylesDashboard from "./Dashboard.module.css";
import Statistics from "./statistics/Statistics";
import Header from "../header/Header";
import iconDashboard from "../../assets/img/dashboard.png";
import { Title } from "../title/Title";
import { TasksThisWeek } from "./tasksThisWeek/TasksThisWeek";
import { UserDataProvider } from "../../context/userDataContext";
import { WindowSizeProvider } from "../../context/WindowSizeContext";
import { MenuProvider } from "../../context/MenuContext";

export const Dashboard = () => {
  return (
    <>
      <div className={stylesDashboard.containDashboard}>
        <MenuProvider>
          <WindowSizeProvider>
            <UserDataProvider>
              <Header></Header>
            </UserDataProvider>
            <div className={stylesDashboard.rowDashboard}>
              <Title title={"Dashboard"} icon={iconDashboard}></Title>
              <Statistics></Statistics>
              <TasksThisWeek></TasksThisWeek>
            </div>
          </WindowSizeProvider>
        </MenuProvider>
      </div>
    </>
  );
};
