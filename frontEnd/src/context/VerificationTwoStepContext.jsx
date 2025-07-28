import { useContext } from "react";
import { createContext } from "react";
import {
  AlertConfirmPasswordToVerification,
  AlertFormSwal
} from "../components/sweetAlert/sweetAlert.js";
import { useWindowSize } from "./WindowSizeContext.jsx";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;
const VerificationTwoStepContext = createContext();

export const VerificationTwoStepProvider = ({ children }) => {
  const { windowWidth } = useWindowSize();
  const handleActivateVerification = async () => {
    let verificationTwoStep = await fetchGetVerificationTwoStepUser();
    let msj;
    let nameButton;
    let colorConfirm;

    if (!verificationTwoStep || verificationTwoStep.enabled == 0) {
      msj = "Verification two step disabled,confirm your password to activate";
      nameButton = "Activate";
      colorConfirm = "green";
    } else {
      msj =
        "Verification two step activated,confirm your password to desactivate";
      nameButton = "Desactivate";
      colorConfirm = "red";
    }

    await AlertConfirmPasswordToVerification(
      nameButton,
      msj,
      colorConfirm,
      windowWidth
    );
  };

  const fetchGetVerificationTwoStepUser = async () => {
    let data;
    try {
      const response = await fetch("/api/verificationTwoStep/", {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status == 401) {
          location.href = urlFront + "login";
        }
        throw result.messageError;
      }

      if (result) data = result;
    } catch (error) {
      console.log(error);
      AlertFormSwal(
        "Failed to get verification two step",
        "Oops",
        "error",
        windowWidth
      );
    } finally {
      return data;
    }
  };

  return (
    <VerificationTwoStepContext.Provider value={{ handleActivateVerification }}>
      {children}
    </VerificationTwoStepContext.Provider>
  );
};

export const useVerificationTwoStep = () =>
  useContext(VerificationTwoStepContext);
