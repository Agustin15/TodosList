import classesStyle from "./DetailsTodo.module.css";
import iconFiles from "../../assets/img/files.png";
import iconOpenDocument from "../../assets/img/openDocument.png";
import iconDownload from "../../assets/img/download.png";
import iconNotFiles from "../../assets/img/notFiles.png";
export const FilesTask = ({ task }) => {
  const handleDownload = (event, file) => {
    let button = event.target;
    let a = button.parentElement.querySelector("a");

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

  return (
    <li className={classesStyle.containFiles}>
      {task.filesUploaded.length > 0 ? (
        <>
          <div className={classesStyle.title}>
            <img src={iconFiles}></img>
            <h3>Files:</h3>
          </div>
          <ul>
            {task.filesUploaded.map((file, index) => (
              <li>
                <div className={classesStyle.rowOneFile}>
                  <span>File {index + 1}-</span>
                  <p>{file.nameFile}</p>
                </div>
                <div className={classesStyle.options}>
                  <button onClick={(event) => handleDownload(event, file)}>
                    <a></a>
                    <img src={iconDownload}></img>
                  </button>

                  {mimeAccept.indexOf(file.typeFile) > -1 && (
                    <button title="View" className={classesStyle.openFile}>
                      <a target="_blank" href={generateLink(file)}>
                        <img
                          className={classesStyle.imgOpenDocument}
                          src={iconOpenDocument}
                        ></img>
                      </a>
                    </button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        </>
      ) : (
        <div className={classesStyle.notFiles}>
          <img src={iconNotFiles}></img>
          <h3>Not files</h3>
        </div>
      )}
    </li>
  );
};
