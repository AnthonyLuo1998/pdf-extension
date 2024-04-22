import {
  PDFDocument,
  StandardFonts,
  RGB,
  Degrees,
  rgb,
  degrees,
} from "pdf-lib";

/**
 * @description 给pdf的每一页添加水印
 * @param {PDFDocument} pdfDoc
 * @param {{size: number, color: RGB, opacity: number, rotate: Degrees}} options
 */
export async function embedWatermark(pdfDoc, text, options = {}) {
  const mergedOptions = {
    text: "",
    size: 30,
    color: rgb(0.95, 0.1, 0.1),
    opacity: 0.2,
    rotate: degrees(-45),
    ...options,
  };

  const helveticaFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const pages = pdfDoc.getPages();
  for (let i = 0; i < pages.length; i++) {
    let page = pages[i];
    let deg = page.getRotation().angle;
    // 处理pdf页旋转
    mergedOptions.rotate.angle += deg;
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        page.drawText(text, {
          x: j * 200,
          y: i * 200 + j * 100,
          font: helveticaFont,
          ...mergedOptions,
        });
      }
    }
  }
  return pdfDoc;
}
