import stylesDashboard from "./Dashboard.module.css";
import Statistics from "./statistics/Statistics";
import Header from "../header/Header";
import iconTitleDashboard from "../../assets/img/iconTitleDashboard.png";
import { Title } from "../title/Title";
import { TasksThisWeek } from "./tasksThisWeek/TasksThisWeek";
import { UserDataProvider } from "../../context/UserDataContext";
import { MenuProvider } from "../../context/MenuContext";

export const Dashboard = () => {
  return (
    <>
      <div className={stylesDashboard.containDashboard}>
        <MenuProvider>
          <UserDataProvider>
            <Header></Header>
          </UserDataProvider>
          <div className={stylesDashboard.rowDashboard}>
            <Title title={"Dashboard"} icon={iconTitleDashboard}></Title>
            <div className={stylesDashboard.statisticsAndTasks}>
              <Statistics></Statistics>
              <TasksThisWeek></TasksThisWeek>
            </div>
          </div>
        </MenuProvider>
      </div>
    </>
  );
};
