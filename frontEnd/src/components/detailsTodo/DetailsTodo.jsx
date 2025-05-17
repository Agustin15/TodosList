import classesStyle from "./DetailsTodo.module.css";
import iconInfoTitle from "../../assets/img/infoTitle.png";
import iconCalendar from "../../assets/img/calendar.png";
import { FilesTask } from "./FilesTask";

const DetailsTodo = ({ task, setOpenModalInfo }) => {
  const formatToStringDate = (date) => {
    let dateTask = new Date(date);
    let datetimeString = new Intl.DateTimeFormat("en-UY", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric"
    }).format(dateTask);

    return datetimeString;
  };

  return (
    <div className={classesStyle.contain}>
      <div className={classesStyle.header}>
        <div className={classesStyle.title}>
          <h3>Task details</h3>
          <img src={iconInfoTitle}></img>
        </div>
        <div className={classesStyle.containBtnClose}>
          <button onClick={() => setOpenModalInfo(false)}>X</button>
        </div>
      </div>
      <div className={classesStyle.containDetails}>
        <li className={classesStyle.detailsIcon}>
          <h3>Icon:</h3>
          <span>{task.icon}</span>
        </li>

        <li>
          <h3>State:</h3>
          <span
            className={
              task.isCompleted
                ? classesStyle.stateCompleted
                : classesStyle.statePending
            }
          >
            {task.isCompleted ? "Completed" : "Pending"}
          </span>
        </li>
        <li>
          <h3>Date:</h3>
          <div className={classesStyle.detailsDate}>
            <img src={iconCalendar}></img>
            <span>{formatToStringDate(task.datetimeTask)}</span>
          </div>
        </li>
        <li className={classesStyle.containDescriptionTask}>
          <h3>Description:</h3>
          <p>{task.descriptionTask}</p>
        </li>

        <FilesTask task={task} />
      </div>
    </div>
  );
};

export default DetailsTodo;
