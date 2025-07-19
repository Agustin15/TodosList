import styles from "./UploadFiles.module.css";
import attachmentFiles from "../../../../assets/img/attachmentFilesFormQuery.png";
import fileError from "../../../../assets/img/fileError.png";
import iconWarningInput from "../../../../assets/img/warningInput.png";
import iconFileAttachment from "../../../../assets/img/fileAttachment.png";
import { useFormHelp } from "../../../../context/FormHelpContext";

export const UploadFiles = () => {
  const { values, deleteFileAttachmentByIndex, mimeAccept, handleChange } =
    useFormHelp();

  return (
    <div className={styles.containUploadFiles}>
      <label>Attachment files</label>
      <label className={styles.labelFiles} htmlFor="inputFiles">
        <div className={styles.optionAttachment}>
          <img src={attachmentFiles}></img>
          <span>Only 3 files allow</span>
          <input
            multiple
            name="files"
            onChange={(event) => handleChange(event, true)}
            id="inputFiles"
            type="file"
            accept="image/png, image/jpeg, image/jpg"
          ></input>
        </div>
      </label>

      <ul>
        {values.files.length > 0 &&
          values.files.map((file, index) => (
            <li
              key={index}
              className={
                file.size > 1000 * 10000 ||
                index > 2 ||
                mimeAccept.indexOf(file.type.toLowerCase()) == -1
                  ? styles.error
                  : styles.correct
              }
            >
              <div className={styles.containClose}>
                <button
                  type="button"
                  onClick={() => deleteFileAttachmentByIndex(index)}
                >
                  x
                </button>
              </div>
              <div className={styles.rowFile}>
                <img
                  src={
                    file.size > 1000 * 10000 ||
                    index > 2 ||
                    mimeAccept.indexOf(file.type.toLowerCase()) == -1
                      ? fileError
                      : iconFileAttachment
                  }
                ></img>
                <span>{file.name}</span>
              </div>
              {(file.size > 1000 * 10000 ||
                index > 2 ||
                mimeAccept.indexOf(file.type.toLowerCase()) == -1) && (
                <div className={styles.detailsErrorFile}>
                  <img src={iconWarningInput}></img>
                  {file.size > 1000 * 10000 && (
                    <p>File size exceeded the max</p>
                  )}

                  {index > 2 && <p>Limit files quantity exceeded</p>}

                  {mimeAccept.indexOf(file.type.toLowerCase()) == -1 && (
                    <p>Type file not allow</p>
                  )}
                </div>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};
