import styles from "./ContentFormEdit.module.css";
import iconFileNotUploaded from "../../../assets/img/cloudError.png";
import iconFile from "../../../assets/img/file.png";
import iconFileUploaded from "../../../assets/img/cloudOk.png";
import gifLoading from "../../../assets/img/loadingForm.gif";
import iconDelete from "../../../assets/img/delete.png";
import AlertErrorInput from "../../addTodoForm/alertErrorInput/AlertErrorInput";
import AlertForm from "../../addTodoForm/alertForm/AlertForm";
import { useForm } from "../../../context/FormTaskContext";
import { useTasks } from "../../../context/TaskContext";
import { useEffect } from "react";

const ContentFormEdit = ({ values, handleChange }) => {
  const {
    errors,
    resultForm,
    filesUploadedUpdateForm,
    setFilesUploadedUpdateForm,
    cleanForm,
    deleteFileOption
  } = useForm();
  const { loadingState, formatDate } = useTasks();

  useEffect(() => {
    setFilesUploadedUpdateForm(createFiles());
  }, []);

  const createFiles = () => {
    let filesUploaded = values.filesUploaded.map((file) => {
      if (file.fileTask) {
        return createFile(file);
      } else {
        return file;
      }
    });

    return filesUploaded;
  };

  function base64ToBlob(base64, contentType) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }

    const byteArray = new Uint8Array(byteArrays);
    return new Blob([byteArray], { type: contentType });
  }

  const createFile = (file) => {
    let blob = base64ToBlob(file.fileTask, file.typeFile);
    const newFile = new File([blob], file.nameFile, {
      type: file.typeFile
    });

    return newFile;
  };

  return (
    <div className={styles.bodyForm}>
      <div className={styles.rowForm}>
        <div className={styles.icon}>
          <label>Task icon:</label>
          <input
            defaultValue={values.icon}
            onChange={handleChange}
            placeholder="Enter task icon"
            type="text"
            name="icon"
          ></input>
          <AlertErrorInput error={errors.icon} />
        </div>

        <div className={styles.name}>
          <label>Task date:</label>
          <div className={styles.dateTime}>
            <input
              name="datetimeTask"
              defaultValue={formatDate(values.datetimeTask)}
              onChange={handleChange}
              type="datetime-local"
            ></input>
          </div>
          <AlertErrorInput error={errors.datetimeTask} />
        </div>
      </div>

      <div className={styles.description}>
        <label>Description:</label>
        <textarea
          defaultValue={values.descriptionTask}
          onChange={handleChange}
          placeholder="Description..."
          name="descriptionTask"
          maxLength={130}
        ></textarea>
        <AlertErrorInput input={"description"} error={errors.descriptionTask} />
      </div>

      <div className={styles.containFile}>
        <img
          src={
            filesUploadedUpdateForm > 0 ? iconFileUploaded : iconFileNotUploaded
          }
        ></img>
        <label htmlFor="inputFile">Upload file(limit:10MB)</label>
        <input
          id="inputFile"
          multiple
          name="filesUploaded"
          onChange={handleChange}
          type="file"
        ></input>
        <AlertErrorInput input={"filesUploaded"} error={errors.filesUploaded} />

        <span>Archivos subidos:{filesUploadedUpdateForm.length}</span>
        <ul>
          {filesUploadedUpdateForm.length > 0
            ? filesUploadedUpdateForm.map((file, index) => (
                <li key={index}>
                  <div className={styles.rowFile}>
                    <img src={iconFile}></img>
                    <span>{file.name}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() =>
                      deleteFileOption(file.lastModified, file.name)
                    }
                  >
                    <img src={iconDelete}></img>
                  </button>
                </li>
              ))
            : ""}
        </ul>
      </div>

      <div className={styles.buttons}>
        <button type="submit">
          Update
          {loadingState && <img src={gifLoading}></img>}
        </button>
        <button onClick={cleanForm} type="reset">
          Clean
        </button>
      </div>

      {resultForm && <AlertForm />}
    </div>
  );
};

export default ContentFormEdit;
