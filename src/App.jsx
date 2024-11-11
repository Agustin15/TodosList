import { Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import HomePage from "./components/pages/HomePage";
import AddTodoFormPage from "./components/pages/AddTodoFormPage";
import TodoListPage from "./components/pages/TodoListPage";
import DetailsTaskPage from "./components/pages/DetailsTaskPage";

const App = () => {
  return (
    <>
      <Header/>
      <Routes>
        <Route path="/*" element={<HomePage/>}></Route>
        <Route path="/home" element={<HomePage/>}></Route>
        <Route path="/addNewTask" element={<AddTodoFormPage/>}></Route>
        <Route path="/tasks" element={<TodoListPage/>}></Route>
        <Route path="/tasks/:id" element={<DetailsTaskPage/>}></Route>
      </Routes>
    </>
  );
};

export default App;
