import classesStyle from "./AddTodoForm.module.css";
import ContentForm from "./contentForm/ContentForm";
import iconAdd from "../../assets/img/addTask.png";
import { useForm } from "../../context/formTaskContext/FormTaskContext";
import { useTasks } from "../../context/TaskContext";
import { useCalendarEvents } from "../../context/CalendarEventsContext";
import { useFilterOptionTasks } from "../../context/FilterOptionTasksContext";
import { useState } from "react";
import { GlassEffect } from "../glassEffect/GlassEffect.jsx";
import { AlertFormSwal } from "../sweetAlert/sweetAlert.js";
import { ValidationFormError } from "../../ValidationForm.js";
import { useWindowSize } from "../../context/WindowSizeContext.jsx";

const AddTodoForm = ({ setOpenModalAdd }) => {
  const { values, filesSizeExceeded, validationForm, cleanForm, cleanValues } =
    useForm();
  const { setEventAdded, dateSelected } = useCalendarEvents();
  const { addTask } = useTasks();
  const { windowWidth } = useWindowSize();
  const [stateCheckbox, setStateCheckbox] = useState();
  const { queryTasksDependingOptions } = useFilterOptionTasks();

  const handleClose = () => {
    if (setEventAdded) setEventAdded(false);
    cleanForm();
    setOpenModalAdd(false);
  };

  const handleSubmit = async (event) => {
    let msj, title, icon;
    let validation;
    event.preventDefault();

    const formData = new FormData(event.target);

    for (const array of formData.entries()) {
      validation = validationForm(array[0], array[1]);
      if (!validation) break;
    }

    try {
      if (filesSizeExceeded || !validation) {
        throw new ValidationFormError("Complete correctly the fields please");
      } else {
        let taskAdded = await addTask(values);
        if (taskAdded) {
          title = "Succesfully";
          msj = "Task added succesfully!";
          icon = "success";

          if (dateSelected) {
            setEventAdded(true);
          } else {
            eventAdded();
          }
          cleanValues();
        } else {
          throw new Error("Failed to add task");
        }
      }
    } catch (error) {
      icon = error instanceof ValidationFormError ? "warning" : "error";
      title = error instanceof ValidationFormError ? "Warning" : "Oops";
      msj = error;
    } finally {
      AlertFormSwal(msj, title, icon, windowWidth);
    }
  };

  const eventAdded = () => {
    queryTasksDependingOptions();
  };

  return (
    <div className={classesStyle.containForm}>
      <div className={classesStyle.header}>
        <GlassEffect />
        <div className={classesStyle.title}>
          <h3>Complete task details</h3>
          <img src={iconAdd}></img>
        </div>
        <div className={classesStyle.btnClose}>
          <button onClick={handleClose}>X</button>
        </div>
      </div>
      <form onSubmit={handleSubmit}>
        <ContentForm
          stateCheckbox={stateCheckbox}
          setStateCheckbox={setStateCheckbox}
        />
      </form>
    </div>
  );
};

export default AddTodoForm;
