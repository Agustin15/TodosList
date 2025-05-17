import { useEffect } from "react";
import styles from "./Modal.module.css";

const Modal = ({ children }) => {
  useEffect(() => {
    window.scroll(0,0);
  }, []);

  return <div className={styles.modal}>{children}</div>;
};

export default Modal;
