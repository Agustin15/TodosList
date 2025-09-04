import styles from "./EditTodoForm.module.css";
import ContentFormEdit from "./contentFormEdit/ContentFormEdit";
import editIcon from "../../assets/img/editing.png";
import { useForm } from "../../context/formTaskContext/FormTaskContext";
import { useTasks } from "../../context/TaskContext";
import { GlassEffect } from "../glassEffect/GlassEffect.jsx";
import { useEffect } from "react";
import { AlertFormSwal } from "../sweetAlert/sweetAlert.js";
import { ValidationFormError } from "../../ValidationForm.js";

const EditTodoForm = ({ task, setOpenModalUpdate }) => {
  const {
    validationForm,
    stateCheckbox,
    setStateCheckbox,
    verifiyChangedValues,
    setUpdateEnabled,
    createFiles,
    cleanForm,
    filesSizeExceeded,
    values,
    setValues
  } = useForm();
  const { updateTask } = useTasks();

  useEffect(() => {

    if(task.datetimeNotification.length>0)
    setStateCheckbox(true);
  
    setValues({
      ...task,
      ["filesUploaded"]: createFiles(task.filesUploaded)
    });
  }, []);

  useEffect(() => {
    if (values) {
      let changedValue = verifiyChangedValues(task, values);
      setUpdateEnabled(changedValue);
    }
  }, [values]);

  const handleSubmit = async (event) => {
    let title, msj, icon, validation;

    event.preventDefault();

    const formData = new FormData(event.target);

    for (const array of formData.entries()) {
      validation = validationForm(array[0], array[1]);
      if (!validation) break;
    }

    let valuesForm = values;
    valuesForm.datetimeNotification = stateCheckbox
      ? valuesForm.datetimeNotification
      : "";

    try {
      if (filesSizeExceeded || !validation) {
        throw new ValidationFormError("Complete correctly the fields please");
      } else {
        let taskUpdated = await updateTask(valuesForm);
        if (taskUpdated) {
          title = "Succesfully!";
          msj = "Task updated succesfully!";
          icon = "success";
        } else {
          throw new Error("Failed to update task");
        }
      }
    } catch (error) {
      icon = error instanceof ValidationFormError ? "warning" : "error";
      title = error instanceof ValidationFormError ? "Warning" : "Oops";
      msj = error;
    } finally {
      AlertFormSwal(msj, title, icon);
    }
  };

  const handleClose = () => {
    cleanForm();
    setOpenModalUpdate(false);
  };

  return (
    <div className={styles.containForm}>
      <div className={styles.header}>
        <GlassEffect />
        <div className={styles.title}>
          <h3>Complete task details</h3>
          <img src={editIcon}></img>
        </div>

        <div className={styles.btnClose}>
          <button onClick={handleClose}>X</button>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <ContentFormEdit />
      </form>
    </div>
  );
};

export default EditTodoForm;
