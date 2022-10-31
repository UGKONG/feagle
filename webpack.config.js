const webpack = require("webpack");
const dotenv = require("dotenv");
const HtmlWebpackPlugin = require("html-webpack-plugin");

dotenv.config();

module.exports = {
  // 빌드 모드: development | production
  mode: "development",
  // 파일, 모듈 옵션
  resolve: {
    // 사용할 확장자
    extensions: [".js", ".jsx", ".ts", ".tsx"],
    // 사용할 기능 (webpack5부터는 추가해야함)
    fallback: {
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      url: require.resolve("url"),
      stream: require.resolve("stream-browserify"),
      zlib: require.resolve("browserify-zlib"),
      buffer: require.resolve("buffer/"),
      assert: require.resolve("assert/"),
      path: require.resolve("path-browserify"),
      crypto: require.resolve("crypto-browserify"),
      timers: require.resolve("timers-browserify"),
      fs: false,
    },
  },
  // 기본이 될 파일명
  entry: "./view/index.tsx",
  // 빌드 옵션
  output: {
    // 빌드될 경로
    path: __dirname + "/build",
    // 빌드될 파일명
    filename: "index.js",
  },
  // 모듈 옵션
  module: {
    // 규칙
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        exclude: /node_modules/,
        use: ["ts-loader"],
      },
      {
        test: /\.(js|jsx)$/i,
        exclude: /node_modules/,
        use: ["babel-loader"],
      },
      {
        test: /\.(avi|mp4|wav|webm)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "./videos",
              name: "[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|bmp|svg)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "./images",
              name: "[name].[ext]",
            },
          },
        ],
      },
      {
        test: /\.(c|sa|sc)ss$/i,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.html$/i,
        use: ["html-loader"],
      },
    ],
  },
  // 빌드 중 플러그인 추가 옵션
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
    }),
    new HtmlWebpackPlugin({
      template: "./view/index.html",
      filename: "index.html",
    }),
  ],
  // 개발 서버 옵션
  devServer: {
    open: true,
    port: process.env.CLIENT_PORT || 8081,
  },
};
