import styles from "./RowFile.module.css";
import iconOpenFile from "../../../assets/img/openDocument.png";
import iconDownload from "../../../assets/img/download.png";
import { useFiles } from "../../../context/FilesContext";
import { useTasks } from "../../../context/TaskContext";
import iconFile from "../../../assets/img/fileAttachment.png";

export const RowFile = ({ index, file }) => {
  const { handleDownload, generateLink, getMime } = useFiles();
  const { formatDate } = useTasks();

  return (
    <tr className={index % 2 == 0 ? styles.rowWhite : styles.rowGray}>
      <td>
        <div className={styles.contentCellName}>
          <img src={getMime(file) ? getMime(file).icon : iconFile}></img>
          <p>{file.nameFile}</p>
        </div>
      </td>
      <td>
        <div className={styles.contentCellTypeFile}>{file.typeFile}</div>
      </td>
      <td>
        <div className={styles.contentCellDate}>
          {formatDate(file.datetimeUpload)}
        </div>
      </td>
      <td>
        <div className={styles.contentCellDescription}>
          {file.descriptionTask}
        </div>
      </td>
      <td>
        <div className={styles.options}>
          {getMime(file) && (
            <a target="_blank" href={generateLink(file)} title="Open file">
              <img className={styles.openFile} src={iconOpenFile}></img>
            </a>
          )}

          <a>
            <button
              onClick={(event) => handleDownload(event, file)}
              title="Download file"
            >
              <img src={iconDownload}></img>
            </button>
          </a>
        </div>
      </td>
    </tr>
  );
};
