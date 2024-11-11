import { useEffect, useRef, useState } from "react";
import styles from "./TodoList.module.css";
import noTaskIcon from "../../assets/img/sinTareas.png";
import TodoItem from "../todoItem/TodoItem";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const refLoading = useRef();

  const loading = (state) => {
    if (state) {
      refLoading.current.style.display = "flex";
    } else {
      refLoading.current.style.display = "none";
    }
  };

  const getTasks = async () => {
    let data = null;

    loading(true);
    try {
      const response = await fetch("http://localhost:3000/todos");
      const result = await response.json();

      data = result;
    } catch (error) {
      console.log(error);
    } finally {
      loading(false);
      return data;
    }
  };

  useEffect(() => {
    const dataTasks = async () => {
      const dataTasks = await getTasks();
      if (dataTasks) {
        setTasks(dataTasks);
      }
    };

    dataTasks();
  }, []);

  return (
    <div className={styles.containTasks}>
      <h3 className={styles.loading} ref={refLoading}>
        Loading tasks...
      </h3>

      <div
        className={tasks.length > 0 ? styles.warningHide : styles.warningShow}
      >
        <img src={noTaskIcon}></img>
        <h3>Sin tareas</h3>
      </div>
      <ul className={styles.tasks}>
        {tasks.map(task=>(
            <TodoItem task={task}></TodoItem>
        ))}
        
      </ul>
    </div>
  );
};

export default TodoList;
