import { PDFDocument } from "pdf-lib";
import { saveAs, FileSaverOptions } from "file-saver";
import JSZip from "jszip";
/**
 * @description 保存pdf文件到本地
 * @param {PDFDocument} pdfDoc
 * @param {string} [filename="download"]
 * @param {FileSaverOptions} options
 */
export async function download(pdfDoc, filename = "download", options) {
  // 将合并后的文件转为url
  const mergedPdfUint8Array = await pdfDoc.save();
  // 转换为Blob
  const mergedPdfBlob = new Blob([mergedPdfUint8Array], {
    type: "application/pdf",
  });
  // 保存到本地
  saveAs(mergedPdfBlob, filename, options);
}

export class DownloadZip {
  constructor() {
    this.zip = new JSZip();
    this.folders = {};
  }

  // 创建文件夹
  mkdir(foldername) {
    if (typeof foldername !== "string") return;
    if (!this.folders.hasOwnProperty(foldername)) {
      this.folders[foldername] = this.zip.folder(foldername);
    }
  }

  // 创建文件
  async touch(pdfDoc, filename, foldername) {
    // 将合并后的文件转为url
    const mergedPdfUint8Array = await pdfDoc.save();
    // 转换为Blob
    const mergedPdfBlob = new Blob([mergedPdfUint8Array], {
      type: "application/pdf",
    });

    if (foldername) {
      this.folders.hasOwnProperty(foldername) &&
        this.folders[foldername].file(filename, mergedPdfBlob);
    }
  }

  // 保存
  saveAs(zipname) {
    this.zip.generateAsync({ type: "blob" }).then(function (content) {
      saveAs(content, `${zipname}.zip`);
    });
  }
}
