import styles from "./ContentFormEdit.module.css";
import gifLoading from "../../../assets/img/loadingForm.gif";
import { useForm } from "../../../context/formTaskContext/FormTaskContext";
import { useTasks } from "../../../context/TaskContext";
import { useEffect } from "react";
import { UploadFiles } from "./UploadFiles";
import { ColumnOne } from "./ColumnOne";
import { SubscriptionProvider } from "../../../context/SubscriptionContext";

const ContentFormEdit = ({ values, handleChange }) => {
  const { setFilesUploadedUpdateForm, cleanForm, updateEnabled } = useForm();
  const { loadingState } = useTasks();

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
    <div className={styles.contentForm}>
      <div className={styles.bodyForm}>
        <SubscriptionProvider>
          <ColumnOne values={values} handleChange={handleChange} />
        </SubscriptionProvider>
        <div className={styles.columnTwo}>
          <UploadFiles handleChange={handleChange} values={values} />
        </div>
      </div>

      <div className={styles.buttons}>
        <button
          className={!updateEnabled ? styles.btnDisabled : ""}
          disabled={!updateEnabled}
          type="submit"
        >
          Update
          {loadingState && <img src={gifLoading}></img>}
        </button>
        <button onClick={cleanForm} type="reset">
          Clean
        </button>
      </div>
    </div>
  );
};

export default ContentFormEdit;
