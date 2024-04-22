import { PDFDocument } from "pdf-lib";

/**
 * @description 读取pdf文件
 * @param {ArrayBuffer} arrayBuffer
 * @returns
 */
export async function loadPDF(arrayBuffer) {
  const pdf = await PDFDocument.load(arrayBuffer);
  return pdf;
}

/**
 * @description 通过magic number获取真实文件格式
 * @param {ArrayBuffer} arrayBuffer
 * @returns {"PDF" | "JPG" | "PNG" | "OTHER"}
 */
export function getFileFormatByArrayBuffer(arrayBuffer) {
  const hashMap = {
    "25,50,44,46": "PDF",
    "ff,d8,ff,e0": "JPG",
    "89,50,4e,47": "PNG",
  };
  const magicNumber = getMagicNumber(arrayBuffer);
  return hashMap[magicNumber] || "OTHER";
}

/**
 * @description 获取magic number判断图片格式
 * @param {*} arrayBuffer
 * @returns
 */
function getMagicNumber(arrayBuffer) {
  const arrayBufferSlice = arrayBuffer.slice(0, 4);
  const uint8 = new Uint8Array(arrayBufferSlice);
  let magicNumberArr = Array.prototype.map.call(uint8, (n) => {
    return ("00" + n.toString(16)).slice(-2);
  });
  return magicNumberArr.join(",");
}
