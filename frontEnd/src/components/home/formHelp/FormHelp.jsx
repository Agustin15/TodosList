import styles from "./FormHelp.module.css";
import gifLoadingForm from "../../../assets/img/loadingForm.gif";
import { useFormHelp } from "../../../context/FormHelpContext";
import { UploadFiles } from "./uploadFiles/UploadFiles";

export const FormHelp = ({ openFormHelp, setOpenFormHelp }) => {
  const { errors, values, closeForm, handleChange, handleSubmit, loadingForm } =
    useFormHelp();

  return (
    <div className={openFormHelp ? styles.modalForm : styles.modalFormHidden}>
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
                value={values.name}
                onChange={(event) => handleChange(event)}
                placeholder="Enter name"
                type="text"
                className={errors.name ? styles.errorInput : ""}
              ></input>

              <div className={styles.inputError}>
                <p>{errors.name}</p>
              </div>
            </div>

            <div className={styles.columnInput}>
              <label>Email:</label>
              <input
                value={values.email}
                onChange={(event) => handleChange(event)}
                name="email"
                autoComplete="off"
                placeholder="Enter email"
                type="email"
                className={errors.email ? styles.errorInput : ""}
              ></input>

              <div className={styles.inputError}>
                <p>{errors.email}</p>
              </div>
            </div>

            <div className={styles.columnInput}>
              <label>Query:</label>
              <textarea
                value={values.description}
                onChange={(event) => handleChange(event)}
                name="description"
                placeholder="Describe your problem please"
                className={errors.description ? styles.errorInput : ""}
              ></textarea>

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
    </div>
  );
};
