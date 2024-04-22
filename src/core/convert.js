import { PDFDocument } from "pdf-lib";
import { getFileFormatByArrayBuffer } from "../shared";
/**
 * @description 图片转换为PDF文档,只支持jpeg、jpg、png格式图片
 * @param {ArrayBuffer} imageArrayBuffer
 * @returns
 */
export async function imageToPDF(imageArrayBuffer) {
  const type = getFileFormatByArrayBuffer(imageArrayBuffer);

  if (type === "OTHER") {
    console.error("只支持png、jpg、jpeg格式图片!");
  }

  // 创建新文档
  const pdfDoc = await PDFDocument.create();
  // 新文档嵌入图片
  let image = null;
  if (type === "PNG") {
    image = await pdfDoc.embedPng(imageArrayBuffer);
  } else if (type === "JPG") {
    image = await pdfDoc.embedJpg(imageArrayBuffer);
  }
  // 添加新页面
  const page = pdfDoc.addPage();
  // 图片倍率处理
  let imageDims = null;
  // 图片范围兼容处理
  if (image.width > page.getWidth() && image.height > page.getHeight()) {
    imageDims = image.scaleToFit(page.getWidth(), page.getHeight());
  } else if (image.width > page.getWidth()) {
    imageDims = image.scaleToFit(page.getWidth(), image.height);
  } else if (image.height > page.getHeight()) {
    imageDims = image.scaleToFit(image.height, page.getHeight());
  } else {
    imageDims = {
      width: image.width,
      height: image.height,
    };
  }

  // 画图片到新文档
  page.drawImage(image, {
    x: page.getWidth() / 2 - imageDims.width / 2,
    y: page.getHeight() / 2 - imageDims.height / 2,
    width: imageDims.width,
    height: imageDims.height,
  });

  return pdfDoc;
}

export async function pdfToImage(imageArrayBuffer) {}
