import styles from "./EditTodoForm.module.css";
import ContentFormEdit from "./contentFormEdit/ContentFormEdit";
import editIcon from "../../assets/img/editIcon.png";
import iconError from "../../assets/img/errorIcon.png";
import iconCorrect from "../../assets/img/correctIcon.png";

import { useForm } from "../../context/FormContext";
import { useTasks } from "../../context/TaskContext";
import { useState } from "react";

const EditTodoForm = ({ task, setOpenModalUpdate }) => {

  const [values, setValues] = useState({ ...task });
  const { validationInput, setResultForm, cleanValues } = useForm();
  const { updateTask } = useTasks();

  const handleChange = (event) => {
    const { name, value } = event.target;

    setValues({
      ...values,
      [name]: value,
    });

    validationInput(name, value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let validIcon = /\w/;
    if (
      values.name.length == 0 ||
      values.creator.length == 0 ||
      values.description.length == 0 ||
      values.icon.length == 0 ||
      values.icon.match(validIcon)
    ) {
      setResultForm({
        result: "error",
        msj: "Complete los campos correctamente",
        icon: iconError,
      });
      return;
    }
    
    let resultPost = await updateTask(values);
    if (resultPost) {
    
      setResultForm({
        result: "correct",
        msj: "¡Tarea actualizada exitosamente!",
        icon: iconCorrect,
      });
      cleanValues();

      return;
    }
  };

  return (
    <div className={styles.modal}>
      <div className={styles.containForm}>
        <div className={styles.closeBtn}>
          <button onClick={() => setOpenModalUpdate(false)}>X</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className={styles.title}>
            <h3>Update task details</h3>
            <img src={editIcon}></img>
          </div>
          <ContentFormEdit values={values} handleChange={handleChange} />
        </form>
      </div>
    </div>
  );
};

export default EditTodoForm;
