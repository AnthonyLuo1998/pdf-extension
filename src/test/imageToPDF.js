import { loadPDF } from "../shared";
import { download, DownloadZip } from "../core/download";

fetch("http://127.0.0.1:3000/pdf90deg.pdf")
  .then((res) => res.arrayBuffer())
  .then(async (res2) => {
    const pdfDoc = await loadPDF(res2);

    const zip = new DownloadZip();

    zip.mkdir("hello");

    await zip.touch(pdfDoc, "good.pdf", "hello");

    zip.saveAs("export");
  });
