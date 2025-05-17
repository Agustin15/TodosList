import TodoList from "../todoList/TodoList";
import { TaskProvider } from "../../context/TaskContext";
import { FormTaskProvider } from "../../context/FormTaskContext";
import { UserDataProvider } from "../../context/userDataContext";
import Header from "../header/Header";

const TodoListPage = () => {
  return (
    <>
      <TaskProvider>
        <UserDataProvider>
          <Header></Header>
        </UserDataProvider>
        <FormTaskProvider>
          <TodoList></TodoList>
        </FormTaskProvider>
      </TaskProvider>
    </>
  );
};

export default TodoListPage;
