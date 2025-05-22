import classesStyle from "./AddTodoForm.module.css";
import ContentForm from "./contentForm/ContentForm";
import iconCorrect from "../../assets/img/correctIcon.png";
import iconError from "../../assets/img/errorIcon.png";
import iconAdd from "../../assets/img/addTask.png";
import { useForm } from "../../context/FormTaskContext";
import { useTasks } from "../../context/TaskContext";
import { useCalendarEvents } from "../../context/CalendarEventsContext";
import { useFilterOptionTasks } from "../../context/FilterOptionTasksContext";

const AddTodoForm = ({ setOpenModalAdd }) => {
  const {
    values,
    setValues,
    filesSizeExceeded,
    validationInput,
    setResultForm,
    cleanForm,
    cleanValues
  } = useForm();
  const { setEventAdded, dateSelected } = useCalendarEvents();
  const { addTask, dispatch } = useTasks();
  const {
    getQuantityTasksFilter,
    getTasksFilter,
    indexSelected,
    getTasksThisWeekUserLimit,
    getTasksThisWeekUser,
    refCheckBoxThisWeek
  } = useFilterOptionTasks();

  const handleChange = (event) => {
    let value, name;
    name = event.target.name;
    value =
      name == "filesUploaded"
        ? Array.from(event.target.files)
        : event.target.value;

    setValues({
      ...values,
      [name]: value
    });

    validationInput(name, value);
  };

  const handleClose = () => {
    if (setEventAdded) setEventAdded(false);
    cleanForm();
    setOpenModalAdd(false);
  };

  const handleSubmit = async (event) => {
    let msj, result, icon;
    event.preventDefault();

    let validIcon = /\w/;

    try {
      if (
        filesSizeExceeded ||
        values.descriptionTask.length == 0 ||
        values.icon.length == 0 ||
        values.icon.match(validIcon) ||
        values.datetimeTask.length == 0
      ) {
        throw "Complete correctly the fields please";
      } else {
        let taskAdded = await addTask(values);

        if (taskAdded) {
          msj = "Task added succesfully!";
          result = "correct";
          icon = iconCorrect;
          if (dateSelected) {
            setEventAdded(true);
          } else {
            eventAdded();
          }
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
        icon: icon
      });
    }
  };

  const eventAdded = () => {
    if (refCheckBoxThisWeek.current.checked) {
      getTasksThisWeekUser();
      getTasksThisWeekUserLimit(indexSelected, dispatch);
    } else {
      getQuantityTasksFilter("getQuantityTasksByFilterOption");
      getTasksFilter("getTasksLimitByFilterOption", indexSelected, dispatch);
    }
  };

  return (
    <div className={classesStyle.containForm}>
      <div className={classesStyle.header}>
        <div className={classesStyle.title}>
          <h3>Complete task details</h3>
          <img src={iconAdd}></img>
        </div>

        <div className={classesStyle.btnClose}>
          <button onClick={handleClose}>X</button>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <ContentForm handleChange={handleChange} />
      </form>
    </div>
  );
};

export default AddTodoForm;
