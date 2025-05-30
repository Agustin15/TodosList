import styles from "./FilterOption.module.css";
import { useFilterOptionTasks } from "../../context/FilterOptionTasksContext";
import { useTasks } from "../../context/TaskContext";
import { useState } from "react";

export const Filter = ({ setRefs, years }) => {
  const { dispatch } = useTasks();
  const {
    refSelectMonth,
    refSelectState,
    refSelectYear,
    refCheckBoxThisWeek,
    setIndexSelected,
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
  const handleSearch = async () => {
    if (refCheckBoxThisWeek.current.checked) {
      getTasksThisWeekUser();
      getTasksThisWeekUserLimit(0, dispatch);
    } else {
      getTasksFilter("getTasksLimitByFilterOption", 0, dispatch);
      getQuantityTasksFilter("getQuantityTasksByFilterOption");
    }
    setRefs(
      refCheckBoxThisWeek.current.checked
        ? [refCheckBoxThisWeek]
        : [refSelectMonth, refSelectState, refSelectYear]
    );
    setIndexSelected(0);
  };

  return (
    <ul className={styles.filter}>
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
  );
};
