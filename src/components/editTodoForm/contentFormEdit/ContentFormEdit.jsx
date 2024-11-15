import { act, useState } from "react";
import styles from "./ContentFormEdit.module.css";
import { useForm } from "../../../context/FormContext";
import AlertErrorInput from "../../addTodoForm/alertErrorInput/AlertErrorInput";
import AlertForm from "../../addTodoForm/alertForm/AlertForm";

const ContentFormEdit = ({ values, handleChange }) => {
  const { errors, resultForm } = useForm();

  return (
    <div className={styles.bodyForm}>
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

      <div className={styles.rowForm}>
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
        <div className={styles.creator}>
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
        <button>Update</button>
        <button type="reset">Clean</button>
      </div>

      <AlertForm resultForm={resultForm} />
    </div>
  );
};

export default ContentFormEdit;
