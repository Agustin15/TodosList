import { Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import AddTodoFormPage from "./components/pages/AddTodoFormPage";
import TodoListPage from "./components/pages/TodoListPage";
import DetailsTaskPage from "./components/pages/DetailsTaskPage";

const App = () => {
  return (
    <>
      <Header/>
      <Routes>
        <Route path="/*" element={<TodoListPage/>}></Route>
        <Route path="/addNewTask" element={<AddTodoFormPage/>}></Route>
        <Route path="/tasks" element={<TodoListPage/>}></Route>
        <Route path="/tasks/:id" element={<DetailsTaskPage/>}></Route>
        <Route path="/:id" element={<DetailsTaskPage/>}></Route>
      </Routes>
    </>
  );
};

export default App;
