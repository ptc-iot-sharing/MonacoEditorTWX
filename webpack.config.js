const path = require('path');

const common = require("./webpack/webpack.common");
const EncodingPlugin = require("webpack-encoding-plugin");
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");

// for changes to the webpack build config, please refer to using webpack-merge
const { mergeWithCustomize, customizeObject } = require("webpack-merge");

module.exports = (env, argv) =>
  mergeWithCustomize({
    customizeObject: customizeObject({
      entry: "replace",
      externals: "replace",
      plugins: "append",
    }),
  })(common(env, argv), {
    entry: {
      // the entry point for the old composer code
      oldComposer: `./src/oldComposerMonacoEditor.ts`,
      // the entry point for the new composer code
      newComposer: `./src/newComposerMonacoEditor.ts`,
      // the entry point for the runtime widget
      widgetRuntime: `./src/monacoScriptWidget.runtime.ts`,
      // the entry point for the ide widget
      widgetIde: `./src/monacoScriptWidget.ide.ts`,
    },
    plugins: [
      new MonacoWebpackPlugin(),
      new EncodingPlugin({
        encoding: "utf8",
      }),
    ],
    externals: [],
  });
