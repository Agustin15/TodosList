import { useEffect, useState } from "react";
import { useTasks } from "../../context/TaskContext";
import styles from "./Pagination.module.css";
import iconArrow from "../../assets/img/arrow.png";

export const Pagination = ({ selectYear, selectMonth, selectState }) => {
  const { quantityTasks, getTasksFilter, setIndexSelected, indexSelected } =
    useTasks();
  const [pages, setPages] = useState();

  const changePage = (newIndexSelected) => {
    getTasksFilter(
      "getTasksLimitByFilterOption",
      selectYear.current.value,
      selectMonth.current.value,
      selectState.current.value,
      newIndexSelected
    );
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
        <li>{indexSelected + 1}</li>
        de {pages}
      </div>
      <div className={styles.nextPrev}>
        <button
          className={
            indexSelected + 1 == 1
              ? styles.btnPrevDisabled
              : styles.btnPrevEnabled
          }
          onClick={() => changePage(indexSelected - 10)}
        >
          <img src={iconArrow}></img>
        </button>
        <button
          className={
            indexSelected + 1 == pages
              ? styles.btnNextDisabled
              : styles.btnNextEnabled
          }
          onClick={() => changePage(indexSelected + 10)}
        >
          <img src={iconArrow}></img>
        </button>
      </div>
    </div>
  );
};
