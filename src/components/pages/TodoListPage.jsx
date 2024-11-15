import TodoList from "../todoList/TodoList";
import { TaskProvider } from "../../context/TaskContext";
import { FormProvider } from "../../context/FormContext";

const TodoListPage = () => {
  return (
    <TaskProvider>
      <FormProvider>
        <TodoList />
      </FormProvider>
    </TaskProvider>
  );
};

export default TodoListPage;
