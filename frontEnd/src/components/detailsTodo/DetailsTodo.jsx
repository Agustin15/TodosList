import classesStyle from "./DetailsTodo.module.css";
import iconInfoTitle from "../../assets/img/infoTitle.png";

const DetailsTodo = ({ task, setOpenModalInfo }) => {
  return (
    <div className={classesStyle.contain}>
      <div className={classesStyle.header}>
        <button onClick={() => setOpenModalInfo(false)}>X</button>
      </div>
      <div className={classesStyle.containDetails}>
        <div className={classesStyle.title}>
          <h3>Task details</h3>
          <img src={ iconInfoTitle }></img>
        </div>
        <div className={classesStyle.details}>
          <div className={classesStyle.iconAndName}>
            <span className={classesStyle.title}>{task.name}</span>
            <span className={classesStyle.icon}>{task.icon}</span>
          </div>
          <div className={classesStyle.description}>
            <div className={classesStyle.state}>
              <span>
                State:
                <a
                  className={
                    task.isCompleted
                      ? classesStyle.stateComplete
                      : classesStyle.stateIncomplete
                  }
                >
                  {task.isCompleted ? " Complete" : " Pending"}
                </a>
              </span>
            </div>
            <div className={classesStyle.containParragraph}>
              <span>Description:</span>
              <p className={classesStyle.descriptionParragraph}>
                {task.description}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsTodo;
