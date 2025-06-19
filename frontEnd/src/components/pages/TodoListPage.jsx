import TodoList from "../todoList/TodoList";
import Header from "../header/Header";
import styles from "../../components/todoList/TodoList.module.css";
import { TaskProvider } from "../../context/TaskContext";
import { FormTaskProvider } from "../../context/formTaskContext/FormTaskContext";
import { UserDataProvider } from "../../context/userDataContext";
import { FilterOptionTasksProvider } from "../../context/FilterOptionTasksContext";
import { MenuProvider } from "../../context/MenuContext";
import { SubscriptionProvider } from "../../context/SubscriptionContext";
const TodoListPage = () => {
  return (
    <div className={styles.rowTodoList}>
      <MenuProvider>
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
      </MenuProvider>
    </div>
  );
};

export default TodoListPage;
