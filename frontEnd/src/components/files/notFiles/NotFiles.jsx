import styles from "./NotFiles.module.css";
import iconNotFiles from "../../../assets/img/notFilesUploaded.png";

export const NotFiles = () => {
  return (
    <tr>
      <td colSpan={5} rowSpan={5}>
        <div className={styles.notFiles}>
          <img src={iconNotFiles}></img>
          <h2>Not files</h2>
        </div>
      </td>
    </tr>
  );
};
