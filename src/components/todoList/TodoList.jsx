import { useEffect, useState } from "react";
import styles from "./TodoList.module.css";

const TodoList = () => {
  const [tasks, setTasks] = useState([]);

  const getTasks = async () => {
    let data = null;
    try {
      const response = await fetch("http://localhost:3000/todos");
      const result = await response.json();
      if (result.length > 0) {
        data = result;
      }
    } catch (error) {
      console.log(error);
    } finally {
      return data;
    }
  };

  useEffect(() => {
    const dataTasks = async () => {
      const dataTasks = await getTasks();
      setTasks(dataTasks);
    };

    dataTasks();
  }, []);

  return (
    <div className={styles.containTasks}>
      <ul className={styles.tasks}>
        {tasks.map((task) => (
          <li key={task.id}>
            <div className={styles.info}>
              <div className={styles.icon}>
                <span>{task.icon}</span>
              </div>

              <div className={styles.dataTask}>
                <span>{task.name}</span>
                <span>
                  <a>Creador: </a>
                  {task.creator}
                </span>
                <div>
                  <p>{task.description}</p>
                </div>
                <span
                  className={
                    task.isCompleted
                      ? styles.stateCompletedTask
                      : styles.statePendingTask
                  }
                >
                  <a>Estado: </a>
                  {task.isCompleted ? "Completada" : "Pendiente"}
                </span>
              </div>
            </div>
            <div className={styles.containButton}>
              <button>Más info</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TodoList;
