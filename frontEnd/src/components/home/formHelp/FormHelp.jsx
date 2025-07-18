import styles from "./FormHelp.module.css";

export const FormHelp = () => {
  return (
    <div className={styles.containFormHelp}>
      <div className={styles.header}>
        <div className={styles.title}>
          <h3>How we can help you?</h3>
        </div>
        <div className={styles.close}>
          <button>X</button>
        </div>
      </div>

      <form>
        <div className={styles.columnInput}>
          <label>Name:</label>
          <input placeholder="Enter name" type="text"></input>
        </div>

        <div className={styles.columnInput}>
          <label>Email:</label>
          <input placeholder="Enter email" type="email"></input>
        </div>

        <div className={styles.columnInput}>
          <label>Query:</label>
          <textarea placeholder="Describe his problem"></textarea>
        </div>
      </form>
    </div>
  );
};
