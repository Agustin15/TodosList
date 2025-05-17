import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";


export const FileViewer = () => {
  const params = new URLSearchParams(window.location.search);
  let dataFile = JSON.parse(params.get("fileData"));

  if (!dataFile) {
    location.href = "/tasks";
  }

  const doc = [{ uri: dataFile.url, fileName: dataFile.nameFile }];
  return <DocViewer documents={doc} pluginRenderers={DocViewerRenderers} />;
};
