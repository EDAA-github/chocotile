const webpack = require('webpack');

module.exports = {
  entry: "./react/app_timetable.jsx", // входная точка - исходный файл
  output:{
    path: "public/scripts",     // путь к каталогу выходных файлов - папка public
    filename: "timetable.js"       // название создаваемого файла
  },
  resolve:{
    extensions: ["", ".js", ".jsx"] // расширения для загрузки модулей
  },
  module:{
    loaders:[   //загрузчики
      {
        test: /\.jsx?$/, // определяем тип файлов
        exclude: /(node_modules)/,
        loader: ["babel-loader"],
        query:{
          presets:["es2015", "react"]
        }
      }
    ]
  }/*,
  plugins: [
    new webpack.optimize.UglifyJsPlugin({
      compress: { warnings: false },
      include: /\.min\.js$/,
      minimize: true
    })
  ]*/
};