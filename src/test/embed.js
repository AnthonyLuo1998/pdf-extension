import { embedImage } from "../embed";
import { loadPDF } from "../load";
import { exportPDF } from "../download";

async function foo() {
  fetch("http://127.0.0.1:3000/pdf270deg.pdf")
    .then((res) => res.arrayBuffer())
    .then(async (res) => {
      const pdf = await loadPDF(res);
      fetch("http://127.0.0.1:3000/good.png")
        .then((res) => res.arrayBuffer())
        .then(async (res) => {
          const pdfDoc = await embedImage(pdf, 0, res, {
            x: 80,
            y: 100,
            rotate: 0,
            scale: 0.1,
          });
          exportPDF(pdfDoc);
        });
    });
}

foo();
