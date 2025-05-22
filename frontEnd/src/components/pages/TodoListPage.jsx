import TodoList from "../todoList/TodoList";
import { TaskProvider } from "../../context/TaskContext";
import { FormTaskProvider } from "../../context/FormTaskContext";
import { UserDataProvider } from "../../context/userDataContext";
import { FilterOptionTasksProvider } from "../../context/FilterOptionTasksContext";
import Header from "../header/Header";

const TodoListPage = () => {
  return (
    <>
      <TaskProvider>
        <UserDataProvider>
          <Header></Header>
        </UserDataProvider>
        <FormTaskProvider>
          <FilterOptionTasksProvider>
            <TodoList></TodoList>
          </FilterOptionTasksProvider>
        </FormTaskProvider>
      </TaskProvider>
    </>
  );
};

export default TodoListPage;
