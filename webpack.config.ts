import { join } from "path";
import { Configuration } from "webpack";

const devMode = process.env.NODE_ENV != 'production'

export = {
  entry: {
    main: './index.tsx'
  },
  output: {
    path: join(__dirname, 'dist'),
    filename: '[name].js',
    publicPath: '/dist/'
  },
  resolve: { extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'] },
  mode: devMode ? 'development' : 'production',
  watch: devMode,
  devtool: devMode ? 'source-map' : false,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader'
      },
      {
        test: /\.s(a|s)ss$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader',
          'sass-loader'
        ]
      }
    ]
  }
} as Configuration