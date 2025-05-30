import styles from "./SearchTask.module.css";
import searchIcon from "../../assets/img/search.png";

const SearchTask = ({ setTaskNotFound }) => {
  const handleSearchTask = (event) => {
    let input = event.target;
    let valueInput = input.value.toLowerCase().trim();

    let itemsTask = [
      ...document.querySelector("#ulTasks").querySelectorAll("li")
    ];

    itemsTask.forEach((itemTask) => {
      if (itemTask.textContent.toLowerCase().indexOf(valueInput) == -1) {
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

  return (
    <div className={styles.containSearch}>
      <input
        onChange={(event) => handleSearchTask(event)}
        placeholder="Search task..."
      ></input>
    </div>
  );
};

export default SearchTask;
