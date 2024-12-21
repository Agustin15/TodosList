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
  const { validationInput, setResultForm } = useForm();
  const { setErrors } = useForm();
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
    let msj, result, icon;

    event.preventDefault();

    let validIcon = /\w/;
    try {
      if (
        values.name.length == 0 ||
        values.description.length == 0 ||
        values.icon.length == 0 ||
        values.icon.match(validIcon)
      ) {
        throw "Complete correctly the fields please";
      } else {
        let taskUpdated = await updateTask(values);
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
        icon: icon,
      });
    }
  };

  const cleanValues = () => {
    setValues({ ...values, icon: "", name: "", creator: "", description: "" });
  };

  return (
    <div className={styles.containForm}>
      <div className={styles.closeBtn}>
        <button
          onClick={() => {
            setErrors({
              icon: "",
              name: "",
              creator: "",
              description: "",
            }),
              setResultForm(null),
              setOpenModalUpdate(false);
          }}
        >
          X
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={styles.title}>
          <h3>Update task details</h3>
          <img src={editIcon}></img>
        </div>
        <ContentFormEdit
          cleanValues={cleanValues}
          values={values}
          handleChange={handleChange}
        />
      </form>
    </div>
  );
};

export default EditTodoForm;
