import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";
const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

const FilesContext = createContext();

export const FilesProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [pages, setPages] = useState(0);
  const [quantityFiles, setQuantityFiles] = useState(0);
  const [index, setIndex] = useState(1);
  const mimeAccept = [
    "image/bmp",
    "text/csv",
    "application/vnd.oasis.opendocument.text",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "image/gif",
    "text/htm",
    "text/html",
    "image/jpg",
    "image/jpeg",
    "application/pdf",
    "image/png",
    "application/vnd.ms-powerpoint",
    "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    "image/tiff",
    "text/plain",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    "video/mp4",
    "image/webp"
  ];

  useEffect(() => {
    fetchGetQuantityFiles();
  }, []);

  const fetchGetQuantityFiles = async () => {
    setLoading(true);

    const getFilesParams = JSON.stringify({
      option: "getQuantityFilesByUser"
    });

    try {
      const response = await fetch("api/files/" + getFilesParams, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status == 401) location.href = urlFront + "login";
        else throw new Error(result.messageError);
      }

      if (result.quantityFiles > 0) {
        setQuantityFiles(result.quantityFiles);
        setPages(Math.ceil(result.quantityFiles / 10));
      }
      return result.quantityFiles;
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchGetFiles = async (index) => {
    setLoading(true);

    const getFilesParams = JSON.stringify({
      option: "getFilesLimitByUser",
      offset: (index - 1) * 10
    });

    try {
      const response = await fetch("api/files/" + getFilesParams, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const result = await response.json();

      if (!response.ok) {
        if (response.status == 401) location.href = urlFront + "login";
        else throw new Error(result.messageError);
      }

      setFiles(result);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (event, file) => {
    let button = event.target;
    let a = button.parentElement.parentElement;

    let blob = base64ToBlob(file.fileTask, file.typeFile);
    a.href = URL.createObjectURL(blob);
    a.download = file.nameFile;
    a.click();
    URL.revokeObjectURL(blob);
  };

  const generateLink = (file) => {
  
    let blob = base64ToBlob(file.fileTask, file.typeFile);
    let dataParams = JSON.stringify({
      url: URL.createObjectURL(blob),
      nameFile: file.nameFile
    });

    return "/fileViewer?fileData=" + dataParams;
  };

  function base64ToBlob(base64, contentType) {
    const byteCharacters = atob(base64);
    const byteArrays = [];

    for (let i = 0; i < byteCharacters.length; i++) {
      byteArrays.push(byteCharacters.charCodeAt(i));
    }

    const byteArray = new Uint8Array(byteArrays);
    return new Blob([byteArray], { type: contentType });
  }

  return (
    <FilesContext.Provider
      value={{
        loading,
        files,
        pages,
        index,
        setIndex,
        quantityFiles,
        fetchGetFiles,
        handleDownload,
        generateLink,
        mimeAccept,
      }}
    >
      {children}
    </FilesContext.Provider>
  );
};

export const useFiles = () => useContext(FilesContext);
