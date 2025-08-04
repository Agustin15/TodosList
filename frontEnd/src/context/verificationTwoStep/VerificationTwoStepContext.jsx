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
  const [loading, setLoading] = useState(false);
  const [decodeToken, setDecodeToken] = useState();
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

  const fetchSendVerificationCode = async (decodeToken) => {
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
          body: JSON.stringify({
            idUser: decodeToken.idUser,
            option: "sendAgain"
          })
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw result.messageError;
      }

      if (result) data = result;
    } catch (error) {
      AlertFormSwal(error, "Oops", "error", windowWidth);
      console.log(error);
    } finally {
      return data;
    }
  };

  const fetchVerifyVerificationCode = async (codeEntered, token) => {
    let data;
    setLoading(true);
    try {
      const response = await fetch(
        "/api/verificationCode/" +
          JSON.stringify({ option: "comprobateVerificationCode" }),
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${JSON.stringify(token)}`
          },
          body: JSON.stringify({ codeEntered: codeEntered })
        }
      );

      const result = await response.json();

      if (!response.ok) {
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

  const fetchDecodeVerificationToken = async (token) => {
    let data;
    try {
      const response = await fetch("/api/verificationCode/", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${JSON.stringify(token)}`
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
     
      setDecodeToken(data);
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
  const handleComprobateVerificationCode = (code, token) => {
    if (code.length != 6 || !verifyCharsValidCode(code)) {
      AlertFormSwal(
        "Enter a valid verification code",
        "Warning",
        "warning",
        windowWidth
      );
    } else fetchVerifyVerificationCode(code, token);
  };

  const handleKeyChar = (event, btnValue) => {
    refInput.current.focus();
    configKeyboard(refInput, btnValue);
  };

  return (
    <VerificationTwoStepContext.Provider
      value={{
        loading,
        decodeToken,
        handleActivateVerification,
        fetchSendVerificationCode,
        fetchGetVerificationTwoStepUser,
        fetchDecodeVerificationToken,
        handleComprobateVerificationCode,
        handleKeyChar,
        refInput
      }}
    >
      {children}
    </VerificationTwoStepContext.Provider>
  );
};

export const useVerificationTwoStep = () =>
  useContext(VerificationTwoStepContext);
