import styles from "./Pagination.module.css";
import { useFiles } from "../../../context/FilesContext";
import { useRef } from "react";
import { useEffect } from "react";

export const Pagination = () => {
  const { pages, index, setIndex, fetchGetFiles } = useFiles();
  const refInputIndex = useRef();

  useEffect(() => {
    fetchGetFiles(index);
  }, [index]);

  const changePage = (event) => {
    if (event.target.value >= 1 && event.target.value <= pages)
      setIndex(event.target.value);
  };

  return (
    <div className={styles.pagination}>
      <button
        disabled={index == 1 ? true : false}
        onClick={() => setIndex(index - 1)}
        className={index == 1 ? styles.disabled : styles.enabled}
      >
        Prev
      </button>
      <input
        ref={refInputIndex}
        type="number"
        min={1}
        max={pages}
        onChange={(event) => changePage(event)}
        defaultValue={index}
      ></input>
      of {pages}
      <button
        disabled={index < pages ? false : true}
        onClick={() => setIndex(index + 1)}
        className={index < pages ? styles.enabled : styles.disabled}
      >
        Next
      </button>
    </div>
  );
};
