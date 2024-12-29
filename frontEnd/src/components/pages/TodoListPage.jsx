import TodoList from "../todoList/TodoList";
import { TaskProvider } from "../../context/TaskContext";
import { FormProvider } from "../../context/FormContext";
import Header from "../header/Header";
import { TokenProvider } from "../../context/TokenContext";

const TodoListPage = () => {
  return (
    <>
      <TaskProvider>
        <TokenProvider>
          <Header></Header>
        </TokenProvider>
        <FormProvider>
          <TodoList />
        </FormProvider>
      </TaskProvider>
    </>
  );
};

export default TodoListPage;
