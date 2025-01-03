import { Route, Routes } from "react-router-dom";
import SignUpPage from "./components/pages/SignUpPage";
import TodoListPage from "./components/pages/TodoListPage";
import LoginPage from "./components/pages/LoginPage";
import ResetPasswordPage from "./components/pages/ResetPasswordPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/*" element={<SignUpPage />}></Route>
        <Route path="/signup" element={<SignUpPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/tasks" element={<TodoListPage />}></Route>
        <Route path="/resetPassword" element={<ResetPasswordPage />}></Route>
      </Routes>
    </>
  );
};

export default App;
