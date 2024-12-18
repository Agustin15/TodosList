import { Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import TodoListPage from "./components/pages/TodoListPage";

const App = () => {
  return (
    <>
      <Header/>
      <Routes>
        <Route path="/*" element={<TodoListPage/>}></Route>
        <Route path="/tasks" element={<TodoListPage/>}></Route>
      </Routes>
    </>
  );
};

export default App;
