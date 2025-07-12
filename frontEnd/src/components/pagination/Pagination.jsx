import { useEffect, useState } from "react";
import { useTasks } from "../../context/TaskContext";
import styles from "./Pagination.module.css";
import { useFilterOptionTasks } from "../../context/FilterOptionTasksContext";
import { GlassEffect } from "../glassEffect/GlassEffect";

export const Pagination = () => {
  const { dispatch } = useTasks();
  const [pages, setPages] = useState();
  const {
    refCheckBoxThisWeek,
    refInputNumberIndex,
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

  const handleChangeInput = (event) => {
    if (event.target.value > 0 && event.target.value <= pages) {
      let newIndexSelected = event.target.value;
      changePage(newIndexSelected);
    }
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
      <button
        disabled={indexSelected == 1 ? true : false}
        className={
          indexSelected == 1 ? styles.btnPrevDisabled : styles.btnPrevEnabled
        }
        onClick={() => changePage(indexSelected)}
      >
        Prev
        <GlassEffect />
      </button>
      <div className={styles.index}>
        <input
          ref={refInputNumberIndex}
          onChange={(event) => handleChangeInput(event)}
          type="number"
          min={1}
          max={pages}
          defaultValue={1}
        ></input>
        of {pages}
      </div>

      <button
        disabled={indexSelected < pages ? false : true}
        className={
          indexSelected < pages ? styles.btnNextEnabled : styles.btnNextDisabled
        }
        onClick={() => changePage(indexSelected)}
      >
        Next
        <GlassEffect />
      </button>
    </div>
  );
};
