import stylesTasksThisWeek from "./TasksThisWeek.module.css";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

export const Task = ({ taskThisWeek, index }) => {
  return (
    <li
      onClick={() =>
        (location.href = `${urlFront}tasks?idTask=${taskThisWeek.id}`)
      }
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
          <span className={stylesTasksThisWeek.date}>{taskThisWeek.date}</span>
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
          <span>{taskThisWeek.isCompleted ? "Completed" : "Incomplete"}</span>
        </div>
        <span>Files Attachment:{taskThisWeek.files.length}</span>
      </div>
    </li>
  );
};
