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
            // accept="image/png, image/jpeg, image/jpg"
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
                  {file.size > 1000 * 10000 && (
                    <div className={styles.typeError}>
                      <img src={iconWarningInput}></img>
                      <p>File size exceeded the max</p>
                    </div>
                  )}

                  {index > 2 && (
                    <div className={styles.typeError}>
                      <img src={iconWarningInput}></img>
                      <p>Limit of files allow exceeded </p>
                    </div>
                  )}

                  {mimeAccept.indexOf(file.type.toLowerCase()) == -1 && (
                    <div className={styles.typeError}>
                      <img src={iconWarningInput}></img>
                      <p>Type file not allow</p>
                    </div>
                  )}
                </div>
              )}
            </li>
          ))}
      </ul>
    </div>
  );
};
