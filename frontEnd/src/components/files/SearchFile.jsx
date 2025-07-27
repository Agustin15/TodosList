import styles from "./Files.module.css";

export const SearchFile = ({ setNotResults, files }) => {
  const handleSearch = (event) => {
    let tbody = document.querySelector("tbody");
    if (files.length > 0) {
      tbody.querySelectorAll("tr").forEach((row) => {
        if (
          row.textContent
            .toLocaleLowerCase()
            .indexOf(event.target.value.toLocaleLowerCase()) > -1
        )
          row.style.display = "table-row";
        else row.style.display = "none";
      });

      let rowsHidden = [...tbody.querySelectorAll("tr")].filter(
        (row) => row.style.display == "none"
      );

      if (files.length == rowsHidden.length) setNotResults(true);
      else setNotResults(false);
    }
  };
  return (
    <div className={styles.containSearch}>
      <input
        onKeyDown={(event) => handleSearch(event)}
        type="text"
        placeholder="Search..."
      ></input>
    </div>
  );
};
