import Swal from "sweetalert2";
import styles from "./sweetAlertCustom.module.css";

export const AlertSwal = (msj, title, icon,windowWidth) => {

  Swal.fire({
    title: title,
    html: `
    <p class=${styles.customMsj}>${msj}</p>
  `,
    icon: icon,
    width: windowWidth <= 699 ? 300 : 415,
    confirmButtonText: "OK",
    draggable: false,
    customClass: {
      title: styles.customTitle,
      icon: styles.customIcon,
      confirmButton:
        icon == "error"
          ? styles.customBtnConfirmError
          : icon == "warning"
          ? styles.customBtnConfirmWarning
          : styles.customBtnConfirmSuccess
    }
  });
};
