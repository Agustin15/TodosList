import styles from "./FilterOption.module.css";
import { useFilterOptionTasks } from "../../context/FilterOptionTasksContext";
import { useState } from "react";

export const Filter = ({ setRefs, years }) => {
  const [checkedThisWeek, setCheckedThisWeek] = useState(true);
  const {
    refSelectMonth,
    refSelectState,
    refSelectYear,
    refCheckBoxThisWeek,
    setIndexSelected,
    queryTasksDependingOptions
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
    await queryTasksDependingOptions(1);
    setRefs(
      refCheckBoxThisWeek.current.checked
        ? [refCheckBoxThisWeek, refSelectState]
        : [refSelectMonth, refSelectState, refSelectYear]
    );
    setIndexSelected(1);
  };

  return (
    <ul className={styles.filter}>
      <li>
        <span>This Week</span>
        <input
          ref={refCheckBoxThisWeek}
          onChange={() =>
            setCheckedThisWeek(refCheckBoxThisWeek.current.checked)
          }
          type="checkbox"
          value={"thisWeek"}
          defaultChecked
        ></input>
      </li>

      <li>
        <span>Year</span>
        <select
          disabled={checkedThisWeek}
          ref={refSelectYear}
          defaultValue={new Date().getFullYear()}
        >
          {years.length > 0 ? (
            years.map((year, index) => (
              <option key={index} value={Object.values(year)}>
                {Object.values(year)}
              </option>
            ))
          ) : (
            <option value={new Date().getFullYear()}>
              {new Date().getFullYear()}
            </option>
          )}
        </select>
      </li>

      <li>
        <span>Month</span>
        <select
          disabled={checkedThisWeek}
          ref={refSelectMonth}
          defaultValue={new Date().getMonth() + 1}
        >
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
