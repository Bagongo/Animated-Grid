module.exports = {
  debug: true,
  devtool:"source-map",
  entry: {
    App: "./app/assets/scripts/App.js",
    // Add other for multiple entry. Example below....
    // Vendor: "./app/assets/scripts/Vendor.js"
  },
  output: {
    path: "./app/temp/scripts",
    filename: "[name].js"
  },
  module: {
    loaders: [
      {
        loader: 'babel',
        query: {
          presets: ['es2015']
        },
        test: /\.js$/,
        exclude: /node_modules/
      }
    ]
  }
};