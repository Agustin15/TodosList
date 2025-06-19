import iconFileNotUploaded from "../../../assets/img/cloudError.png";
import iconFileUploaded from "../../../assets/img/cloudOk.png";
import iconFile from "../../../assets/img/file.png";
import iconDelete from "../../../assets/img/delete.png";
import iconNotFiles from "../../../assets/img/notFiles.png";
import styles from "./ContentFormEdit.module.css";
import { useForm } from "../../../context/formTaskContext/FormTaskContext";
import AlertErrorInput from "../../addTodoForm/alertErrorInput/AlertErrorInput";

export const UploadFiles = ({ handleChange }) => {
  const { errors, filesUploadedUpdateForm, deleteFileOption } = useForm();

  return (
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

      <span>Uploaded files:{filesUploadedUpdateForm.length}</span>
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
                  onClick={() => deleteFileOption(file.lastModified, file.name)}
                >
                  <img src={iconDelete}></img>
                </button>
              </li>
            ))
          : <div className={styles.notFilesUploaded}>
             <img src={iconNotFiles}></img>
             <span>Not files uploaded still</span>
            </div>}
      </ul>
    </div>
  );
};
