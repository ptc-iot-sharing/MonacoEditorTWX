const path = require('path');
const fs = require('fs');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// enable cleaning of the build and zip directories
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// enable building of the widget
const ZipPlugin = require('zip-webpack-plugin');
// enable reading master data from the package.json file
// note that this is relative to the working directory, not to this file
const packageJson = JSON.parse(fs.readFileSync('./package.json'));
// import the extra plugins
const UploadToThingworxPlugin = require('./uploadToThingworxPlugin');
const WidgetMetadataGenerator = require('./widgetMetadataGeneratorPlugin');
const ModuleSourceUrlUpdaterPlugin = require('./moduleSourceUrlUpdaterPlugin');

module.exports = (env, argv) => {
    // look if we are in initialization mode based on the --upload argument
    const uploadEnabled = env ? env.upload : false;
    const packageName = packageJson.packageName || `${packageJson.name}_ExtensionPackage`;
    require('dotenv').config({ path: '.env' });

    // look if we are in production or not based on the mode we are running in
    const isProduction = argv.mode == 'production';
    const result = {
        entry: {
            // the entry point when viewing the index.html page
            htmlDemo: './src/browser/index.ts',
            // the entry point for the runtime widget
            widgetRuntime: `./src/runtime/index.ts`,
            // the entry point for the ide widget
            widgetIde: `./src/ide/index.ts`,
        },
        devServer: {
            port: 9011,
        },
        output: {
            path: path.join(process.cwd(), 'build', 'ui', packageName),
            filename: '[name].bundle.js',
            chunkFilename: '[id].chunk.js',
            chunkLoadingGlobal: `webpackJsonp${packageName}`,
            publicPath: 'auto',
            devtoolNamespace: packageName,
        },
        plugins: [
            // delete build and zip folders
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: [path.resolve('build/**'), path.resolve('zip/**')],
            }),
            new CopyWebpackPlugin({
                patterns: [
                    // in case we just want to copy some resources directly to the widget package, then do it here
                    { from: 'src/static', to: 'static', noErrorOnMissing: true },
                    // in case the extension contains entities, copy them as well
                    { from: 'Entities/**/*.xml', to: '../../', noErrorOnMissing: true },
                ],
            }),
            // generates the metadata xml file and adds it to the archive
            new WidgetMetadataGenerator({ packageName, packageJson }),
            // create the extension zip
            new ZipPlugin({
                path: path.join(process.cwd(), 'zip'), // a top level directory called zip
                pathPrefix: `ui/${packageName}/`, // path to the extension source code
                filename: `${packageName}-${isProduction ? 'min' : 'dev'}-${
                    packageJson.version
                }.zip`,
                pathMapper: (assetPath) => {
                    // handles renaming of the bundles
                    if (assetPath == 'widgetRuntime.bundle.js') {
                        return packageName + '.runtime.bundle.js';
                    } else if (assetPath == 'widgetIde.bundle.js') {
                        return packageName + '.ide.bundle.js';
                    } else {
                        return assetPath;
                    }
                },
                exclude: [/htmlDemo/, isProduction ? /(.*)\.map$/ : /a^/],
            }),
        ],
        // if we are in development mode, then use "eval-source-map".
        // See https://webpack.js.org/configuration/devtool/ for all available options
        devtool: isProduction ? undefined : 'eval-source-map',
        resolve: {
            // Add '.ts' and '.tsx' as resolvable extensions.
            extensions: ['.ts', '.tsx', '.js', '.json'],
        },
        externals: {
            '@iqnox/widget-support-package/src/ide': 'IqnoxWidgetSupport',
            '@iqnox/widget-support-package/src/runtime': 'IqnoxWidgetSupport',
            '@iqnox/widget-configurator': 'IqnoxWidgetSupport',
        },
        module: {
            rules: [
                {
                    test: /(\.jsx|\.js)$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env'],
                        },
                    },
                },
                // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
                {
                    test: /\.tsx?$/,
                    use: 'ts-loader',
                    exclude: /node_modules/,
                },
                {
                    test: /\.(png|jp(e*)g|svg|xml|d\.ts|ttf)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                limit: 30000,
                            },
                        },
                    ],
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                }
            ],
        },
    };
    // if we are in production, disable the minimizer
    if (isProduction) {
        result.optimization = {
            minimizer: [
                new TerserPlugin({
                    parallel: true,
                    terserOptions: {
                        compress: true,
                        mangle: false,
                        toplevel: false,
                        keep_fnames: true,
                        sourceMap: true,
                    },
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
                thingworxServer: process.env.TARGET_THINGWORX_SERVER,
                thingworxUser: process.env.TARGET_THINGWORX_USER,
                thingworxPassword: process.env.TARGET_THINGWORX_PASSWORD,
                packageVersion: packageJson.version,
                packageName: packageName,
                isProduction: isProduction,
            }),
        );
    }

    return result;
};
