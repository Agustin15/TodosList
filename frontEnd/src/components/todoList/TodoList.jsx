import styles from "./TodoList.module.css";
import noTaskIcon from "../../assets/img/sinTareas.png";
import iconPendingTasks from "../../assets/img/unfinished.png";
import iconAllTasks from "../../assets/img/allTasksIcon.png";
import TodoItem from "../todoItem/TodoItem";
import { useTasks } from "../../context/TaskContext";
import Loader from "../loader/Loader";
import { useEffect } from "react";

const TodoList = () => {
  const { tasks,loadingState } = useTasks();

  useEffect(() => {
    console.log("Tasks in context:", tasks);
  }, [tasks]);

  return (
  
    <div className={styles.containTasks}>

      <div className={styles.header}>
        <div className={styles.title}>
        <h3>All tasks</h3>
        <img src={iconAllTasks}></img>
        </div>
      </div>
      <div className={loadingState ? styles.loadingShow : styles.loadingHide}>
        <h3>loading tasks</h3>

        <Loader isLoading={loadingState} color="blue" size={8} />
      </div>

      <div className={tasks.length>0 ? styles.warningHide : styles.warningShow}>
        <img src={noTaskIcon}></img>
        <h3>Not Tasks </h3>
      </div>
      {tasks && (
        <ul className={styles.tasks}>
          {tasks.map((task) => (
            <TodoItem key={task._id} task={task}></TodoItem>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodoList;
