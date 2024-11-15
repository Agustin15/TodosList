import classesStyle from "./AddTodoForm.module.css";
import ContentForm from "./contentForm/ContentForm";
import { data } from "@remix-run/router";
import iconCorrect from "../../assets/img/correctIcon.png";
import iconError from "../../assets/img/errorIcon.png";
import iconAdd from "../../assets/img/addTask.png";
import { useForm } from "../../context/FormContext";
import { useTasks } from "../../context/TaskContext";

const AddTodoForm = () => {
  const {
    values,
    setValues,
    validationInput,
    createId,
    setResultForm,
    cleanValues,
  } = useForm();

  const { addTask, getIfExistTask } = useTasks();

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

    const taskExist = await getIfExistTask(
      values.description.trim(),
      values.creator.trim()
    );

    if (taskExist) {
      setResultForm({
        result: "error",
        msj: "Ups,esta tarea ya existe",
        icon: iconError,
      });
      return;
    } else {
      let idTask = await createId();
      values.id = idTask;
      let resultPost = await addTask(values);
      if (resultPost) {
        setResultForm({
          result: "correct",
          msj: "¡Tarea agregada exitosamente!",
          icon: iconCorrect,
        });
        cleanValues();

        return;
      }
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
