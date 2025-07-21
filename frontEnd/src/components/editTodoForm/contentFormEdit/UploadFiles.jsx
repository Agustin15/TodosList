import iconFileUploaded from "../../../assets/img/attachmentFiles.png";
import iconFile from "../../../assets/img/file.png";
import iconDelete from "../../../assets/img/delete.png";
import iconNotFiles from "../../../assets/img/notFiles.png";
import styles from "./ContentFormEdit.module.css";
import { useForm } from "../../../context/formTaskContext/FormTaskContext";
import AlertErrorInput from "../../addTodoForm/alertErrorInput/AlertErrorInput";
import { GlassEffect } from "../../glassEffect/GlassEffect";

export const UploadFiles = () => {
  const { errors, handleChange, deleteFileOption, values } = useForm();

  return (
    <div className={styles.containFile}>
      <img src={iconFileUploaded}></img>
      <label htmlFor="inputFile">Attachment files(limit:10MB)</label>
      <input
        id="inputFile"
        multiple
        name="filesUploaded"
        onChange={(event) => handleChange(event, true)}
        type="file"
      ></input>
      <AlertErrorInput input={"filesUploaded"} error={errors.filesUploaded} />

      <span>Files attachment:{values.filesUploaded.length}</span>
      <ul>
        {values.filesUploaded.length > 0 ? (
          values.filesUploaded.map((file, index) => (
            <li key={index}>
              <GlassEffect />
              <div className={styles.rowFile}>
                <img src={iconFile}></img>
                <span>{file.name}</span>
              </div>
              <div className={styles.containDelete}>
                <button type="button" onClick={() => deleteFileOption(index)}>
                  <img src={iconDelete}></img>
                </button>
              </div>
            </li>
          ))
        ) : (
          <div className={styles.notFilesUploaded}>
            <img src={iconNotFiles}></img>
            <span>Not files uploaded still</span>
          </div>
        )}
      </ul>
    </div>
  );
};
