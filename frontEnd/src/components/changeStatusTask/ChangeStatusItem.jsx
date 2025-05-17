import classesStyle from "./ChangeStatusItem.module.css";
import iconCompleteTask from "../../assets/img/iconCompleteTask.png";
import iconPendingTask from "../../assets/img/iconPendingTask.png";
import iconError from "../../assets/img/errorIcon3.png";
import { useTasks } from "../../context/TaskContext";
import { useState } from "react";

const ChangeStatusItem = ({ task, setOpenModalChangeStatus }) => {
  const { patchStateTask } = useTasks();
  const [alertError, setAlertError] = useState(false);

  const handleChangeStatusTask = async (task) => {
    const result = await patchStateTask(
      task.isCompleted ? false : true,
      task.idTask
    );

    if (result) {
      setOpenModalChangeStatus(false);
    } else {
      setAlertError(true);
    }
  };
  return (
    <div className={classesStyle.containChangeStatus}>
      <img src={task.isCompleted ? iconPendingTask : iconCompleteTask}></img>
      <p>
        Do you want to mark this task as  
        {task.isCompleted ? " pending" : " complete"}?
      </p>
      <div
        className={
          task.isCompleted
            ? classesStyle.buttonsColorPending
            : classesStyle.buttonsColorComplete
        }
      >
        <button onClick={() => handleChangeStatusTask(task)}>Confirm</button>
        <button onClick={() => setOpenModalChangeStatus(false)}>Cancel</button>
      </div>

      {alertError && (
        <div className={classesStyle.alertError}>
          <img src={iconError}></img>
          <span>Oops,failed to update task</span>
        </div>
      )}
    </div>
  );
};

export default ChangeStatusItem;
