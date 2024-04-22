// webpack.config.js
const path = require("path");
module.exports = {
  mode: "production",
  entry: "./src/test/mergePDF.js",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
};
