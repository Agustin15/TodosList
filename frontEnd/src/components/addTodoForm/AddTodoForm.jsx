import classesStyle from "./AddTodoForm.module.css";
import ContentForm from "./contentForm/ContentForm";
import iconCorrect from "../../assets/img/correctIcon.png";
import iconError from "../../assets/img/errorIcon.png";
import iconAdd from "../../assets/img/addTask.png";
import { useForm } from "../../context/FormContext";
import { useTasks } from "../../context/TaskContext";

const AddTodoForm = ({ setOpenModalAdd }) => {
  const { values, setValues, validationInput, setResultForm, cleanValues } =
    useForm();

  const { addTask } = useTasks();

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
        let taskAdded = await addTask(values);
        
        if (taskAdded) {
          msj = "Task added succesfully!";
          result = "correct";
          icon = iconCorrect;
          cleanValues();
        } else {
          throw "Oops,failed to add task";
        }
      }
    } catch (error) {
      msj = error;
      result = "error";
      icon = iconError;
    } finally {
      setResultForm({
        result: result,
        msj: msj,
        icon: icon,
      });
    }
  };

  return (
    <div className={classesStyle.containForm}>
      <div className={classesStyle.header}>
        <button onClick={() => setOpenModalAdd(false)}>X</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div className={classesStyle.title}>
          <h3>Complete task details</h3>
          <img src={iconAdd}></img>
        </div>
        <ContentForm handleChange={handleChange} />
      </form>
    </div>
  );
};

export default AddTodoForm;
