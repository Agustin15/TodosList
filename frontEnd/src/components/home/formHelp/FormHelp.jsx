import styles from "./FormHelp.module.css";
import iconError from "../../../assets/img/warningInput.png";
import gifLoadingForm from "../../../assets/img/loadingForm.gif";
import { useFormHelp } from "../../../context/FormHelpContext";
import { UploadFiles } from "./uploadFiles/UploadFiles";

export const FormHelp = ({ openFormHelp, setOpenFormHelp }) => {
  const { errors, handleChange, closeForm, handleSubmit, loadingForm } =
    useFormHelp();

  return (
    <div
      className={
        openFormHelp ? styles.containFormHelp : styles.containFormHelpHidden
      }
    >
      <div className={styles.header}>
        <div className={styles.title}>
          <h3>How we can help you?</h3>
        </div>
        <div className={styles.close}>
          <button onClick={() => closeForm(setOpenFormHelp)}>X</button>
        </div>
      </div>

      <form onSubmit={(event) => handleSubmit(event)}>
        <div className={styles.columnForm}>
          <div className={styles.columnInput}>
            <label>Name:</label>
            <input
              name="name"
              autoComplete="off"
              onChange={(event) => handleChange(event)}
              placeholder="Enter name"
              type="text"
            ></input>
            {errors.name && <img src={iconError}></img>}
            <div className={styles.inputError}>
              <p>{errors.name}</p>
            </div>
          </div>

          <div className={styles.columnInput}>
            <label>Email:</label>
            <input
              onChange={(event) => handleChange(event)}
              name="email"
              autoComplete="off"
              placeholder="Enter email"
              type="email"
            ></input>
            {errors.email && <img src={iconError}></img>}
            <div className={styles.inputError}>
              <p>{errors.email}</p>
            </div>
          </div>

          <div className={styles.columnInput}>
            <label>Query:</label>
            <textarea
              onChange={(event) => handleChange(event)}
              name="description"
              placeholder="Describe your problem please"
            ></textarea>
            {errors.description && <img src={iconError}></img>}
            <div className={styles.inputErrorQuery}>
              <p>{errors.description}</p>
            </div>
          </div>
          <UploadFiles />
        </div>

        <div className={styles.containSend}>
          <button type="submit">
            Send
            {loadingForm && <img src={gifLoadingForm}></img>}
          </button>
        </div>
      </form>
    </div>
  );
};
