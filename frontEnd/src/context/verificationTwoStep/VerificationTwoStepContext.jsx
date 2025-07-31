import { useContext, useRef } from "react";
import { createContext } from "react";
import {
  AlertConfirmPasswordToVerification,
  AlertFormSwal
} from "../../components/sweetAlert/sweetAlert.js";

import { useWindowSize } from "../WindowSizeContext.jsx";
import { useState } from "react";
import { configKeyboard } from "./configKeyboard.js";

const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;
const VerificationTwoStepContext = createContext();

export const VerificationTwoStepProvider = ({ children }) => {
  const { windowWidth } = useWindowSize();
  const [showVerificationTwoStep, setShowVerificationTwoStep] = useState(false);
  const [idUser, setIdUser] = useState();
  const [loading, setLoading] = useState(false);
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
      const response = await fetch(
        "/api/verificationCode/" +
          JSON.stringify({ option: "sendVerificationCode" }),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ idUser: idUser })
        }
      );

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

  const fetchVerifyVerificationCode = async (codeEntered) => {
    let data;
    setLoading(true);
    try {
      const response = await fetch(
        "/api/verificationCode/" +
          JSON.stringify({ option: "comprobateVerificationCode" }),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ idUser: idUser, codeEntered: codeEntered })
        }
      );

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
      AlertFormSwal(error, "Oops", "error", windowWidth);
    } finally {
      setLoading(false);
      if (data) location.href = urlFront + "dashboard";
    }
  };

  const fetchGetVerificationTwoStepUser = async () => {
    let data;
    try {
      const response = await fetch("/api/verificationTwoStep/", {
        method: "GET",
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
    if (code.length != 6 || !verifyCharsValidCode(code)) {
      AlertFormSwal(
        "Enter a valid verification code",
        "Warning",
        "warning",
        windowWidth
      );
    } else fetchVerifyVerificationCode(code);
  };

  const handleKeyChar = (event, btnValue) => {
    refInput.current.focus();
    configKeyboard(refInput, btnValue);
  };

  return (
    <VerificationTwoStepContext.Provider
      value={{
        loading,
        handleActivateVerification,
        fetchSendVerificationCode,
        fetchGetVerificationTwoStepUser,
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
