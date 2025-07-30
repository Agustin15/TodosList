import { useContext, useRef } from "react";
import { createContext } from "react";
import {
  AlertConfirmPasswordToVerification,
  AlertFormSwal
} from "../components/sweetAlert/sweetAlert.js";
import { useWindowSize } from "./WindowSizeContext.jsx";
import { useState } from "react";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;
const VerificationTwoStepContext = createContext();

export const VerificationTwoStepProvider = ({ children }) => {
  const { windowWidth } = useWindowSize();
  const [showVerificationTwoStep, setShowVerificationTwoStep] = useState(false);
  const [idUser, setIdUser] = useState();
  const refInput = useRef();

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
      windowWidth,
      verificationTwoStep
    );
  };

  const fetchSendVerificationCode = async () => {

    let data;
    try {
      const response = await fetch("/api/verificationCode/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ idUser: idUser })
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
    } finally {
      return data;
    }
  };

  const verifyCharsValidCode = (code) => {
    for (let f = 0; f < code.length; f++) {
      if (!/^[0-9]$/.test(code[f])) return false;
    }
    return true;
  };
  const handleComprobateVerificationCode = (code) => {
    if (code.length != 6 || !verifyCharsValidCode(code))
      AlertFormSwal(
        "Enter a valid verification code",
        "Warning",
        "warning",
        windowWidth
      );
  };

  const handleKeyChar = (event, btnValue) => {
    refInput.current.focus();
    switch (true) {
      case btnValue.value >= 0 && btnValue.value <= 9:
        refInput.current.value += btnValue.value;
        break;
      case btnValue.value == "clean":
        refInput.current.value = "";
        break;
      case btnValue.value == "next":
        if (refInput.current.value.length > 0) {
          positionCursor("forward", refInput.current.selectionStart + 1);
        }
        break;
      case btnValue.value == "back":
        if (refInput.current.value.length > 0) {
          positionCursor("backward", refInput.current.selectionStart - 1);
        }
        break;
      case btnValue.value == "delete":
        if (refInput.current.value.length > 0) {
          const newValue = Array.from(refInput.current.value).filter(
            (number, index) => index != refInput.current.selectionStart - 1
          );

          refInput.current.value = newValue.join("");
          positionCursor("backward", refInput.current.selectionStart - 1);
        }
        break;
    }
  };

  const positionCursor = (direction, position) => {
    if (refInput.current.value.length > 0) {
      refInput.current.setSelectionRange(position, position, direction);
    }
  };

  return (
    <VerificationTwoStepContext.Provider
      value={{
        handleActivateVerification,
        fetchSendVerificationCode,
        showVerificationTwoStep,
        setShowVerificationTwoStep,
        handleComprobateVerificationCode,
        handleKeyChar,
        refInput,
        setIdUser,
        idUser
      }}
    >
      {children}
    </VerificationTwoStepContext.Provider>
  );
};

export const useVerificationTwoStep = () =>
  useContext(VerificationTwoStepContext);
