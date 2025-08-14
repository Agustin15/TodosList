import styles from "./Files.module.css";
import iconFilesSaved from "../../assets/img/filesSaved.png";
import iconNotFound from "../../assets/img/noFound.png";
import iconLoadingFiles from "../../assets/img/loadingFiles.gif";
import { useFiles } from "../../context/FilesContext";
import Header from "../header/Header";
import { Storage } from "./storage/Storage";
import { SearchFile } from "./SearchFile";
import { UserDataProvider } from "../../context/UserDataContext";
import { MenuProvider } from "../../context/MenuContext";
import { NotFiles } from "./notFiles/NotFiles";
import { Pagination } from "./pagination/Pagination";
import { RowFile } from "./rowFile/RowFile";
import { Title } from "../title/Title";
import { useState } from "react";

export const Files = () => {
  const { pages, quantityFiles, files, loading } = useFiles();
  const [notResults, setNotResults] = useState();

  return (
    <div className={styles.containFiles}>
      <MenuProvider>
        <UserDataProvider>
          <Title title={"Files storage"} icon={iconFilesSaved}></Title>
          <Header />
        </UserDataProvider>
      </MenuProvider>

      <div className={styles.containTable}>
        <div className={styles.contentTable}>
          <div className={styles.header}>
            <div className={styles.title}>
              <h3>Files storage</h3>
              <img src={iconFilesSaved}></img>
            </div>
            <Storage />
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
                <tr className={styles.rowSearch}>
                  <td>
                    <SearchFile setNotResults={setNotResults} files={files} />
                  </td>
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} rowSpan={5}>
                      <div className={styles.loading}>
                        <span>Loading files</span>
                        <img src={iconLoadingFiles}></img>
                      </div>
                    </td>
                  </tr>
                ) : files.length == 0 && quantityFiles == 0 ? (
                  <NotFiles />
                ) : (
                  files.map((file, index) => (
                    <RowFile index={index} file={file} key={index} />
                  ))
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
              </tbody>
            </table>
          </div>

          {pages > 0 && <Pagination />}
        </div>
      </div>
    </div>
  );
};
