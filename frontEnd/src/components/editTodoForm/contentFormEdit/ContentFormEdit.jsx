import styles from "./ContentFormEdit.module.css";
import gifLoading from "../../../assets/img/loadingForm.gif";
import { useForm } from "../../../context/formTaskContext/FormTaskContext";
import { useTasks } from "../../../context/TaskContext";
import { UploadFiles } from "./UploadFiles";
import { ColumnOne } from "./ColumnOne";
import { SubscriptionProvider } from "../../../context/SubscriptionContext";

const ContentFormEdit = () => {
  const { cleanForm, updateEnabled } = useForm();
  const { loadingState } = useTasks();

  return (
    <div className={styles.contentForm}>
      <div className={styles.bodyForm}>
        <SubscriptionProvider>
          <ColumnOne />
        </SubscriptionProvider>
        <div className={styles.columnTwo}>
          <UploadFiles />
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
