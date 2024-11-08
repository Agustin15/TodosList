import { useRef, useState } from "react";
import classesStyle from "./AddTodoForm.module.css";
import ContentForm from "./contentForm/ContentForm";

const AddTodoForm = () => {

  const [values, setValues] = useState({
    name: "",
    creator: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    creator: "",
    description: "",
  });

  const [resultForm, setResultForm] = useState();

  const validationInput = (nameInput, value) => {
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
    }

    setErrors({
      ...errors,
      [nameInput]: value.length != 0 ? "" : msj,
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

  const handleSubmit = (event) => {
    event.preventDefault();

    if (
      values.name.length == 0 ||
      values.creator.length == 0 ||
      values.description.length == 0
    ) {
      setResultForm({
        result: "error",
        msj: "Complete los campos correctamente",
      });
      return;
    }
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
        />
      </form>
    </div>
  );
};

export default AddTodoForm;
