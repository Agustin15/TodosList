import AddTodoForm from "../addTodoForm/AddTodoForm";
import { FormProvider } from "../../context/FormContext";
import { TaskProvider } from "../../context/TaskContext";

const AddTodoFormPage = () => {
  return (
    <FormProvider>
      <TaskProvider>
        <AddTodoForm />
      </TaskProvider>
    </FormProvider>
  );
};
export default AddTodoFormPage;
