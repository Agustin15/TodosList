import Swal from "sweetalert2";
import styles from "./sweetAlertCustom.module.css";

export const AlertFormSwal = (msj, title, icon, windowWidth) => {
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

export const AlertUnsubscribeSwal = async (windowWidth) => {
  let confirm = await Swal.fire({
    icon: "question",
    title: "Do you want unsubscribe?",
    html: `<p class=${styles.customMsj}>you will not receive notifications in this browser</p>`,
    showCancelButton: true,
    width: windowWidth <= 699 ? 400 : 490,
    confirmButtonText: "Confirm",
    customClass: {
      icon:styles.customIcon,
      title: styles.customTitle,
      confirmButton: styles.customBtnConfirmError,
      cancelButton:styles.customCancel
    }
  }).then((result) => {
    return result.isConfirmed;
  });
  return confirm;
};
