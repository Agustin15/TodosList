import styles from "./TodoList.module.css";
import noTaskIcon from "../../assets/img/sinTareas.png";
import iconNoFound from "../../assets/img/noFound.png";
import iconAllTasks from "../../assets/img/allTasksIcon.png";
import iconAddTask from "../../assets/img/iconAddTask.png";
import gifLoadingTasks from "../../assets/img/loadingTasks.gif";
import TodoItem from "../todoItem/TodoItem";
import Modal from "../modal/Modal";
import { Pagination } from "../pagination/Pagination";
import AddTodoForm from "../addTodoForm/AddTodoForm";
import { useTasks } from "../../context/TaskContext";
import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import { FilterOption } from "../filterOption/FilterOption";

const TodoList = () => {
  const {
    tasks,
    loadingState,
    getTasksThisWeekUser,
    getTasksThisWeekUserLimit,
    getTaskById
  } = useTasks();
  const [taskNotFound, setTaskNotFound] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const refSelectYear = useRef();
  const refSelectMonth = useRef();
  const refSelectState = useRef();
  const { idTask } = useParams();

  useEffect(() => {
    if (idTask) {
      getTaskById({ id: idTask });
    } else {
      getTasksThisWeekUser("tasksThisWeekQuantity");
      getTasksThisWeekUserLimit(0);
    }
  }, []);

  return (
    <div className={styles.contentBody}>
      <div className={styles.containTasks}>
        <div className={styles.header}>
          <div className={styles.rowHeader}>
            <div className={styles.title}>
              <h3>List tasks</h3>
              <img src={iconAllTasks}></img>
            </div>
            <div className={styles.addTask}>
              <button onClick={() => setOpenModalAdd(true)}>
                Add task
                <img src={iconAddTask}></img>
              </button>
            </div>
          </div>
        </div>
        {!idTask && (
          <FilterOption
            selectYear={refSelectYear}
            selectMonth={refSelectMonth}
            selectState={refSelectState}
            setTaskNotFound={setTaskNotFound}
          />
        )}

        {tasks && (
          <ul id="ulTasks" className={styles.tasks}>
            <div
              className={loadingState ? styles.loadingShow : styles.loadingHide}
            >
              <img src={gifLoadingTasks}></img>
              <h3>loading tasks</h3>
            </div>

            <div
              className={
                tasks.length == 0 && !loadingState
                  ? styles.warningShow
                  : styles.warningHide
              }
            >
              <img src={noTaskIcon}></img>
              <h3>Not Tasks </h3>
            </div>

            <div
              className={
                taskNotFound ? styles.taskNotFoundShow : styles.taskNotFoundHide
              }
            >
              <img src={iconNoFound}></img>
              <h3>Task not found</h3>
            </div>
            {!loadingState
              ? tasks.map((task, index) => (
                  <TodoItem
                    index={index}
                    key={task.idTask}
                    task={task}
                  ></TodoItem>
                ))
              : ""}
          </ul>
        )}

        {!idTask && (
          <Pagination
            selectYear={refSelectYear}
            selectMonth={refSelectMonth}
            selectState={refSelectState}
          />
        )}
      </div>

      {openModalAdd && (
        <Modal>
          <AddTodoForm setOpenModalAdd={setOpenModalAdd} />
        </Modal>
      )}
    </div>
  );
};

export default TodoList;
