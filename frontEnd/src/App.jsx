import { Route, Routes } from "react-router-dom";
import SignUpPage from "./components/pages/SignUpPage";
import TodoListPage from "./components/pages/TodoListPage";
import LoginPage from "./components/pages/LoginPage";
import ResetPasswordPage from "./components/pages/ResetPasswordPage";
import NewPasswordPage from "./components/pages/newPasswordPage";
import ProfilePage from "./components/pages/ProfilePage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/*" element={<SignUpPage />}></Route>
        <Route path="/signup" element={<SignUpPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/tasks" element={<TodoListPage />}></Route>
        <Route path="/resetPassword" element={<ResetPasswordPage />}></Route>
        <Route path="/newPassword" element={<NewPasswordPage />}></Route>
        <Route path="/profile" element={<ProfilePage />}></Route>
      </Routes>
    </>
  );
};

export default App;
