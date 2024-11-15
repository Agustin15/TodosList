import styles from "./TodoList.module.css";
import noTaskIcon from "../../assets/img/sinTareas.png";
import TodoItem from "../todoItem/TodoItem";
import { useTasks } from "../../context/TaskContext";

const TodoList = () => {
  const { tasks } = useTasks();
  const { loadingState } = useTasks();

  return (
    <div className={styles.containTasks}>
      <h3 className={loadingState ? styles.loadingShow : styles.loadingHide}>
        Loading tasks...
      </h3>

      <div className={tasks ? styles.warningHide : styles.warningShow}>
        <img src={noTaskIcon}></img>
        <h3>Not Tasks </h3>
      </div>
      {tasks ? (
        <ul className={styles.tasks}>
          {tasks.map((task) => (
            <TodoItem task={task}></TodoItem>
          ))}
        </ul>
      ) : (
        ""
      )}
    </div>
  );
};

export default TodoList;
