import styles from "./TodoList.module.css";
import noTaskIcon from "../../assets/img/sinTareas.png";
import iconNoFound from "../../assets/img/noFound.png";
import iconAllTasks from "../../assets/img/allTasksIcon.png";
import gifLoadingTasks from "../../assets/img/loader.gif";
import TodoItem from "../todoItem/TodoItem";
import Modal from "../modal/Modal";
import { Title } from "../title/Title";
import { Pagination } from "../pagination/Pagination";
import AddTodoForm from "../addTodoForm/AddTodoForm";
import { useTasks } from "../../context/TaskContext";
import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { CalendarEventsProvider } from "../../context/CalendarEventsContext";
import { FilterOption } from "../filterOption/FilterOption";
import { useFilterOptionTasks } from "../../context/FilterOptionTasksContext";
import { FormTaskProvider } from "../../context/formTaskContext/FormTaskContext";

const TodoList = () => {
  const {
    tasks,
    getTaskById,
    getTasksByWeekdayFromChart,
    dispatch,
    loadingState
  } = useTasks();
  const {
    getTasksThisWeekByStateAndUser,
    getTasksThisWeekByStateAndUserLimit,
    loadingFilter
  } = useFilterOptionTasks();

  const [searchParams] = useSearchParams();
  const { idTask } = useParams();
  const [taskNotFound, setTaskNotFound] = useState(false);
  const [openModalAdd, setOpenModalAdd] = useState(false);
  const [optionSearch] = useState(JSON.parse(searchParams.get("tasksWeekDay")));

  useEffect(() => {
    if (optionSearch)
      getTasksByWeekdayFromChart(optionSearch.state, optionSearch.weekday);
    else if (idTask) {
      getTaskById({ id: idTask });
    } else {
      getTasksThisWeekByStateAndUser();
      getTasksThisWeekByStateAndUserLimit(1, dispatch);
    }
  }, []);

  return (
    <div className={styles.contentBody}>
      <Title
        title={optionSearch ? `Tasks ${optionSearch.weekday}` : "Tasks"}
        icon={iconAllTasks}
      ></Title>

      <div className={styles.containTasks}>
        <div className={styles.header}>
          <div className={styles.rowHeader}>
            <div className={styles.title}>
              <h3>
                {optionSearch ? `Tasks ${optionSearch.weekday}` : "Tasks"}
              </h3>
              <img src={iconAllTasks}></img>
            </div>
          </div>
        </div>
        {!idTask && (
          <FilterOption
            setOpenModalAdd={setOpenModalAdd}
            setTaskNotFound={setTaskNotFound}
          />
        )}

        {!loadingFilter || !loadingState ? (
          tasks.length == 0 ? (
            <div className={styles.warningShow}>
              <img src={noTaskIcon}></img>
              <h3>Not Tasks </h3>
            </div>
          ) : (
            <ul id="ulTasks" className={styles.tasks}>
              {tasks.map((task, index) => (
                <TodoItem key={index} index={index} task={task}></TodoItem>
              ))}
              <div
                className={
                  taskNotFound
                    ? styles.taskNotFoundShow
                    : styles.taskNotFoundHide
                }
              >
                <img src={iconNoFound}></img>
                <h3>Task not found</h3>
              </div>
            </ul>
          )
        ) : (
          <div className={styles.loadingShow}>
            <img src={gifLoadingTasks}></img>
            <h3>loading tasks</h3>
          </div>
        )}

        {!idTask && <Pagination />}
      </div>

      {openModalAdd && (
        <Modal>
          <CalendarEventsProvider>
            <FormTaskProvider>
              <AddTodoForm setOpenModalAdd={setOpenModalAdd} />
            </FormTaskProvider>
          </CalendarEventsProvider>
        </Modal>
      )}
    </div>
  );
};

export default TodoList;
