import styles from "./RowFile.module.css";
import iconOpenFile from "../../../assets/img/openDocument.png";
import iconDownload from "../../../assets/img/download.png";
import { useFiles } from "../../../context/FilesContext";
import { useTasks } from "../../../context/TaskContext";

export const RowFile = ({ file, index }) => {
  const { handleDownload, generateLink, mimeAccept } = useFiles();
  const { formatDate } = useTasks();
  return (
    <tr className={index % 2 == 0 ? styles.trGray : styles.trWhite}>
      <td>
        <p>{file.nameFile}</p>
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
        <div className={styles.contentCellDescription}>{file.descriptionTask}</div>
      </td>
      <td>
        <div className={styles.options}>
          {mimeAccept.indexOf(file.typeFile) > -1 && (
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
