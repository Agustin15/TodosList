import styles from "./ContentFormEdit.module.css";
import AlertErrorInput from "../../addTodoForm/alertErrorInput/AlertErrorInput";
import { useForm } from "../../../context/formTaskContext/FormTaskContext";
import { useSubscription } from "../../../context/SubscriptionContext";
import { useTasks } from "../../../context/TaskContext";
import { useEffect } from "react";


export const ColumnOne = ({ values, handleChange }) => {
  const { subscribed } = useSubscription();
  const { formatDate } = useTasks();
  const { stateCheckbox, setStateCheckbox } = useForm();

  useEffect(() => {
    if (values.datetimeNotification && values.datetimeNotification.length > 0) {
      setStateCheckbox(true);
    }
  }, [values]);

  const valueCheckboxNotification = (event) => {
    setStateCheckbox(event.target.checked ? true : false);
  };

  
  const { refDatetimeTask, errors } = useForm();
  return (
    <div className={styles.columnOne}>
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
              min={formatDate(new Date())}
              name="datetimeTask"
              ref={refDatetimeTask}
              defaultValue={formatDate(values.datetimeTask)}
              onChange={handleChange}
              type="datetime-local"
            ></input>
          </div>
          <AlertErrorInput error={errors.datetimeTask} />
        </div>
      </div>

      <div className={styles.datetimeNotification}>
        <div className={styles.contentDatetimeNotification}>
          <div className={styles.containLabelDatetimeNotification}>
            <input
              onClick={(event) => valueCheckboxNotification(event)}
              type="checkbox"
              defaultChecked={
                values.datetimeNotification.length > 0 ? true : false
              }
            ></input>
            <label>Notification date:</label>
          </div>
          {!subscribed && <a>(You must subscribe for this option)</a>}

          <input
            min={formatDate(new Date())}
            disabled={subscribed && stateCheckbox ? false : true}
            name="datetimeNotification"
            defaultValue={
              values.datetimeNotification && stateCheckbox
                ? formatDate(values.datetimeNotification)
                : ""
            }
            onChange={handleChange}
            type="datetime-local"
          ></input>

          <AlertErrorInput error={errors.datetimeNotification} />
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
    </div>
  );
};
