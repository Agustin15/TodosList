import classesStyle from "./FilesTask.module.css";
import iconOpenDocument from "../../../assets/img/openDocument.png";
import iconDownload from "../../../assets/img/download.png";
import { useTasks } from "../../../context/TaskContext";
import { useFiles } from "../../../context/FilesContext";

export const FilesTask = ({ task }) => {
  const { formatDate } = useTasks();
  const { handleDownload, generateLink, getMime } = useFiles();

  return (
    <div className={classesStyle.containTable}>
      <table className={classesStyle.tableFiles}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Date uploaded</th>
            <th>Options</th>
          </tr>
        </thead>

        <tbody>
          {task.filesUploaded.map((file, index) => (
            <tr
              key={index}
              className={
                index % 2 == 0 ? classesStyle.rowGray : classesStyle.rowWhite
              }
            >
              <td>
                <div className={classesStyle.cellName}>
                  <p>{file.nameFile}</p>
                </div>
              </td>
              <td>
                <div className={classesStyle.cellTypeFile}>{file.typeFile}</div>
              </td>
              <td>
                <div className={classesStyle.cellDate}>
                  {formatDate(file.datetimeUpload)}
                </div>
              </td>
              <td>
                <div className={classesStyle.options}>
                  {getMime(file) && (
                    <a
                      target="_blank"
                      href={generateLink(file)}
                      title="Open file"
                      className={classesStyle.openFile}
                    >
                      <img
                        className={classesStyle.imgOpenDocument}
                        src={iconOpenDocument}
                      ></img>
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
          ))}
        </tbody>
      </table>
    </div>
  );
};
