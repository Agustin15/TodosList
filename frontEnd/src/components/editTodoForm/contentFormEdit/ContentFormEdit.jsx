import { act, useState } from "react";
import styles from "./ContentFormEdit.module.css";
import { useForm } from "../../../context/FormContext";
import AlertErrorInput from "../../addTodoForm/alertErrorInput/AlertErrorInput";
import AlertForm from "../../addTodoForm/alertForm/AlertForm";
import Loader from "../../loader/Loader";
import { useTasks } from "../../../context/TaskContext";

const ContentFormEdit = ({ cleanValues, values, handleChange }) => {
  const { errors, resultForm } = useForm();
  const { loadingState } = useTasks();

  return (
    <div className={styles.bodyForm}>
      <div className={styles.rowForm}>
        <div className={styles.icon}>
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

        <div className={styles.name}>
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
      </div>

      <div className={styles.description}>
        <label>Description:</label>
        <textarea
          value={values.description}
          onChange={handleChange}
          placeholder="Description..."
          name="description"
        ></textarea>
        <AlertErrorInput error={errors.description} />
      </div>

      <div className={styles.buttons}>
        <button>
          Update
          <Loader isLoading={loadingState} color="white" size={3} />
        </button>
        <button onClick={cleanValues} type="reset">
          Clean
        </button>
      </div>

      {resultForm && <AlertForm />}
    </div>
  );
};

export default ContentFormEdit;
