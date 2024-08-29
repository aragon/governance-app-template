export function downloadAsFile(filename: string, body: string, mimeType = "text/plain") {
  const dataBlob = new Blob([body], { type: mimeType + ";charset=utf-8" });
  const blobUrl = URL.createObjectURL(dataBlob);

  const anchor = document.createElement("a");
  anchor.href = blobUrl;
  anchor.download = filename;

  anchor.click();
  URL.revokeObjectURL(blobUrl);
}
