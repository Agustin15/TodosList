import classesStyle from "./ContentForm.module.css";
import AlertErrorInput from "../alertErrorInput/AlertErrorInput";
import { useForm } from "../../../context/formTaskContext/FormTaskContext";
import { useSubscription } from "../../../context/SubscriptionContext";
import { useRef } from "react";
import { useTasks } from "../../../context/TaskContext";

export const ColumnOne = ({ setStateCheckbox, stateCheckbox }) => {
  const { errors, refDatetimeTask, handleChange, values } = useForm();
  const refCheckBoxNotification = useRef();
  const { subscribed } = useSubscription();
  const { formatDate } = useTasks();
  const valueCheckboxNotification = () => {
    setStateCheckbox(refCheckBoxNotification.current.checked ? true : false);
  };

  return (
    <div className={classesStyle.columnOne}>
      <div className={classesStyle.rowForm}>
        <div className={classesStyle.icon}>
          <label>Task icon:</label>
          <input
            value={values.icon}
            onChange={handleChange}
            placeholder="Enter icon"
            type="text"
            name="icon"
          ></input>
          <AlertErrorInput error={errors.icon} />
        </div>

        <div className={classesStyle.name}>
          <label>Task date:</label>
          <div className={classesStyle.dateTime}>
            <input
              ref={refDatetimeTask}
              name="datetimeTask"
              min={formatDate(new Date())}
              value={values.datetimeTask}
              onChange={handleChange}
              type="datetime-local"
            ></input>
          </div>
          <AlertErrorInput error={errors.datetimeTask} />
        </div>
      </div>

      <div className={classesStyle.datetimeNotification}>
        <div className={classesStyle.contentDatetimeNotification}>
          <div className={classesStyle.containLabelDatetimeNotification}>
            <input
              onClick={() => valueCheckboxNotification()}
              ref={refCheckBoxNotification}
              type="checkbox"
            ></input>
            <label>Notification date:</label>
          </div>
          {!subscribed && <a>(You must subscribe for this option)</a>}

          <input
            disabled={subscribed && stateCheckbox ? false : true}
            name="datetimeNotification"
            min={formatDate(new Date())}
            value={values.datetimeNotification}
            onChange={handleChange}
            type="datetime-local"
          ></input>

          <AlertErrorInput error={errors.datetimeNotification} />
        </div>
      </div>

      <div className={classesStyle.rowForm}>
        <div className={classesStyle.description}>
          <label>Description:</label>
          <textarea
            value={values.descriptionTask}
            onChange={handleChange}
            placeholder="Description..."
            name="descriptionTask"
            maxLength={130}
          ></textarea>
          <AlertErrorInput
            input={"description"}
            error={errors.descriptionTask}
          />
        </div>
      </div>
    </div>
  );
};
