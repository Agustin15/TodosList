import classesStyle from "./AddTodoForm.module.css";
import ContentForm from "./contentForm/ContentForm";
import { data } from "@remix-run/router";
import iconCorrect from "../../assets/img/correctIcon.png";
import iconError from "../../assets/img/errorIcon.png";
import iconAdd from "../../assets/img/addTask.png";
import { useForm } from "../../context/FormContext";
import { useTasks } from "../../context/TaskContext";

const AddTodoForm = () => {
  const { values, setValues, validationInput, setResultForm, cleanValues } =
    useForm();

  const { tasks, addTask, getIfExistTask } = useTasks();

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
        values.creator.length == 0 ||
        values.description.length == 0 ||
        values.icon.length == 0 ||
        values.icon.match(validIcon)
      ) {
        throw "Fill correctly the fields please";
      } else {
        const taskExist = await getIfExistTask(
          values.description.trim(),
          values.creator.trim()
        );

        if (taskExist) {
          throw "This task is exist";
        } else {
          let idTask = tasks.length + 1;
          values.id = idTask.toString();
          let errorPost = await addTask(values);
          if (!errorPost) {
            msj = "Task added succesfully!";
            result = "correct";
            icon = iconCorrect;
            cleanValues();
          } else {
            throw "Ups,failed to add task";
          }
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
