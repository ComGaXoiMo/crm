module.exports = {
  // other webpack configuration options
  devServer: {
    overlay: false,
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
    ],
  },
}
