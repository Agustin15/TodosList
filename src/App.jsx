import { Route, Routes } from "react-router-dom";
import Header from "./components/header/Header";
import HomePage from "./components/pages/homePage/HomePage";
import AddTodoFormPage from "./components/pages/addTodoFormPage/AddTodoFormPage";


const App = () => {
  return (
    <>
      <Header/>
      <Routes>
        <Route path="/*" element={<HomePage/>}></Route>
        <Route path="/home" element={<HomePage/>}></Route>
        <Route path="/addNewTask" element={<AddTodoFormPage/>}></Route>
      </Routes>
    </>
  );
};

export default App;
