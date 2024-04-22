import { mergePDF } from "../core/merge";
import { loadPDF } from "../shared";
import { download } from "../core/download";
import { embedWatermark } from "../core/embedWatermark";

window.onload = () => {
  const tools = document.getElementById("tools");
  const btn = document.createElement("button");

  btn.addEventListener("click", addsy);
  btn.innerText = "添加水印";

  tools.appendChild(btn);
};

async function addsy() {
  let allUrl = [
    "http://127.0.0.1:3000/ggggg.pdf",
    "http://127.0.0.1:3000/pdf90deg.pdf",
    "http://127.0.0.1:3000/pdf180deg.pdf",
  ];

  let allPromise = allUrl.map((url, index) => {
    return fetch(url).then((res) => res.arrayBuffer());
  });

  Promise.all(allPromise).then(async (requests) => {
    const res = [];
    for (let i = 0; i < requests.length; i++) {
      const cur = requests[i];
      res.push(await loadPDF(cur));
    }

    const result = await mergePDF(res);

    // result.addJavaScript(
    //   "main",
    //   'console.show(); console.println("Hello World!");'
    // );

    const handledResult = await embedWatermark(result, "anthony");

    const mergedPdfUint8Array = await handledResult.save();
    // 转换为Blob
    const mergedPdfBlob = new Blob([mergedPdfUint8Array], {
      type: "application/pdf",
    });

    const url = URL.createObjectURL(mergedPdfBlob);

    document.getElementById("my-iframe").src =
      "./src/public/web/viewer.html?file=" + url;
  });
}
