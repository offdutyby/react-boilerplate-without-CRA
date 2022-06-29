require("dotenv").config("development"); // 프로젝트에서 사용하는 환경변수를 별토의 파일로 관리 할 수 있는 도구, production / development 모드가 있다.
const path = require("path");
const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

const isProd = process.env.NODE_ENV === "production"; // Production 환경인지 Develop 환경인지 구분, package.json에서 webpack을 실행하는 scripts 명령문에서 mode를 지정할 수 있다.
const PORT = process.env.PORT || 3000; // 포터 설정

module.exports = {
  mode: isProd ? "production" : "development",
  devtool: isProd ? "hidden-source-map" : "source-map", // development 환경에서만 source-map을 만든다.
  entry: "./src/index.tsx",
  output: {
    filename: "[name].js", // [name]은 청크의 이름을 사용한다. Chunk는 번들링 시 모든 코드를 하나의 거대한 파일(Bundle)로 만들지 않기 위해 여러개로 나누는데 그 단위를 말한다.
    path: path.join(__dirname, "/dist"), // 경로를 합쳐서 문자열 형태의 path를 반환한다.
  },
  resolve: {
    modules: ["node_modules"], // 웹팩이 알아서 경로, 확장자 처리를 할 수 있게 도와주는 옵션, modules에 node_modules를 지정해줘야 외부 라이브러리를 바로 가져올 수 있다.
    extensions: [".js", ".jsx", ".ts", ".tsx"], // extentions에 넣은 확장자를 웹팩이 알아서 처리한다. 따라서 import시 파일명 뒤에 확장자를 붙일 필요가 없다.
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: "ts-loader", // ts-loader는 기본적으로 TS->JS로 트랜스파일링 하는 작업과 type check 작업을 구분 하고 같은 스레드에서 동시에 실행한다.
        options: {
          transpileOnly: isProd ? false : true, // 해당 옵션을 true로 지정하면 타입체크를 수행하지 않고 트랜스파일링만 진행한다. 똑한 d.ts 파일도 생성되지 않는다. 이를 통해 속도 향상을 노릴 수 있다.
        },
      },
      {
        test: /\.css?$/,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.(webp|jpg|png|jpeg)$/,
        loader: "file-loader",
        options: {
          name: "[name].[ext]?[hash]",
        },
      },
    ],
  },
  plugins: [
    new ForkTsCheckerWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, "public", "index.html"),
      hash: true,
    }), // 빌드과정이 끝나고 따로 분리하여 bundling한 css,js 파일 등을 html 파일의 link, script 태그에 추가
  ],
  devServer: {
    static: { directory: path.resolve(__dirname, "public") },
    host: "0.0.0.0",
    port: PORT, // 서버의 포트 설정 현재 default : 3000
    open: true, //서버가 켜지면 자동으로 브라우저를 열어라 라는 의미
    hot: true,
    compress: true,
    historyApiFallback: true,
    client: {
      overlay: true,
    },
  },
  stats: "errors-only",
};
