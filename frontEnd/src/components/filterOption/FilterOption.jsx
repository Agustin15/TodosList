import styles from "./FilterOption.module.css";
import iconFilter from "../../assets/img/filterOne.png";
import iconFilterTwo from "../../assets/img/filterTwo.png";
import iconFilterClose from "../../assets/img/closeFilter.png";
import iconAddTask from "../../assets/img/iconAddTask.png";
import SearchTask from "../searchTask/SearchTask";
import { Filter } from "./Filter";
import { useEffect } from "react";
import { useState } from "react";
import { useFilterOptionTasks } from "../../context/FilterOptionTasksContext";

export const FilterOption = ({ setTaskNotFound, setOpenModalAdd }) => {
  const { getYearsOfTasks, refCheckBoxThisWeek, openFilter, setOpenFilter } =
    useFilterOptionTasks();

  const [years, setYears] = useState([]);
  const [refs, setRefs] = useState([refCheckBoxThisWeek]);

  useEffect(() => {
    setSelectYears();
  }, []);

  const setSelectYears = async () => {
    const yearsTasks = await getYearsOfTasks();
    if (years) {
      setYears(yearsTasks);
    }
  };

  const handleFilter = () => {
    openFilter ? setOpenFilter(false) : setOpenFilter(true);
  };

  return (
    <div className={styles.containFilterOption}>
      <button onClick={handleFilter} className={styles.openFilter}>
        <img src={iconFilter}></img>
      </button>

      <ul className={styles.categorys}>
        <span>Category:</span>
        {refs.map(
          (ref, index) =>
            ref.current && (
              <li key={index}>
                {ref.current.value == "thisWeek"
                  ? "this week"
                  : ref.current.selectedOptions[0].innerText}
              </li>
            )
        )}
      </ul>

      <div
        className={openFilter ? styles.panelFilterShow : styles.panelFilterHide}
      >
        <div className={styles.close}>
          <img onClick={() => setOpenFilter(false)} src={iconFilterClose}></img>
        </div>

        <div className={styles.titleFilter}>
          <h3>Options</h3>
          <img src={iconFilterTwo}></img>
        </div>

        <div className={styles.addTask}>
          <button onClick={() => setOpenModalAdd(true)}>
            <img src={iconAddTask}></img>
          </button>
        </div>

        <SearchTask setTaskNotFound={setTaskNotFound}></SearchTask>
        <Filter setRefs={setRefs} years={years}></Filter>
      </div>
    </div>
  );
};
