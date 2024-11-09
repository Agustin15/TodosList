import classesStyle from "./AddTodoForm.module.css";
import ContentForm from "./contentForm/ContentForm";
import { data } from "@remix-run/router";
import iconCorrect from "../../assets/img/correctIcon.png";
import iconError from "../../assets/img/errorIcon.png";
import { useState } from "react";

const AddTodoForm = () => {
  const [values, setValues] = useState({
    icon: "",
    name: "",
    creator: "",
    description: "",
    isCompleted: false,
  });
  const [errors, setErrors] = useState({
    icon: "",
    name: "",
    creator: "",
    description: "",
  });

  const [resultForm, setResultForm] = useState();

  const validationInput = (nameInput, value) => {
    let validIcon = /\w/;
    let validInput = value.length !== 0;
    let msj;
    switch (nameInput) {
      case "name":
        msj = "Complete el campo nombre";
        break;
      case "creator":
        msj = "Complete el campo autor";
        break;
      case "description":
        msj = "Complete el campo descripcion";
        break;
      case "icon":
        msj = "Ingresa un icono";
        validInput = !value.match(validIcon) && value.length !== 0;
        break;
    }

    setErrors({
      ...errors,
      [nameInput]: validInput ? "" : msj,
    });
  };

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

    let existTask = await getIfExistTask(
      values.description.trim(),
      values.creator.trim()
    );
    if (existTask) {
      setResultForm({
        result: "error",
        msj: "Esta tarea ya existe",
        icon: iconError,
      });
      return;
    } else {
      let resultPost = await postTask();
      if (resultPost) {
        setResultForm({
          result: "correct",
          msj: "¡Tarea agregada exitosamente!",
          icon: iconCorrect,
        });
        cleanValues();
      }
      return;
    }
  };

  const getIfExistTask = async (description, creator) => {
    let data = null;
    try {
      const response = await fetch(
        "http://localhost:3000/todos?description=" +
          description +
          "&&creator=" +
          creator
      );
      const result = await response.json();
      if (result.length > 0) {
        data = result;
      }
    } catch (error) {
      console.log(error);
    } finally {
      return data;
    }
  };

  const postTask = async () => {
    try {
      let data = null;
      const response = await fetch("http://localhost:3000/todos", {
        method: "POST",
        header: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      if (result) {
        data = result;
      }
      data = result;
    } catch (error) {
      console.log(error);
    } finally {
      return data;
    }
  };

  const cleanValues = () => {
    setValues({ ...values, icon: "", name: "", description: "", creator: "" });
  };

  return (
    <div className={classesStyle.containForm}>
      <form onSubmit={handleSubmit}>
        <h3>Complete los detalles de su tarea</h3>
        <ContentForm
          values={values}
          handleChange={handleChange}
          errors={errors}
          resultForm={resultForm}
          cleanValues={cleanValues}
        />
      </form>
    </div>
  );
};

export default AddTodoForm;
