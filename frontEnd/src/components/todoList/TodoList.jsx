import styles from "./TodoList.module.css";
import noTaskIcon from "../../assets/img/sinTareas.png";
import iconNoFound from "../../assets/img/noFound.png";
import iconAllTasks from "../../assets/img/allTasksIcon.png";
import gifLoadingTasks from "../../assets/img/loadingTasks.gif";
import TodoItem from "../todoItem/TodoItem";
import Modal from "../modal/Modal";
import { Title } from "../title/Title";
import { Pagination } from "../pagination/Pagination";
import AddTodoForm from "../addTodoForm/AddTodoForm";
import { useTasks } from "../../context/TaskContext";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CalendarEventsProvider } from "../../context/CalendarEventsContext";
import { FilterOption } from "../filterOption/FilterOption";
import { useFilterOptionTasks } from "../../context/FilterOptionTasksContext";
import { WindowSizeProvider } from "../../context/WindowSizeContext";
import { SubscriptionProvider } from "../../context/SubscriptionContext";

const TodoList = () => {
  const { tasks, getTaskById, dispatch } = useTasks();
  const {
    getTasksThisWeekByStateAndUser,
    getTasksThisWeekByStateAndUserLimit,
    loadingFilter
  } = useFilterOptionTasks();

  const [taskNotFound, setTaskNotFound] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);

  const { idTask } = useParams();

  useEffect(() => {
    if (idTask) {
      getTaskById({ id: idTask });
    } else {
      getTasksThisWeekByStateAndUser();
      getTasksThisWeekByStateAndUserLimit(1, dispatch);
    }
  }, []);

  return (
    <div className={styles.contentBody}>
      <Title title={"Tasks"} icon={iconAllTasks}></Title>
      <div className={styles.containTasks}>
        <div className={styles.header}>
          <div className={styles.rowHeader}>
            <div className={styles.title}>
              <h3>List tasks</h3>
              <img src={iconAllTasks}></img>
            </div>
          </div>
        </div>
        {!idTask && (
          <WindowSizeProvider>
            <FilterOption
              setOpenModalAdd={setOpenModalAdd}
              setTaskNotFound={setTaskNotFound}
            />
          </WindowSizeProvider>
        )}

        {tasks && (
          <ul id="ulTasks" className={styles.tasks}>
            <div
              className={
                loadingFilter ? styles.loadingShow : styles.loadingHide
              }
            >
              <img src={gifLoadingTasks}></img>
              <h3>loading tasks</h3>
            </div>

            <div
              className={
                tasks.length == 0 && !loadingFilter
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
            {!loadingFilter
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

        {!idTask && <Pagination />}
      </div>

      {openModalAdd && (
        <Modal>
          <CalendarEventsProvider>
            <SubscriptionProvider>
              <WindowSizeProvider>
                <AddTodoForm setOpenModalAdd={setOpenModalAdd} />
              </WindowSizeProvider>
            </SubscriptionProvider>
          </CalendarEventsProvider>
        </Modal>
      )}
    </div>
  );
};

export default TodoList;
