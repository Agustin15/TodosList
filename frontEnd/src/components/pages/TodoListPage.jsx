import TodoList from "../todoList/TodoList";
import { TaskProvider } from "../../context/TaskContext";
import { FormProvider } from "../../context/FormContext";
import Header from "../header/Header";

const TodoListPage = () => {
  return (
    <>
        <TaskProvider>
        <Header></Header>
          <FormProvider>
            <TodoList />
          </FormProvider>
        </TaskProvider>
    </>
  );
};

export default TodoListPage;
