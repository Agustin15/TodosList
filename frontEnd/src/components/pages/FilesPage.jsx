import { Files } from "../files/Files";
import { FilesProvider } from "../../context/FilesContext";

export const FilesPage = () => {
  return (
    <FilesProvider>
      <Files />
    </FilesProvider>
  );
};
