import TodoList from "../todoList/TodoList";
import Header from "../header/Header";
import styles from "../../components/todoList/TodoList.module.css";
import { TaskProvider } from "../../context/TaskContext";
import { FilterOptionTasksProvider } from "../../context/FilterOptionTasksContext";
import { MenuProvider } from "../../context/MenuContext";
import { UserDataProvider } from "../../context/userDataContext";
const TodoListPage = () => {
  return (
    <div className={styles.rowTodoList}>
      <MenuProvider>
        <UserDataProvider>
          <Header></Header>

          <TaskProvider>
            <FilterOptionTasksProvider>
              <TodoList></TodoList>
            </FilterOptionTasksProvider>
          </TaskProvider>

          
        </UserDataProvider>
      </MenuProvider>
    </div>
  );
};

export default TodoListPage;
