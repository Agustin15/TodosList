import gifLoading from "../../../assets/img/loadingForm.gif";
import classesStyle from "./ContentForm.module.css";
import { UploadFiles } from "./UploadFiles";
import { useForm } from "../../../context/formTaskContext/FormTaskContext";
import { useTasks } from "../../../context/TaskContext";
import { useEffect } from "react";
import { useCalendarEvents } from "../../../context/CalendarEventsContext";
import { ColumnOne } from "./ColumnOne";
import { SubscriptionProvider } from "../../../context/SubscriptionContext";

const ContentForm = ({ stateCheckbox, setStateCheckbox }) => {
  const { setValues, cleanForm, values } = useForm();
  const { loadingState } = useTasks();
  const { dateSelected } = useCalendarEvents();

  useEffect(() => {
    if (dateSelected) {
      setValues({ ...values, ["datetimeTask"]: dateSelected });
    }
  }, []);

  return (
    <div className={classesStyle.contentForm}>
      <div className={classesStyle.bodyForm}>
        <SubscriptionProvider>
          <ColumnOne
            stateCheckbox={stateCheckbox}
            setStateCheckbox={setStateCheckbox}
          />
        </SubscriptionProvider>
        <div className={classesStyle.columnTwo}>
          <UploadFiles />
        </div>
      </div>
      <div className={classesStyle.buttons}>
        <button>
          Add
          {loadingState && <img src={gifLoading}></img>}
        </button>
        <button type="reset" onClick={cleanForm}>
          Clean
        </button>
      </div>
    </div>
  );
};

export default ContentForm;
