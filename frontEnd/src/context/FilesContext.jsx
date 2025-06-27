import { useState } from "react";
import { useEffect } from "react";
import { useContext } from "react";
import { createContext } from "react";
import iconBmp from "../assets/img/bmp.png";
import iconCsv from "../assets/img/csv.png";
import iconTxt from "../assets/img/txt.png";
import iconWord from "../assets/img/word.png";
import iconXml from "../assets/img/xml.png";
import iconGif from "../assets/img/gif.png";
import iconHtm from "../assets/img/htm.png";
import iconHtml from "../assets/img/html.png";
import iconJpg from "../assets/img/jpg.png";
import iconPng from "../assets/img/png.png";
import iconJpeg from "../assets/img/jpeg.png";
import iconPpt from "../assets/img/ppt.png";
import iconMp4 from "../assets/img/mp4.png";
import iconWebp from "../assets/img/webp.png";
import iconSheet from "../assets/img/sheet.png";
import iconXls from "../assets/img/xls.png";
import iconPdf from "../assets/img/pdf.png";
import iconTiff from "../assets/img/tiff.png";

const urlFront = import.meta.env.VITE_LOCALHOST_FRONT;

const FilesContext = createContext();

export const FilesProvider = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);
  const [pages, setPages] = useState(0);
  const [quantityFiles, setQuantityFiles] = useState(0);
  const [index, setIndex] = useState(1);
  const mimeAccept = [
    { type: "image/bmp", icon: iconBmp },
    { type: "text/csv", icon: iconCsv },
    { type: "application/vnd.oasis.opendocument.text", icon: iconTxt },
    { type: "application/msword", icon: iconWord },
    {
      type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      icon: iconXml
    },
    { type: "image/gif", icon: iconGif },
    { type: "text/htm", icon: iconHtm },
    { type: "text/html", icon: iconHtml },
    { type: "image/jpg", icon: iconJpg },
    { type: "image/jpeg", icon: iconJpeg },
    { type: "application/pdf", icon: iconPdf },
    { type: "image/png", icon: iconPng },
    { type: "application/vnd.ms-powerpoint", icon: iconPpt },
    {
      type: "application/vnd.openxmlformats-officedocument.pr esentationml.presentation",
      icon: iconXml
    },
    { type: "image/tiff", icon: iconTiff },
    { type: "text/plain", icon: iconTxt },
    { type: "application/vnd.ms-excel", icon: iconXls },
    {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      icon: iconSheet
    },
    { type: "video/mp4", icon: iconMp4 },
    { type: "image/webp", icon: iconWebp }
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
  const getMime = (file) => {
    let mimeFound = mimeAccept.find(
      (mime) => mime.type.indexOf(file.typeFile) > -1
    );
    return mimeFound;
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
        getMime
      }}
    >
      {children}
    </FilesContext.Provider>
  );
};

export const useFiles = () => useContext(FilesContext);
