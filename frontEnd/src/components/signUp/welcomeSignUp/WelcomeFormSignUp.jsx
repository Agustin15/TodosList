import classesStyle from "./WelcomeFormSignUp.module.css";
import logo from "../../../assets/img/logo.png";

const WelcomeFormSignUp = ({
  paragraphWelcome,
  paragraphAccount,
  optionLink,
  link,
}) => {
  return (
    <div className={classesStyle.containWelcome}>
      <div className={classesStyle.welcome}>
        <img src={logo}></img>
        <h3>Welcome to TODO LIST</h3>
        <p>{paragraphWelcome}</p>
      </div>
      <div className={classesStyle.linkLogin}>
        <p>{paragraphAccount}</p>
        <a href={link}>{optionLink}</a>
      </div>
    </div>
  );
};

export default WelcomeFormSignUp;
