import iconFileNotUploaded from "../../../assets/img/cloudError.png";
import iconFileUploaded from "../../../assets/img/cloudOk.png";
import iconFile from "../../../assets/img/file.png";
import gifLoading from "../../../assets/img/loadingForm.gif";
import classesStyle from "./ContentForm.module.css";
import AlertErrorInput from "../alertErrorInput/AlertErrorInput";
import AlertForm from "../alertForm/AlertForm";
import { useForm } from "../../../context/FormTaskContext";
import { useTasks } from "../../../context/TaskContext";
import { useEffect } from "react";
import { useCalendarEvents } from "../../../context/CalendarEventsContext";

const ContentForm = ({ handleChange }) => {
  const { values, setValues, errors, resultForm, cleanForm } = useForm();
  const { loadingState } = useTasks();
  const { dateSelected } = useCalendarEvents();

  useEffect(() => {
    if (dateSelected) {
      setValues({ ...values, ["datetimeTask"]: dateSelected });
    }
  }, []);

  return (
    <div className={classesStyle.bodyForm}>
      <div className={classesStyle.rowForm}>
        <div className={classesStyle.icon}>
          <label>Task icon:</label>
          <input
            value={values.icon}
            onChange={handleChange}
            placeholder="Enter task icon"
            type="text"
            name="icon"
          ></input>
          <AlertErrorInput error={errors.icon} />
        </div>

        <div className={classesStyle.name}>
          <label>Task date:</label>
          <div className={classesStyle.dateTime}>
            <input
              name="datetimeTask"
              value={values.datetimeTask}
              onChange={handleChange}
              type="datetime-local"
            ></input>
          </div>
          <AlertErrorInput error={errors.datetimeTask} />
        </div>
      </div>

      <div className={classesStyle.description}>
        <label>Description:</label>
        <textarea
          value={values.descriptionTask}
          onChange={handleChange}
          placeholder="Description..."
          name="descriptionTask"
          maxLength={130}
        ></textarea>
        <AlertErrorInput input={"description"} error={errors.descriptionTask} />
      </div>

      <div className={classesStyle.containFile}>
        <img
          src={
            values.filesUploaded.length > 0
              ? iconFileUploaded
              : iconFileNotUploaded
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

        <span>Archivos subidos:{values.filesUploaded.length}</span>
        <ul>
          {values.filesUploaded.length > 0
            ? values.filesUploaded.map((file, index) => (
                <li key={index}>
                  <img src={iconFile}></img>
                  <span>{file.name}</span>
                </li>
              ))
            : ""}
        </ul>
      </div>

      <div className={classesStyle.buttons}>
        <button>
          Add
          {loadingState && <img src={gifLoading}></img>}
        </button>
        <button type="reset" onClick={cleanForm}>
          Clean
        </button>
      </div>

      {resultForm && <AlertForm />}
    </div>
  );
};

export default ContentForm;
