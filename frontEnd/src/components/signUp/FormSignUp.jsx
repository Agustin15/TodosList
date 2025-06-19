import ContentFormSignUp from "./contentForm/ContentFormSignUp";
import classesStyle from "./FormSignUp.module.css";
const FormSignUp = () => {
  return (

      <div className={classesStyle.bodyPage}>
        <div className={classesStyle.containForm}>
          <ContentFormSignUp></ContentFormSignUp>
        </div>
      </div>
  
  );
};

export default FormSignUp;
