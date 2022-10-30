const path = require('path')
const HtmlWebpackPlugin = require("html-webpack-plugin")
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const CopyPlugin = require("copy-webpack-plugin")


module.exports = {
  entry: './src/main.ts',
  devtool: 'inline-source-map',
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      // {
      //   test: require.resolve('Phaser'),
      //   loader: 'expose-loader',
      //   options: { exposes: { globalName: 'Phaser', override: true } }
      // }
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'Game',
      template: path.resolve(__dirname, 'public/index.html')
    }),
    new CleanWebpackPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: 'public',
          globOptions: {
            ignore: [
              '**/index.html'
            ]
          }
        },
      ],
    }),
  ],
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    static: path.join(__dirname, "dist"),
  }
}