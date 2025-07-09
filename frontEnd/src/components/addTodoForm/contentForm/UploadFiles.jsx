import iconFileUploaded from "../../../assets/img/attachmentFiles.png";
import iconFile from "../../../assets/img/file.png";
import iconNotFiles from "../../../assets/img/notFiles.png";
import classesStyle from "./ContentForm.module.css";
import { useForm } from "../../../context/formTaskContext/FormTaskContext";
import AlertErrorInput from "../alertErrorInput/AlertErrorInput";

export const UploadFiles = ({ handleChange }) => {
  const { values, errors } = useForm();

  return (
    <div className={classesStyle.containFile}>
      <img src={iconFileUploaded}></img>
      <label htmlFor="inputFile">Attachment files(limit:10MB)</label>
      <input
        id="inputFile"
        multiple
        name="filesUploaded"
        onChange={handleChange}
        type="file"
      ></input>

      <span>Uploaded files:{values.filesUploaded.length}</span>
      <AlertErrorInput input={"filesUploaded"} error={errors.filesUploaded} />
      <ul>
        {values.filesUploaded.length > 0 ? (
          values.filesUploaded.map((file, index) => (
            <li key={index}>
              <img src={iconFile}></img>
              <span>{file.name}</span>
            </li>
          ))
        ) : (
          <div className={classesStyle.notFilesUploaded}>
            <img src={iconNotFiles}></img>
            <span>Not files uploaded still</span>
          </div>
        )}
      </ul>
    </div>
  );
};
