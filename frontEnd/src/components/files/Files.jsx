import styles from "./Files.module.css";
import iconFilesSaved from "../../assets/img/filesSaved.png";
import iconNotFound from "../../assets/img/noFound.png";
import iconLoadingFiles from "../../assets/img/loadingFiles.gif";
import { useFiles } from "../../context/FilesContext";
import Header from "../header/Header";
import { UserDataProvider } from "../../context/userDataContext";
import { MenuProvider } from "../../context/MenuContext";
import { NotFiles } from "./notFiles/NotFiles";
import { Pagination } from "./pagination/Pagination";
import { RowFile } from "./rowFile/RowFile";
import { Title } from "../title/Title";
import { useState } from "react";

export const Files = () => {
  const { pages, quantityFiles, files, loading } = useFiles();
  const [notResults, setNotResults] = useState();

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
    <div className={styles.containFiles}>
      <UserDataProvider>
        <MenuProvider>
          <Title title={"Files uploaded"} icon={iconFilesSaved}></Title>
          <Header />
        </MenuProvider>
      </UserDataProvider>

      <div className={styles.containTable}>
        <div className={styles.contentTable}>
          <div className={styles.header}>
            <div className={styles.title}>
              <h3>Files uploaded</h3>
              <img src={iconFilesSaved}></img>
            </div>
            <div className={styles.containSearch}>
              <input
                onKeyDown={(event) => handleSearch(event)}
                type="text"
                placeholder="Search..."
              ></input>
            </div>
          </div>
          <div className={styles.scroll}>
            <table>
              <thead>
                <tr>
                  <th>Name file</th>
                  <th>Type file</th>
                  <th>Date uploaded</th>
                  <th>Task</th>
                  <th>Options</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr>
                    <td colSpan={5} rowSpan={5}>
                      <div className={styles.loading}>
                        <span>Loading files</span>
                        <img src={iconLoadingFiles}></img>
                      </div>
                    </td>
                  </tr>
                )}

                {notResults && (
                  <tr>
                    <td colSpan={5} rowSpan={5}>
                      <div className={styles.notFound}>
                        <img src={iconNotFound}></img>
                        <span>File not found</span>
                      </div>
                    </td>
                  </tr>
                )}
                {quantityFiles == 0 && !loading && <NotFiles />}
                {files.length > 0 && !loading
                  ? files.map((file, index) => (
                      <RowFile file={file} index={index} />
                    ))
                  : ""}
              </tbody>
            </table>
          </div>
          {pages > 0 && <Pagination />}
        </div>
      </div>
    </div>
  );
};
