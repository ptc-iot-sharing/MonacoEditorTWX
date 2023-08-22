import * as path from "path";
import { mergeWithCustomize, customizeObject } from "webpack-merge";

const EncodingPlugin = require("webpack-encoding-plugin");
import { createConfig } from "./script/webpack.common";

module.exports = (env, argv) =>
    mergeWithCustomize({
        customizeObject: customizeObject({
            entry: "replace",
            externals: "replace",
            output: "merge",
        }),
    })(createConfig(env, argv), {
        resolve: {
            alias: {
                "monaco-editor-core": path.resolve(__dirname, "node_modules/monaco-editor"),
            },
        },
        entry: {
            // the entry point for the new composer code
            newComposer: `./src/newComposerMonacoEditor.ts`,
            // the entry point for the runtime widget
            widgetRuntime: `./src/monacoScriptWidget.runtime.ts`,
            // the entry point for the ide widget
            widgetIde: `./src/monacoScriptWidget.ide.ts`,
            "editor.worker": "monaco-editor/esm/vs/editor/editor.worker.js",
            "json.worker": "monaco-editor/esm/vs/language/json/json.worker",
            "css.worker": "monaco-editor/esm/vs/language/css/css.worker",
            "html.worker": "monaco-editor/esm/vs/language/html/html.worker",
            "ts.worker": "monaco-editor/esm/vs/language/typescript/ts.worker",
            tsCustomWorker: "./src/editors/typescript/worker/index.ts",
        },
        output: {
            globalObject: "self",
        },
        // moment is available directly on window inside the thingworx runtime and mashup builder
        externals: { moment: "moment" },
    });
