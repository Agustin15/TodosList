import stylesTasksThisWeek from "./TasksThisWeek.module.css";
import iconTask from "../../../assets/img/logo.png";
import notPendingTask from "../../../assets/img/notTasksPending.jpg";
import gifLoading from "../../../assets/img/loading.gif";
import { useTasks } from "../../../context/TaskContext";

export const TasksThisWeek = () => {
  const { tasksThisWeek, loadingState } = useTasks();

  return (
    <div className={stylesTasksThisWeek.containTasksWeek}>
      <div className={stylesTasksThisWeek.header}>
        <h3>Task this week</h3>
        <img src={iconTask}></img>
      </div>

      <ul className={stylesTasksThisWeek.list}>
        {loadingState ? (
          <div className={stylesTasksThisWeek.containLoading}>
            <img src={gifLoading}></img>
            <span>loading tasks...</span>
          </div>
        ) : tasksThisWeek.length > 0 ? (
          tasksThisWeek.slice(0, 6).map((taskThisWeek, index) => (
            <li
              key={index}
              className={
                index % 2 == 0
                  ? stylesTasksThisWeek.liGray
                  : stylesTasksThisWeek.liWhite
              }
            >
              <div className={stylesTasksThisWeek.rowOne}>
                <div className={stylesTasksThisWeek.iconTask}>
                  <span>{taskThisWeek.icon}</span>
                </div>
                <div className={stylesTasksThisWeek.columnOne}>
                  <span>{taskThisWeek.date}</span>
                  <span className={stylesTasksThisWeek.description}>
                    {taskThisWeek.description}
                  </span>
                </div>
              </div>
              <div className={stylesTasksThisWeek.columnTwo}>
                <div
                  className={
                    taskThisWeek.isCompleted
                      ? stylesTasksThisWeek.stateTaskCompleted
                      : stylesTasksThisWeek.stateTaskIncompleted
                  }
                >
                  <span>
                    {taskThisWeek.isCompleted ? "Completed" : "Incomplete"}
                  </span>
                </div>
                <span>Files Attachment:{taskThisWeek.files.length}</span>
              </div>
            </li>
          ))
        ) : tasksThisWeek.length == 0 ? (
          <div className={stylesTasksThisWeek.containNotTasks}>
            <img src={notPendingTask}></img>
            <h3>Not tasks this week</h3>
          </div>
        ) : (
          ""
        )}
      </ul>

      {tasksThisWeek.length > 0 ? (
        <button onClick={() => (location.href = "/tasks")}>See more</button>
      ) : (
        ""
      )}
    </div>
  );
};
