import { Files } from "../files/Files";
import { FilesProvider } from "../../context/FilesContext";
import { TaskProvider } from "../../context/TaskContext";

export const FilesPage = () => {
  return (
    <TaskProvider>
      <FilesProvider>
        <Files />
      </FilesProvider>
    </TaskProvider>
  );
};
