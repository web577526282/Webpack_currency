
const {resolve} = require('path'); //node内置核心模块，用来设置路径。
const {CleanWebpackPlugin} =require('clean-webpack-plugin');
const HtmlWebpackPlugin =require('html-webpack-plugin');
const webpack = require('webpack');




module.exports={
  entry:['./src/js/app.js','./src/index.html'],
  output:{
    filename:'./js/bundle.js',
    path:resolve(__dirname,'dist')
  },
  module:{
    rules:[
      {
        oneOf:[  //数组中的配置只能一个生效 后面的配置奖杯放入当前数组之中
           {
             test:/\.js$/,
             exclude:'/node_modules',
             use:{
               loader:'babel-loader',
               options:{
                 presets:['@babel/preset-env']
               }
             }
           },
           {
             test:/\.less$/,
             use:[{
               loader:"style-loader"
             },{
               loader:"css-loader"
             },{
               loader:"less-loader"
             }]
           },
           {
             test:/\.(png|jpg|gif|svg)$/,
             use:[{
               loader:'url-loader',
               options:{
                 outputPath: 'images/',//在output基础上。修改输出图片的位置
                 publicPath: 'images/',//修改背景图片引入url的路径
                 limit:8*1024,//8k大小一下的图片文件都用base64处理
                 name:'[hash:8].[ext]' //hash值为
               }
             }]
           },
           {
             test:/\.(html)$/,
             use:{
               loader:'html-loader'
             }
           }
        ]
      }
    ]
  },
  devtool:'inline-source-map',
  devServer:{
      contentBase:'./dist',//项目根路径
      hot:true,//开启热模替换功能
      open:true //自动打开浏览器
  },
  plugins:[
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin(),
     new CleanWebpackPlugin(),
     new HtmlWebpackPlugin({
      filename:'index.html',
      template:'./src/index.html',
      title:'打包',
      inject:'body'
     })
  ],
  mode:'development'
  // mode:'production'
}