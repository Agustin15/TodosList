import styles from "./FilterOption.module.css";
import iconFilter from "../../assets/img/filtrer.png";
import SearchTask from "../searchTask/SearchTask";
import { useTasks } from "../../context/TaskContext";
import { useEffect, useRef } from "react";
import { useState } from "react";
import { useFilterOptionTasks } from "../../context/FilterOptionTasksContext";

export const FilterOption = ({ setTaskNotFound }) => {
  const [years, setYears] = useState([]);
  const { dispatch } = useTasks();

  const {
    refSelectMonth,
    refSelectState,
    refSelectYear,
    refCheckBoxThisWeek,
    getYearsOfTasks,
    getTasksFilter,
    getQuantityTasksFilter,
    getTasksThisWeekUser,
    getTasksThisWeekUserLimit
  } = useFilterOptionTasks();

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];

  useEffect(() => {
    setSelectYears();
  }, []);

  const setSelectYears = async () => {
    const yearsTasks = await getYearsOfTasks();
    if (years) {
      setYears(yearsTasks);
    }
  };

  const handleSearch = async () => {
    if (refCheckBoxThisWeek.current.checked) {
      getTasksThisWeekUser();
      getTasksThisWeekUserLimit(0, dispatch);
    } else {
      getTasksFilter("getTasksLimitByFilterOption", 0, dispatch);
      getQuantityTasksFilter("getQuantityTasksByFilterOption");
    }
  };

  return (
    <div className={styles.containFilterOption}>
      <SearchTask setTaskNotFound={setTaskNotFound}></SearchTask>
      <ul>
        <img src={iconFilter}></img>
        <li>
          <span>This Week</span>
          <input
            ref={refCheckBoxThisWeek}
            type="checkbox"
            value={"thisWeek"}
            defaultChecked
          ></input>
        </li>
        <li>
          <span>Year</span>
          <select ref={refSelectYear} defaultValue={new Date().getFullYear()}>
            {years.map((year, index) => (
              <option key={index} value={Object.values(year)}>
                {Object.values(year)}
              </option>
            ))}
          </select>
        </li>

        <li>
          <span>Month</span>
          <select ref={refSelectMonth} defaultValue={new Date().getMonth() + 1}>
            {months.map((month, index) => (
              <option key={index} value={index + 1}>
                {month}
              </option>
            ))}
          </select>
        </li>

        <li>
          <span>State</span>
          <select ref={refSelectState} defaultValue={0}>
            <option value={1}>Completed</option>
            <option value={0}>Pending</option>
          </select>
        </li>
        <button onClick={handleSearch}>Buscar</button>
      </ul>
    </div>
  );
};
