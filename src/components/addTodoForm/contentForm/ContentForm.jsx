import classesStyle from "./ContentForm.module.css";
import AlertErrorInput from "../alertErrorInput/AlertErrorInput";
import AlertForm from "../alertForm/AlertForm";

const ContentForm = ({ values, handleChange, errors, resultForm,cleanValues }) => {
  return (
    <div className={classesStyle.bodyForm}>
      <div className={classesStyle.icon}>
        <label>Icono de la tarea:</label>
        <input
          value={values.icon}
          onChange={handleChange}
          placeholder="Ingresa Icono"
          type="text"
          name="icon"
        ></input>
        <AlertErrorInput error={errors.icon} />
      </div>

      <div className={classesStyle.rowForm}>
        <div className={classesStyle.name}>
          <label>Nombre de la tarea:</label>
          <input
            value={values.name}
            onChange={handleChange}
            placeholder="Ingresa nombre de la tarea"
            type="text"
            name="name"
          ></input>
          <AlertErrorInput error={errors.name} />
        </div>
        <div className={classesStyle.creator}>
          <label>Autor de la tarea:</label>
          <input
            value={values.creator}
            onChange={handleChange}
            placeholder="Ingresa autor de la tarea"
            type="text"
            name="creator"
          ></input>
          <AlertErrorInput error={errors.creator} />
        </div>
      </div>

      <div className={classesStyle.description}>
        <label>Descripcion:</label>
        <textarea
          value={values.description}
          onChange={handleChange}
          placeholder="Descripcion..."
          name="description"
        ></textarea>
        <AlertErrorInput error={errors.description} />
      </div>

      <div className={classesStyle.buttons}>
        <button>Agregar</button>
        <button type="reset" onClick={cleanValues}>Limpiar</button>
      </div>

      <AlertForm resultForm={resultForm} />
    </div>
  );
};

export default ContentForm;
