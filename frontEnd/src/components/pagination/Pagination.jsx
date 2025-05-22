import { useEffect, useState } from "react";
import { useTasks } from "../../context/TaskContext";
import styles from "./Pagination.module.css";
import iconArrow from "../../assets/img/arrow.png";
import { useFilterOptionTasks } from "../../context/FilterOptionTasksContext";

export const Pagination = () => {
  const { dispatch } = useTasks();
  const [pages, setPages] = useState();
  const {
    refCheckBoxThisWeek,
    setIndexSelected,
    indexSelected,
    quantityTasks,
    getTasksThisWeekUserLimit,
    getTasksFilter
  } = useFilterOptionTasks();

  const changePage = (newIndexSelected) => {
    if (refCheckBoxThisWeek.current.checked) {
      getTasksThisWeekUserLimit(newIndexSelected, dispatch);
    } else {
      getTasksFilter("getTasksLimitByFilterOption", indexSelected, dispatch);
    }
    setIndexSelected(newIndexSelected);
  };

  useEffect(() => {
    if (quantityTasks > 0) {
      setPages(Math.ceil(quantityTasks / 10));
    }
  }, [quantityTasks]);

  return (
    <div
      className={
        quantityTasks > 0
          ? styles.containPaginationShow
          : styles.containPaginationHide
      }
    >
      <div className={styles.index}>
        <li>{indexSelected / 10 + 1}</li>
        de {pages}
      </div>
      <div className={styles.nextPrev}>
        <button
          disabled={indexSelected == 0 ? true : false}
          className={
            indexSelected == 0 
              ? styles.btnPrevDisabled
              : styles.btnPrevEnabled
          }
          onClick={() => changePage(indexSelected - 10)}
        >
          <img src={iconArrow}></img>
        </button>
        <button
          disabled={indexSelected / 10 + 1 < pages ? false : true}
          className={
            indexSelected / 10 + 1 < pages
              ? styles.btnNextEnabled
              : styles.btnNextDisabled
          }
          onClick={() => changePage(indexSelected + 10)}
        >
          <img src={iconArrow}></img>
        </button>
      </div>
    </div>
  );
};
