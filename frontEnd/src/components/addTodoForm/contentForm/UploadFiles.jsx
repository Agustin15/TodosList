import iconFileUploaded from "../../../assets/img/attachmentFiles.png";
import iconFile from "../../../assets/img/file.png";
import iconNotFiles from "../../../assets/img/notFilesUploaded.png";
import iconDelete from "../../../assets/img/delete.png";
import classesStyle from "./ContentForm.module.css";
import { useForm } from "../../../context/formTaskContext/FormTaskContext";
import AlertErrorInput from "../alertErrorInput/AlertErrorInput";
import { GlassEffect } from "../../glassEffect/GlassEffect";

export const UploadFiles = () => {
  const { errors, handleChange, deleteFileOption, values } = useForm();

  return (
    <div className={classesStyle.containFile}>
      <img src={iconFileUploaded}></img>
      <label htmlFor="inputFile">Attachment files(limit:10MB)</label>
      <input
        id="inputFile"
        multiple
        name="filesUploaded"
        onChange={(event) => handleChange(event, true)}
        type="file"
      ></input>

      <span>Uploaded files:{values.filesUploaded.length}</span>
      <AlertErrorInput input={"filesUploaded"} error={errors.filesUploaded} />
      <ul>
        {values.filesUploaded.length > 0 ? (
          values.filesUploaded.map((file, index) => (
            <li key={index}>
              <GlassEffect />
              <div className={classesStyle.rowFile}>
                <img src={iconFile}></img>
                <span>{file.name}</span>
              </div>
              <div className={classesStyle.containDelete}>
                <img
                  onClick={() => deleteFileOption(index)}
                  src={iconDelete}
                ></img>
              </div>
            </li>
          ))
        ) : (
          <div className={classesStyle.notFilesUploaded}>
            <img src={iconNotFiles}></img>
            <span>Not files uploaded yet</span>
          </div>
        )}
      </ul>
    </div>
  );
};
