import classesStyle from "./ContentForm.module.css";
import AlertErrorInput from "../alertErrorInput/AlertErrorInput";
import AlertForm from "../alertForm/AlertForm";
import { useForm } from "../../../context/FormContext";
const ContentForm = ({ handleChange }) => {
  const { values, errors, resultForm, cleanValues } = useForm();

  return (
    <div className={classesStyle.bodyForm}>
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

      <div className={classesStyle.rowForm}>
        <div className={classesStyle.name}>
          <label>Task name:</label>
          <input
            value={values.name}
            onChange={handleChange}
            placeholder="Enter task name"
            type="text"
            name="name"
          ></input>
          <AlertErrorInput error={errors.name} />
        </div>
        <div className={classesStyle.creator}>
          <label>Creator:</label>
          <input
            value={values.creator}
            onChange={handleChange}
            placeholder="Enter task creator"
            type="text"
            name="creator"
          ></input>
          <AlertErrorInput error={errors.creator} />
        </div>
      </div>

      <div className={classesStyle.description}>
        <label>Description:</label>
        <textarea
          value={values.description}
          onChange={handleChange}
          placeholder="Description..."
          name="description"
        ></textarea>
        <AlertErrorInput error={errors.description} />
      </div>

      <div className={classesStyle.buttons}>
        <button>Add</button>
        <button type="reset" onClick={cleanValues}>
          Clean
        </button>
      </div>

      <AlertForm resultForm={resultForm} />
    </div>
  );
};

export default ContentForm;
