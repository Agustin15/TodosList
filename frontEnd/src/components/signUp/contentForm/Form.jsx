import classesStyle from "../contentForm/contentForm.module.css";
import hiddenEye from "../../../assets/img/hidden.png";
import gifLoading from "../../../assets/img/loadingForm.gif";
import AlertForm from "../alertForm/AlertForm";
import AlertInputLogin from "../alertInputLogin/AlertInputLogin";
import { useFormUser } from "../../../context/FormUserContext";
import { useLogin } from "../../../context/LoginContext";;
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

export const Form = () => {
  const {
    passwordIcon,
    passwordInput,
    handlePassword,
    handleSubmitSignUp,
    errorsInputsSignUp,
    resultForm
  } = useFormUser();
  const { loading } = useLogin();

  return (
    <form onSubmit={handleSubmitSignUp}>
      <div className={classesStyle.rowFormOne}>
        <div className={classesStyle.containName}>
          <label>Name</label>
          <input
            autoComplete="off"
            type="text"
            name="name"
            placeholder="Enter name"
          ></input>
          {errorsInputsSignUp["name"] && (
            <AlertInputLogin error={errorsInputsSignUp["name"]} />
          )}
        </div>

        <div className={classesStyle.containLastName}>
          <label>Lastname</label>
          <input
            autoComplete="off"
            name="lastname"
            type="text"
            placeholder="Enter lastname"
          ></input>
          {errorsInputsSignUp["lastname"] && (
            <AlertInputLogin error={errorsInputsSignUp["lastname"]} />
          )}
        </div>
      </div>

      <div className={classesStyle.rowFormTwo}>
        <div className={classesStyle.containUsername}>
          <label>Email</label>
          <input
            autoComplete="off"
            name="email"
            type="text"
            placeholder="Enter email"
          ></input>
          {errorsInputsSignUp["email"] && (
            <AlertInputLogin error={errorsInputsSignUp["email"]} />
          )}
        </div>

        <div className={classesStyle.containPassword}>
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            ref={passwordInput}
            autoComplete="off"
          ></input>
          <img
            ref={passwordIcon}
            onClick={handlePassword}
            src={hiddenEye}
          ></img>
          {errorsInputsSignUp["password"] && (
            <AlertInputLogin
              value={"password"}
              error={errorsInputsSignUp["password"]}
            />
          )}
        </div>
      </div>

      <div className={classesStyle.containSignUp}>
        <button type="submit">
          Sign up
          {loading && <img src={gifLoading}></img>}
        </button>
      </div>
      <div className={classesStyle.haveAccountResponsive}>
        <p>
          Do you already have a account? <a href={`${urlFront}login`}>Login</a>
        </p>
      </div>

      {resultForm && <AlertForm />}
    </form>
  );
};
