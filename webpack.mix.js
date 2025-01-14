const mix = require('laravel-mix');

/*
 |--------------------------------------------------------------------------
 | Mix Asset Management
 |--------------------------------------------------------------------------
 |
 | Mix provides a clean, fluent API for defining some Webpack build steps
 | for your Laravel application. By default, we are compiling the Sass
 | file for the application as well as bundling up all the JS files.
 |
 */

mix.ts("resources/ts/app.ts", "public/js").vue({ version: 3 });

mix.webpackConfig({
  cache: {
    type: 'filesystem', // ファイルシステムキャッシュを有効化（ビルド速度向上）
  },
  resolve: {
    extensions: [".js", ".jsx", ".vue", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: "ts-loader",
        options: { appendTsSuffixTo: [/\.vue$/] }, // TypeScriptで.vueファイルをサポート
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpe?g|gif|svg)$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: '[name].[contenthash].[ext]',
              outputPath: 'static/img',
              esModule: false
            }
          }
        ]
      }
    ]
  }
});
