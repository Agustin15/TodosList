import { VerificationTwoStep } from "../verificationTwoStep/VerificationTwoStep";
import { VerificationTwoStepProvider } from "../../context/verificationTwoStep/VerificationTwoStepContext";

export const VerificationTwoStepPage = () => {
  return (
    <VerificationTwoStepProvider>
      <VerificationTwoStep />
    </VerificationTwoStepProvider>
  );
};
