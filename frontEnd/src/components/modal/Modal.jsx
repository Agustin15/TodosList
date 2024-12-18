import styles from "./Modal.module.css";

const Modal = ({ children }) => {
 return <div className={styles.modal}>{children}</div>;
};

export default Modal;
