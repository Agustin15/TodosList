import Swal from "sweetalert2";
import styles from "./sweetAlertCustom.module.css";
import iconVerification from "../../assets/img/verificationTwoStep.png";
import { fetchAddVerificationTwoStep } from "./fetchsToAlertConfirmVerification.js";

export const AlertFormSwal = (msj, title, icon, windowWidth) => {
  Swal.fire({
    title: title,
    html: `
    <p class=${styles.customMsj}>${msj}</p>
  `,
    icon: icon,
    width: windowWidth <= 699 ? 300 : 425,
    confirmButtonText: "OK",
    draggable: false,
    customClass: {
      title: styles.customTitle,
      icon: styles.customIcon,
      confirmButton:
        icon == "error"
          ? styles.customBtnConfirmRed
          : icon == "warning"
          ? styles.customBtnConfirmWarning
          : styles.customBtnConfirmGreen
    }
  });
};

export const AlertQuestionSwal = async (
  windowWidth,
  question,
  option,
  colorConfirm
) => {
  let confirm = await Swal.fire({
    icon: "question",
    title: question,
    html:
      option == "unsubscribe"
        ? `<p class=${styles.customMsj}>you will not receive notifications in this browser</p>`
        : "",
    showCancelButton: true,
    width: windowWidth <= 699 ? 400 : 490,
    confirmButtonText: "Confirm",
    customClass: {
      icon: styles.customIcon,
      title: styles.customTitle,
      confirmButton:
        colorConfirm == "red"
          ? styles.customBtnConfirmRed
          : styles.customBtnConfirmGreen,
      cancelButton: styles.customCancel
    }
  }).then((result) => {
    return result.isConfirmed;
  });
  return confirm;
};

export const AlertConfirmPasswordToVerification = async (
  nameButton,
  msj,
  colorConfirm,
  windowWidth
) => {
  await Swal.fire({
    title: "Verification two step",
    html: `
    <p class=${styles.customMsj}>${msj}</p>
  `,
    input: "password",
    inputAttributes: {
      autocapitalize: "off"
    },
    imageUrl: iconVerification,
    imageWidth: 75,
    imageHeight: 75,
    showCancelButton: true,
    confirmButtonText: nameButton,
    preConfirm: async (passwordConfirm) => {
      if (passwordConfirm.length == 0)
        Swal.showValidationMessage("Enter password");
      else {
        const result = await fetchAddVerificationTwoStep(passwordConfirm);
        if (result.state == "error")
          AlertFormSwal(result.error, "Oops", "error", windowWidth);
        else {
          AlertFormSwal(
            "Verification two step activated successfully!",
            "Success",
            "success",
            windowWidth
          );
        }
      }
    },
    customClass: {
      title: styles.customTitle,
      confirmButton:
        colorConfirm == "red"
          ? styles.customBtnConfirmRed
          : styles.customBtnConfirmGreen,
      cancelButton: styles.customCancel
    }
  });
};
