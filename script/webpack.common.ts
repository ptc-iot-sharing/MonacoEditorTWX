import * as path from 'path';
import * as fs from 'fs';
import CopyWebpackPlugin from 'copy-webpack-plugin';
// enable cleaning of the build and zip directories
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
// enable building of the widget
import ZipPlugin from 'zip-webpack-plugin';
// enable reading master data from the package.json file
// note that this is relative to the working directory, not to this file
// import the extra plugins
import { UploadToThingworxPlugin } from './uploadToThingworxPlugin';
import { WidgetMetadataGenerator } from './widgetMetadataGeneratorPlugin';
import { ModuleSourceUrlUpdaterPlugin } from './moduleSourceUrlUpdaterPlugin';
import webpack from 'webpack';
import { EsbuildPlugin } from 'esbuild-loader';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import { WebpackConfiguration } from 'webpack-dev-server';

const packageJson = JSON.parse(fs.readFileSync('./package.json', { encoding: 'utf-8' }));

export function createConfig(env, argv): WebpackConfiguration {
    // look if we are in initialization mode based on the --upload argument
    const uploadEnabled = env ? env.upload : false;
    const packageName = packageJson.packageName || `${packageJson.name}_ExtensionPackage`;
    require('dotenv').config({ path: '.env' });

    // look if we are in production or not based on the mode we are running in
    const isProduction = argv.mode == 'production';
    const result = {
        entry: {
            // the entry point when viewing the index.html page
            htmlDemo: "./src/browser/index.ts",
            // the entry point for the runtime widget
            widgetRuntime: `./src/runtime/index.ts`,
            // the entry point for the ide widget
            widgetIde: `./src/ide/index.ts`,
        },
        devServer: {
            port: 9011,
        },
        output: {
            path: path.join(process.cwd(), "build", "ui", packageName),
            filename: "[name].bundle.js",
            chunkFilename: "[id].chunk.js",
            chunkLoadingGlobal: `webpackJsonp${packageName}`,
            // this is the path when viewing the widget in thingworx
            publicPath: "auto",
            devtoolNamespace: packageName,
        },
        plugins: [
            new ForkTsCheckerWebpackPlugin(),
            new webpack.DefinePlugin({
                VERSION: JSON.stringify(packageJson.version),
            }),
            // delete build and zip folders
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: [path.resolve("build/**"), path.resolve("zip/**")],
            }),
            new CopyWebpackPlugin({
                patterns: [
                    // in case we just want to copy some resources directly to the widget package, then do it here
                    { from: "src/static", to: "static", noErrorOnMissing: true },
                    // in case the extension contains entities, copy them as well
                    { from: "Entities/**/*.xml", to: "../../", noErrorOnMissing: true },
                ],
            }),
            // generates the metadata xml file and adds it to the archive
            new WidgetMetadataGenerator({ packageName, packageJson }),
            // create the extension zip
            new ZipPlugin({
                path: path.join(process.cwd(), "zip"), // a top level directory called zip
                pathPrefix: `ui/${packageName}/`, // path to the extension source code
                filename: `${packageName}-${isProduction ? "prod" : "dev"}-v${packageJson.version}.zip`,
                pathMapper: (assetPath) => {
                    // handles renaming of the bundles
                    if (assetPath == "widgetRuntime.bundle.js") {
                        return packageName + ".runtime.bundle.js";
                    } else if (assetPath == "widgetIde.bundle.js") {
                        return packageName + ".ide.bundle.js";
                    } else {
                        return assetPath;
                    }
                },
                exclude: [/htmlDemo/, isProduction ? /(.*)\.map$/ : /a^/],
            }),
        ],
        // if we are in development mode, then use "eval-source-map".
        // See https://webpack.js.org/configuration/devtool/ for all available options
        devtool: isProduction ? undefined : "eval-source-map",
        resolve: {
            // Add '.ts' and '.tsx' as resolvable extensions.
            extensions: [".ts", ".tsx", ".js", ".json"],
        },
        // enable a filesystem cache to speed up individual upload commands
        cache: {
            type: "filesystem",
            compression: "gzip",
        },
        module: {
            rules: [
                {
                    // Match js, jsx, ts & tsx files
                    test: /\.[jt]sx?$/,
                    loader: "esbuild-loader",
                    resourceQuery: { not: [/raw/] },
                },
                {
                    test: /\.scss$/,
                    use: [
                        {
                            loader: "style-loader",
                            options: {
                                attributes: {
                                    "data-description": `Styles for IQNOX widget ${packageName}`,
                                },
                            },
                        },
                        "css-loader",
                        "sass-loader",
                    ],
                },
                {
                    test: /\.css$/,
                    use: [
                        {
                            loader: "style-loader",
                            options: {
                                attributes: {
                                    "data-description": `Styles for widget ${packageName}`,
                                },
                            },
                        },
                        "css-loader",
                        {
                            loader: "esbuild-loader",
                            options: {
                                minify: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2|xml)$/i,
                    // More information here https://webpack.js.org/guides/asset-modules/
                    type: "asset",
                },
                {
                    resourceQuery: /raw/,
                    type: "asset/source",
                },
            ],
        },
    } satisfies WebpackConfiguration;
    // if we are in production, enable the minimizer
    if (isProduction) {
        (result as WebpackConfiguration).optimization = {
            minimizer: [
                new EsbuildPlugin({
                    target: 'es2015',
                    minifyIdentifiers: false,
                }),
            ],
        };
    } else {
        // this handles nice debugging on chromium
        result.plugins.push(
            new ModuleSourceUrlUpdaterPlugin({
                context: packageName,
            }),
        );
    }
    // if the upload is enabled, then add the uploadToThingworxPlugin with the credentials from package.json
    if (uploadEnabled) {
        result.plugins.push(
            new UploadToThingworxPlugin({
                packageVersion: packageJson.version,
                packageName: packageName,
                isProduction: isProduction,
            }),
        );
    }

    return result;
}
