import styles from "./EditTodoForm.module.css";
import ContentFormEdit from "./contentFormEdit/ContentFormEdit";
import editIcon from "../../assets/img/editIcon.png";
import iconError from "../../assets/img/errorIcon.png";
import iconCorrect from "../../assets/img/correctIcon.png";
import { useForm } from "../../context/FormTaskContext";
import { useTasks } from "../../context/TaskContext";
import { useState } from "react";

const EditTodoForm = ({ task, setOpenModalUpdate }) => {
  const [values, setValues] = useState({ ...task });
  const {
    validationInput,
    setResultForm,
    cleanForm,
    filesSizeExceeded,
    filesUploadedUpdateForm,
    setFilesUploadedUpdateForm
  } = useForm();
  const { updateTask } = useTasks();

  const handleChange = (event) => {
    let name, value;
    name = event.target.name;

    if (name == "filesUploaded") {
      setFilesUploadedUpdateForm(
        [filesUploadedUpdateForm, ...event.target.files].flat()
      );
    } else {
      value = event.target.value;
    }

    setValues({
      ...values,
      [name]: value
    });

    validationInput(
      name,
      name != "filesUploaded"
        ? value
        : [filesUploadedUpdateForm, ...event.target.files].flat()
    );
  };

  const handleSubmit = async (event) => {
    let msj, result, icon;

    event.preventDefault();

    let validIcon = /\w/;
    try {
      if (
        (filesSizeExceeded,
        values.datetimeTask.length == 0 ||
          values.descriptionTask.length == 0 ||
          values.icon.length == 0 ||
          values.icon.match(validIcon))
      ) {
        throw "Complete correctly the fields please";
      } else {
        let taskUpdated = await updateTask(values, filesUploadedUpdateForm);
        if (taskUpdated) {
          msj = "Task updated succesfully!";
          result = "correct";
          icon = iconCorrect;
        } else {
          throw "Oops,failed to update task";
        }
      }
    } catch (error) {
      icon = iconError;
      msj = error;
      result = "error";
    } finally {
      setResultForm({
        result: result,
        msj: msj,
        icon: icon
      });
    }
  };

  const handleClose = () => {
    cleanForm();
    setFilesUploadedUpdateForm([]);
    setOpenModalUpdate(false);
  };

  return (
    <div className={styles.containForm}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h3>Complete task details</h3>
          <img src={editIcon}></img>
        </div>

        <div className={styles.btnClose}>
          <button onClick={handleClose}>X</button>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <ContentFormEdit values={values} handleChange={handleChange} />
      </form>
    </div>
  );
};

export default EditTodoForm;
