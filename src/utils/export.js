export const downloadFile = (content, filename, type = "text/plain") => {
  const element = document.createElement("a");
  element.setAttribute(
    "href",
    `data:${type};charset=utf-8,${encodeURIComponent(content)}`
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
};

export const downloadCSV = (data, filename = "export.csv") => {
  const headers = Object.keys(data[0]);
  const csv = [
    headers.join(","),
    ...data.map((row) => headers.map((field) => `"${row[field]}"`).join(",")),
  ].join("\n");
  downloadFile(csv, filename, "text/csv");
};

export const downloadJSON = (data, filename = "export.json") => {
  const json = JSON.stringify(data, null, 2);
  downloadFile(json, filename, "application/json");
};

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    console.error("Failed to copy:", err);
    return false;
  }
};

export const generatePDF = (content, filename = "document.pdf") => {
  // This would require a PDF library like jsPDF
  console.log("PDF generation requires jsPDF library");
};
