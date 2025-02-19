var postcssImport = require("postcss-import")

module.exports = {
  devServer: {
    overlay: false,
  },
  module: {
    rules: [
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
      },
      {
        test: /\.css$/,
        use: [
          "style-loader",
          "css-loader",
          {
            loader: "postcss-loader",
            options: {
              postcssOptions: {
                plugins: [
                  postcssImport({
                    filter: function (url) {
                      return !url.startsWith("https://fonts.googleapis.com")
                    },
                  }),
                ],
              },
            },
          },
        ],
      },
    ],
  },
}
