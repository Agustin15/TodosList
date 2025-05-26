import TodoList from "../todoList/TodoList";
import Header from "../header/Header";
import styles from "../../components/todoList/TodoList.module.css";
import { TaskProvider } from "../../context/TaskContext";
import { FormTaskProvider } from "../../context/FormTaskContext";
import { UserDataProvider } from "../../context/userDataContext";
import { FilterOptionTasksProvider } from "../../context/FilterOptionTasksContext";

const TodoListPage = () => {
  return (
    <div className={styles.rowTodoList}>
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
    </div>
  );
};

export default TodoListPage;
