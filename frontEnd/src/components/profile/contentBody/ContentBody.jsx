import styles from "./ContentBody.module.css";
import iconUserInfo from "../../../assets/img/userInfo.png";
import iconEmail from "../../../assets/img/emailProfile.png";
import gifLoadingForm from "../../../assets/img/loadingForm.gif";
import { useWindowSize } from "../../../context/WindowSizeContext.jsx";
import iconEdit from "../../../assets/img/edit.png";
import { AlertInput } from "./alertInput/AlertInput";
import { useDataUser } from "../../../context/userDataContext";
import { AlertFormSwal } from "../../sweetAlert/sweetAlert.js";
import { GlassEffect } from "../../glassEffect/GlassEffect.jsx";

const ContentBody = ({ setModalEditEmail, setModalEditPassword }) => {
  const { windowWidth } = useWindowSize();
  const {
    user,
    setUser,
    handleChange,
    values,
    errors,
    btnDisabled,
    updateUser,
    loaderForm
  } = useDataUser();

  const verfiyErrors = () => {
    let valid = true;
    let arrayValuesErrors = Object.values(errors);

    for (let f = 0; f < arrayValuesErrors.length; f++) {
      if (arrayValuesErrors[f].length > 0) {
        return false;
      }
    }

    return valid;
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    if (verfiyErrors()) {
      let userUpdated = await updateUser();
      if (userUpdated) {
        AlertFormSwal(
          "User updated succesfully!",
          "Success",
          "success",
          windowWidth
        );

        setUser(userUpdated);
      }
    }
  };

  return (
    <>
      <div className={styles.detailsUser}>
        <div className={styles.avatar}>
          <img src={iconUserInfo}></img>
          <span>
            {user.name} {user.lastname}
          </span>
        </div>
        <div className={styles.email}>
          <img src={iconEmail}></img>
          <span>{user.email}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className={styles.rowForm}>
          <div className={styles.columnInput}>
            <label>Nombre</label>
            <input
              onChange={(event) => handleChange(event)}
              defaultValue={values.name}
              placeholder="Enter name"
              type="text"
              name="name"
            ></input>
            {errors.name.length > 0 && (
              <AlertInput msj={errors.name}></AlertInput>
            )}
          </div>
          <div className={styles.columnInput}>
            <label>Apellido</label>
            <input
              onChange={(event) => handleChange(event)}
              defaultValue={values.lastname}
              placeholder="Enter lastname"
              type="text"
              name="lastname"
            ></input>
            {errors.lastname.length > 0 && (
              <AlertInput msj={errors.lastname}></AlertInput>
            )}
          </div>
        </div>
        <div className={styles.rowForm}>
          <div className={styles.columnInput}>
            <label>Email</label>
            <input
              value={user.email}
              type="text"
              className={styles.inputEmail}
              readOnly
            ></input>
            <button
              onClick={() => setModalEditEmail(true)}
              type="button"
              className={styles.editInput}
            >
              <img src={iconEdit}></img>
            </button>
          </div>
          <div className={styles.columnInput}>
            <label>Password</label>
            <input
              value={"**************************"}
              readOnly
              type="password"
            ></input>
            <button
              type="button"
              onClick={() => setModalEditPassword(true)}
              className={styles.editInput}
            >
              <img src={iconEdit}></img>
            </button>
          </div>
        </div>

        <button
          className={btnDisabled ? styles.btnDisabled : styles.btnEnabled}
          disabled={btnDisabled}
          type="submit"
        >
          Save
          {loaderForm && <img src={gifLoadingForm}></img>}
          <GlassEffect />
        </button>
      </form>
    </>
  );
};

export default ContentBody;
