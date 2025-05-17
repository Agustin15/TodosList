import { Route, Routes } from "react-router-dom";
import SignUpPage from "./components/pages/SignUpPage";
import TodoListPage from "./components/pages/TodoListPage";
import LoginPage from "./components/pages/LoginPage";
import ResetPasswordPage from "./components/pages/ResetPasswordPage";
import NewPasswordPage from "./components/pages/NewPasswordPage";
import ProfilePage from "./components/pages/ProfilePage";
import { CalendarPage } from "./components/pages/CalendarPage";
import { DashboardPage } from "./components/pages/DashboardPage";
import { FileViewerPage } from "./components/pages/FileViewerPage";

const App = () => {
  return (
    <>
      <Routes>
        <Route path="/*" element={<LoginPage />}></Route>
        <Route path="/signup" element={<SignUpPage />}></Route>
        <Route path="/login" element={<LoginPage />}></Route>
        <Route path="/dashboard" element={<DashboardPage />}></Route>
        <Route path="/tasks" element={<TodoListPage />}></Route>
        <Route path="/tasks/:idTask" element={<TodoListPage />}></Route>
        <Route path="/calendar" element={<CalendarPage />}></Route>
        <Route path="/fileViewer" element={<FileViewerPage />}></Route>
        <Route path="/resetPassword" element={<ResetPasswordPage />}></Route>
        <Route path="/newPassword" element={<NewPasswordPage />}></Route>
        <Route path="/profile" element={<ProfilePage />}></Route>
      </Routes>
    </>
  );
};

export default App;
