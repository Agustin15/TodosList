import styles from "./SearchTask.module.css";
import iconSearch from "../../assets/img/search.png";
import { useState } from "react";

const SearchTask = ({ setTaskNotFound }) => {
  const [inputSearch, setInputSearch] = useState();

  const handleSearchTask = () => {
    let itemsTask = [
      ...document.querySelector("#ulTasks").querySelectorAll("li"),
    ];

    itemsTask.forEach((itemTask) => {
      if (itemTask.textContent.indexOf(inputSearch.trim()) == -1) {
        itemTask.style.display = "none";
      } else {
        itemTask.style.display = "flex";
      }
    });

    let itemsHidden = itemsTask.filter((item) => item.style.display == "none");

    if (itemsHidden.length == itemsTask.length) {
      setTaskNotFound(true);
    } else {
      setTaskNotFound(false);
    }
  };

  const handleChangeInput = (event) => {
    let input = event.target;
    setInputSearch(input.value);
  };

  return (
    <div className={styles.containSearch}>
      <input
        onChange={() => handleChangeInput(event)}
        placeholder="Search task..."
      ></input>
      <button onClick={handleSearchTask}>
        <img src={iconSearch}></img>
      </button>
    </div>
  );
};

export default SearchTask;
