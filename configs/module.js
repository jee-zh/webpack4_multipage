import path from "path";
import MiniCssExtractPlugin from "mini-css-extract-plugin";
import { isDevelopment, isProduction, shouldUseSourceMap } from "./env";
import PostCssPresetEnv from "postcss-preset-env";
import PostcssFlexBugsfixes from "postcss-flexbugs-fixes";
import friendlyFormatter from "eslint-formatter-friendly"

const postCssLoaderConfig = {
  loader: "postcss-loader",
  options: {
    // Necessary for external CSS imports to work
    // https://github.com/facebook/create-react-app/issues/2677
    ident: 'postcss',
    plugins: () => [
      PostcssFlexBugsfixes,
      PostCssPresetEnv({
        autoprefixer: {
          flexbox: 'no-2009',
          overrideBrowserslist: [
            "last 100 version"
          ]
        },
        stage: 3,
      })
    ],
    sourceMap: isProduction && shouldUseSourceMap,
  },
}
export default {
  rules: [
    { // To be safe, you can use enforce: "pre" section to check source files, not modified by other loaders (like babel-loader)
      enforce: "pre",
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "eslint-loader",
      options: {
        formatter: friendlyFormatter
      }
    },
    {
      test: /\.js$/,
      include: path.resolve(__dirname, "../app"),
      use: "babel-loader"
    }, {
      test: /\.css$/,
      use: [
        isDevelopment && "style-loader",
        isProduction && {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: "../"
          }
        },
        {
          loader: "css-loader"
        },
        postCssLoaderConfig
      ].filter(Boolean)
    }, {
      test: /\.less$/,
      include: path.resolve(__dirname, "../app"),
      use: [
        isDevelopment && "style-loader",
        isProduction && {
          loader: MiniCssExtractPlugin.loader,
          options: {
            publicPath: "../"
          }
        },
        {
          loader: "css-loader"
        },
        {
          loader: "less-loader"
        },
        postCssLoaderConfig
      ].filter(Boolean)
    }, {
      test: /\.(png\jpe?g|gif)$/,
      use: [
        {
          loader: "file-loader"
        }
      ]
    },
    {
      test: /\.(png|jpg|gif)$/,
      use: [{
        loader: "url-loader",
        options: {
          limit: 8 * 1024, // 小于这个时将会已base64位图片打包处理
          outputPath: "images"
        }
      }]
    },
    {
      test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/,
      loader: "url-loader",
      options: {
        limit: 10000
      }
    },
    {
      test: /\.html$/,
      use: ["html-withimg-loader"] // html中的img标签
    }
  ]
}