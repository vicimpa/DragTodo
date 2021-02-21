import { join } from "path";
import { Configuration } from "webpack";

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
  mode: 'development',
  watch: true,
  devtool: 'source-map',
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
          'sass-loader'
        ]
      }
    ]
  }
} as Configuration