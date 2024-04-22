import { PDFDocument } from "pdf-lib";

/**
 *
 * @param {Array<PDFDocument>} pdfDocs
 * @returns
 */
export async function mergePDF(PdfDocs) {
  let pdfDoc = await PDFDocument.create();
  // 读取pdf文档，并将每一页插入插入头部
  for (let i = 0; i < PdfDocs.length; i++) {
    // 当前操作pdf
    const currentPDF = PdfDocs[i];

    // 拷贝
    const secondPdfPages = await pdfDoc.copyPages(
      currentPDF,
      currentPDF.getPageIndices()
    );

    // 逐页插入新pdf文件
    for (let j of secondPdfPages) {
      pdfDoc.addPage(j);
    }
  }

  return pdfDoc;
}
