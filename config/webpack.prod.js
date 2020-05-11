
const { resolve } = require('path'); //node内置核心模块，用来设置路径。
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: ['./src/js/app.js', './src/index.html'],
  output: {
    filename: 'js/[name].[hash:8].js',
    publicPath: '/'
  },
  module: {
    rules: [
      {
        oneOf: [  //数组中的配置只能一个生效 后面的配置奖杯放入当前数组之中
          {
            test: /\.js$/,
            exclude: '/node_modules',
            use: {
              loader: 'babel-loader',
              options: {
                presets: ['@babel/preset-env']
              }
            }
          },
          {
            test: /\.(png|jpg|gif|svg)$/,
            use: [{
              loader: 'url-loader',
              options: {
                limit: 1,//未开启base64处理  8*1024 == 8k大小以下的图片文件都用base64处理
                name: 'images/[name].[hash:8].[ext]' //hash值为
              }
            },
            {
              loader: 'img-loader',
              options: {
                plugins: [
                  require('imagemin-mozjpeg')({
                    progressive: true,
                    arithmetic: false
                  }),
                  require('imagemin-svgo')({
                    plugins: [
                      { removeTitle: true },
                      { convertPathData: false }
                    ]
                  })
                ]
              }
            }]
          },
          {
            test: /\.(html)$/,
            use: {
              loader: 'html-loader'
            }
          },
          {
            test: /\.less$/,
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              'postcss-loader',
              'less-loader'
            ]
          }
        ]
      }
    ]
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
      title: '打包',
      inject: 'body',
      minify: {
        "removeComments": true,
        "collapseWhitespace": true,
        "removeRedundantAttributes": true,
        "useShortDoctype": true,
        "removeEmptyAttributes": true,
        "removeStyleLinkTypeAttributes": true,
        "keepClosingSlash": true,
        "minifyJS": true,
        "minifyCSS": true,
        "minifyURLs": true,
      }
    }),
    new MiniCssExtractPlugin({
      filename: "css/[name].[hash:8].css",
      chunkFilename: 'css/[hash:8].css'
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessorPluginOptions: {
        preset: ["default", { discardComments: { removeAll: true } }]
      }
    })
  ],
  // mode:'development'   
  mode: 'production'
}