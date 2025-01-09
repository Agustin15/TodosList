import styles from "./TodoList.module.css";
import noTaskIcon from "../../assets/img/sinTareas.png";
import iconPendingTasks from "../../assets/img/unfinished.png";
import iconNoFound from "../../assets/img/noFound.png";
import iconCompleteTasks from "../../assets/img/completeTasks.png";
import iconSearch from "../../assets/img/search.png";
import iconAllTasks from "../../assets/img/allTasksIcon.png";
import TodoItem from "../todoItem/TodoItem";
import SearchTask from "../searchTask/SearchTask";
import Statistics from "../statistics/Statistics";
import { useTasks } from "../../context/TaskContext";
import Loader from "../loader/Loader";
import { useRef, useState } from "react";

const TodoList = () => {
  const { tasks, loadingState, getTasksStateFilter, getTasksByUser } =
    useTasks();
  const selectFilterTasks = useRef();
  const titleRef = useRef();
  const imgTitleRef = useRef();
  const [taskNotFound, setTaskNotFound] = useState(false);

  const optionTitlesAndIcons = [
    { option: "allTasks", title: "All tasks", img: iconAllTasks },
    { option: "true", title: "Complete tasks", img: iconCompleteTasks },
    { option: "false", title: "Pending tasks", img: iconPendingTasks },
  ];
  const changeTitle = (option) => {
    const optionFind = optionTitlesAndIcons.find(
      (value) => value.option == option
    );

    titleRef.current.textContent = optionFind.title;
    imgTitleRef.current.src = optionFind.img;
  };

  const handleFilterTasks = () => {
    let option = selectFilterTasks.current.value;
    if (option == "allTasks") {
      getTasksByUser();
    } else {
      let isCompleted = option;
      getTasksStateFilter(isCompleted);
    }

    changeTitle(option);
  };

  return (
    <div className={styles.contentBody}>
      <Statistics></Statistics>
      <div className={styles.containTasks}>
        <div className={styles.header}>
          <div className={styles.title}>
            <h3 ref={titleRef}>All tasks</h3>
            <img ref={imgTitleRef} src={iconAllTasks}></img>
          </div>

          <div className={styles.containFilterTasks}>
            <SearchTask setTaskNotFound={setTaskNotFound} />
            <div className={styles.containSelect}>
              <span>Filter tasks:</span>
              <div className={styles.rowSelect}>
                <select ref={selectFilterTasks}>
                <option value={"allTasks"}>All Tasks</option>
                  <option value={true}>Complete Tasks</option>
                  <option value={false}>Pending Tasks</option>
                  
                </select>
                <button onClick={handleFilterTasks}>
                  <img src={iconSearch}></img>
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className={loadingState ? styles.loadingShow : styles.loadingHide}>
          <h3>loading tasks</h3>

          <Loader isLoading={loadingState} color="blue" size={8} />
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
        {tasks && (
          <ul id="ulTasks" className={styles.tasks}>
            {tasks.map((task) => (
              <TodoItem key={task._id} task={task}></TodoItem>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default TodoList;
