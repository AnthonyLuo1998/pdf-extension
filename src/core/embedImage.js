import { PDFDocument, PDFImage, PDFPage, degrees } from "pdf-lib";
import { getFileFormatByArrayBuffer } from "../shared";
/**
 *
 * @param {PDFDocument} pdfDoc pdf文档实例
 * @param {Number} pageIdx 需要插入图片的页码
 * @param {ArrayBuffer} imageArrayBuffer 图片arrayBuffer
 * @param {{x: number, y: number, scale: number ,rotate: number, baseWindow: boolean}} options 配置
 */
export async function embedImage(pdfDoc, pageIdx, imageArrayBuffer, options) {
  // 根据pdf文档实例创建图片
  const pdfImage = await createImage(pdfDoc, imageArrayBuffer);
  // 获取操作页面
  const pdfPage = pdfDoc.getPage(pageIdx);
  // 获取图片大小
  const { imageHeight, imageWidth } = getImageSize(pdfImage, options.scale);
  // 相对pdf还是相对视口处理坐标
  baseWindowAxisHandler(pdfPage, options);
  // 处理旋转
  pdfPage.drawImage(pdfImage, {
    x: options.x,
    y: options.y,
    rotate: options.rotate,
    width: imageWidth,
    height: imageHeight,
  });
  return pdfDoc;
}

/**
 * @description 基于视口的坐标调整
 * @param {PDFPage} pdfPage
 * @param {{x: number, y: number, scale: number ,rotate: number}} options 配置
 */
export function baseWindowAxisHandler(pdfPage, options) {
  // 基于视口的图片旋转
  const baseWindowRotate = getAngle(pdfPage.getRotation().angle);

  // 获取页面高度/宽度
  const { pageHeight, pageWidth } = getPageSize(pdfPage);

  let baseWindowOffsetX = 0;
  let baseWindowOffsetY = 0;
  switch (baseWindowRotate.angle) {
    case 90:
      // 调整坐标
      baseWindowOffsetX += pageWidth;
      // 调整偏移
      baseWindowOffsetX -= options.y;
      baseWindowOffsetY += options.x;
      break;
    case 180:
      // 调整坐标
      baseWindowOffsetX += pageWidth;
      baseWindowOffsetY += pageHeight;
      // 调整偏移
      baseWindowOffsetX -= options.x;
      baseWindowOffsetY -= options.y;
      break;
    case 270:
      // 调整坐标
      baseWindowOffsetY += pageHeight;
      // 调整偏移
      baseWindowOffsetX += options.y;
      baseWindowOffsetY -= options.x;
      break;
  }

  options.x = baseWindowOffsetX;
  options.y = baseWindowOffsetY;
  options.rotate = baseWindowRotate;
}

/**
 * @description 根据position计算X坐标
 * @param {number} deg
 * @returns
 */
export function getAngle(deg) {
  return degrees(deg % 360);
}

/**
 * @description 获取图片宽高大小
 * @param {PDFImage} pdfImage pdf文档图片实例
 * @param {number} scale 放大缩小倍率
 * @returns {{imageWidth: number,imageHeight: number}}
 */
export function getImageSize(pdfImage, scale) {
  scale = scale ?? 1;
  const image = pdfImage.scale(scale);
  return {
    imageWidth: image.width,
    imageHeight: image.height,
  };
}

/**
 * @description 根据图片类型创建pdf图片
 * @param {PDFDocument} pdfDoc pdf文档实例
 * @param {ArrayBuffer} imageArrayBuffer 图片arrayBuffer
 * @returns
 */
async function createImage(pdfDoc, imageArrayBuffer) {
  let image = null;
  const format = getFileFormatByArrayBuffer(imageArrayBuffer);
  if (format === "PNG") {
    image = await pdfDoc.embedPng(imageArrayBuffer);
  } else if (format === "JPG") {
    image = await pdfDoc.embedJpg(imageArrayBuffer);
  }
  return image;
}

/**
 * @description 获取pdf页面宽高大小
 * @param {PDFPage} pdfPage
 * @returns {{ pageHeight: number, pageWidth: number }}
 */
export function getPageSize(pdfPage) {
  return {
    pageWidth: pdfPage.getWidth(),
    pageHeight: pdfPage.getHeight(),
  };
}
