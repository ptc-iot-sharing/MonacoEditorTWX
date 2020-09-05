'use strict';
const path = require('path');
const fs = require('fs');
const TerserPlugin = require('terser-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const EncodingPlugin = require('webpack-encoding-plugin');
// enable cleaning of the build and zip directories
const CleanWebpackPlugin = require('clean-webpack-plugin').CleanWebpackPlugin;
// enable building of the widget
const ZipPlugin = require('zip-webpack-plugin');
// enable reading master data from the package.json file
let packageJson = require('./package.json');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
// look if we are in initialization mode based on the --init argument
const isInitialization = process.argv.indexOf('--env.init') !== -1;
// look if we are in initialization mode based on the --init argument
const uploadEnabled = process.argv.indexOf('--env.upload') !== -1;

// first, increment the version in package.json
let packageVersion = packageJson.version.split('.');
packageJson.version = `${packageVersion[0]}.${packageVersion[1]}.${parseInt(packageVersion[2])}`;
console.log(`Incremented package version to ${packageJson.version}`);
fs.writeFileSync('package.json', JSON.stringify(packageJson, null, 4));

var babelLoader = {
    loader: 'babel-loader',
    options: {
        babelrc: false,
        cacheDirectory: true,
        presets: [['@babel/preset-env']],
        plugins: ["@babel/plugin-syntax-dynamic-import"]
    }
};

module.exports = function (env, argv) {
    const packageName = packageJson.packageName || `${packageJson.name}_ExtensionPackage`;

    // look if we are in production or not based on the mode we are running in
    const isProduction = argv.mode == "production";
    let result = {
        entry: {
            // the entry point for the old composer code
            oldComposer: `./src/oldComposerMonacoEditor.ts`,
            // the entry point for the new composer code
            newComposer: `./src/newComposerMonacoEditor.ts`,
            // the entry point for the runtime widget
            widgetRuntime: `./src/monacoScriptWidget.runtime.ts`,
            // the entry point for the ide widget
            widgetIde: `./src/monacoScriptWidget.ide.ts`
        },
        output: {
            path: path.join(__dirname, 'build', 'ui', packageJson.name),
            filename: '[name].bundle.js',
            chunkFilename: '[id].chunk.js',
            jsonpFunction: `webpackJsonp${packageJson.name}`,
            // this is the path when viewing the widget in thingworx
            publicPath: `../Common/extensions/${packageName}/ui/${packageJson.name}/`
        },
        plugins: [
            // delete build and zip folders
            // delete build and zip folders
            new CleanWebpackPlugin({
                cleanOnceBeforeBuildPatterns: [path.resolve('build/**'), path.resolve('zip/**')]
            }),
            // in case we just want to copy some resources directly to the widget package, then do it here
            // in case the extension contains entities, copy them as well
            new CopyWebpackPlugin({
                patterns: [
                    // in case we just want to copy some resources directly to the widget package, then do it here
                    { from: 'src/static', to: 'static', noErrorOnMissing: true },
                    // in case the extension contains entities, copy them as well
                    { from: 'Entities/**/*.xml', to: '../../', noErrorOnMissing: true },
                ],
            }),
            new MonacoWebpackPlugin(),
            // generates the metadata xml file and adds it to the archive
            new WidgetMetadataGenerator(),
            // create the extension zip
            new ZipPlugin({
                path: path.join(__dirname, 'zip'), // a top level directory called zip
                pathPrefix: `ui/${packageJson.name}/`, // path to the extension source code
                filename: `${packageJson.name}-${isProduction ? 'min' : 'dev'}-${packageJson.version}.zip`,
                pathMapper: function (assetPath) {
                    // handles renaming of the budles
                    if (assetPath == 'widgetRuntime.bundle.js') {
                        return packageJson.name + '.runtime.bundle.js';
                    } else if (assetPath == 'widgetIde.bundle.js') {
                        return packageJson.name + '.ide.bundle.js';
                    } else {
                        return assetPath;
                    }
                },
                exclude: [/htmlDemo/, isProduction ? /(.*)\.map$/ : /a^/]
            }),
            new EncodingPlugin({
                encoding: 'utf8'
            }),
        ],
        // if we are in development mode, then use "eval-source-map".
        // See https://webpack.js.org/configuration/devtool/ for all available options
        devtool: isProduction ? undefined : 'eval-source-map',
        resolve: {
            // Add '.ts' and '.tsx' as resolvable extensions.
            extensions: ['.ts', '.tsx', '.js', '.json'],
            modules: ['node_modules', 'src']
        },

        module: {
            rules: [
                {
                    test: /\.ts(x?)$/,
                    exclude: /node_modules/,
                    use: [
                        babelLoader,
                        {
                            loader: 'ts-loader'
                        }
                    ]
                }, {
                    test: /\.js$/,
                    exclude: /(node_modules|bower_components|src[\\/]monaco-editor[\\/]esm)/,
                    use: [
                        babelLoader
                    ]
                },
                {
                    test: /\.(png|jp(e*)g|svg|xml|d\.ts|ttf)$/,
                    loader: 'url-loader?limit=30000&name=images/[name].[ext]'
                },
                {
                    test: /\.css$/,
                    use: ['style-loader', 'css-loader']
                }
            ]
        }
    }
    // if we are in production, disable the minimizer
    if (isProduction) {
        result.optimization = {
            minimizer: [
                new TerserPlugin({
                    cache: true,
                    parallel: true,
                    terserOptions: {
                        compress: true,
                        mangle: false,
                        toplevel: false,
                        keep_fnames: true,
                        sourceMap: true
                    }
                })
            ]
        };
    }
    // if we are in the initialization phase, do the renames
    if (isInitialization) {
        result.plugins.unshift(new InitializeProject());
    }

    function InitializeProject(options) { }

    InitializeProject.prototype.apply = function (compiler) {
        compiler.hooks.run.tap('InitializeProjectPlugin', function () {
            console.log(`Generating widget with name: ${packageJson.name}`);
            // rename the ide.ts and runtime.ts files
            fs.renameSync('src/demoWebpack.ide.ts', `src/${packageJson.name}.ide.ts`);
            fs.renameSync('src/demoWebpack.runtime.ts', `src/${packageJson.name}.runtime.ts`);
        });
    };

    function WidgetMetadataGenerator(options) { }

    WidgetMetadataGenerator.prototype.apply = function (compiler) {
        compiler.hooks.emit.tapAsync('WidgetMetadataGeneratorPlugin', function (compilation, callback) {
            // read the metadata xml file using xml2js
            let xml2js = require('xml2js');
            fs.readFile('metadata.xml', 'utf-8', function (err, data) {
                if (err) console.log('Error reading metadata file' + err);
                // transform the metadata to json
                xml2js.parseString(data, function (err, result) {
                    if (err) console.log('Error parsing metadata file' + err);
                    // set the name of the extension package
                    result.Entities.ExtensionPackages[0].ExtensionPackage[0].$.name = packageName;
                    // set the description from the package.json
                    result.Entities.ExtensionPackages[0].ExtensionPackage[0].$.description = packageJson.description;
                    // set the vendor using the author field in package json
                    result.Entities.ExtensionPackages[0].ExtensionPackage[0].$.vendor = packageJson.author;
                    // set the minimum thingworx version
                    result.Entities.ExtensionPackages[0].ExtensionPackage[0].$.minimumThingWorxVersion =
                        packageJson.minimumThingWorxVersion;
                    // set the version of the package
                    result.Entities.ExtensionPackages[0].ExtensionPackage[0].$.packageVersion = packageJson.version;
                    // set the name of the widget itself
                    result.Entities.Widgets[0].Widget[0].$.name = packageJson.name;
                    if (packageJson.autoUpdate) {
                        result.Entities.ExtensionPackages[0].ExtensionPackage[0].$.buildNumber = JSON.stringify(packageJson.autoUpdate);
                    }
                    // if there is no file resourse set, then we must add a node in the xml
                    if (!result.Entities.Widgets[0].Widget[0].UIResources[0].FileResource) {
                        result.Entities.Widgets[0].Widget[0].UIResources[0] = {};
                        result.Entities.Widgets[0].Widget[0].UIResources[0].FileResource = [];
                    }
                    // add the old composer bundle file
                    result.Entities.Widgets[0].Widget[0].UIResources[0].FileResource.push({
                        $: {
                            type: 'JS',
                            file: `oldComposer.bundle.js`,
                            description: '',
                            isDevelopment: 'true',
                            isRuntime: 'false'
                        }
                    });
                    // add the ide file
                    result.Entities.Widgets[0].Widget[0].UIResources[0].FileResource.push({
                        $: {
                            type: 'JS',
                            file: `${packageJson.name}.ide.bundle.js`,
                            description: '',
                            isDevelopment: 'true',
                            isRuntime: 'false'
                        }
                    });
                    // add the runtime file
                    result.Entities.Widgets[0].Widget[0].UIResources[0].FileResource.push({
                        $: {
                            type: 'JS',
                            file: `${packageJson.name}.runtime.bundle.js`,
                            description: '',
                            isDevelopment: 'false',
                            isRuntime: 'true'
                        }
                    });
                    // tranform the metadata back into xml
                    var builder = new xml2js.Builder();
                    var xml = builder.buildObject(result);

                    // Insert the metadata xml as a file asset
                    compilation.assets['../../metadata.xml'] = {
                        source: function () {
                            return xml;
                        },
                        size: function () {
                            return xml.length;
                        }
                    };
                    callback();
                });
            });
        });
    };

    // if the upload is inabled, then add the uploadToThingworxPlugin with the credentials from package.json
    if (uploadEnabled) {
        result.plugins.push(
            new UploadToThingworxPlugin({
                thingworxServer: packageJson.thingworxServer,
                thingworxUser: packageJson.thingworxUser,
                thingworxPassword: packageJson.thingworxPassword
            })
        );
    }

    function UploadToThingworxPlugin(options) {
        this.options = options;
    }

    UploadToThingworxPlugin.prototype.apply = function (compiler) {
        let options = this.options;
        // this happens in the 'done' phase of the compilation so it will happen at the end
        compiler.hooks.done.tap('UploadToThingworxPlugin', function () {
            console.log('Starting widget upload');
            let request = require('request');
            // remove the current version before uploading
            request.post({
                url: `${options.thingworxServer}/Thingworx/Subsystems/PlatformSubsystem/Services/DeleteExtensionPackage`,
                headers: {
                    'X-XSRF-TOKEN': 'TWX-XSRF-TOKEN-VALUE',
                    Accept: 'application/json',
                    'Content-Type': 'application/json',
                    'X-THINGWORX-SESSION': 'true'
                },
                body: { packageName: packageName },
                json: true
            },
                function (err, httpResponse, body) {
                    // load the file from the zip folder
                    let formData = {
                        file: fs.createReadStream(
                            path.join(__dirname, 'zip', `${packageJson.name}-${isProduction ? 'min' : 'dev'}-${packageJson.version}.zip`)
                        )
                    };
                    // POST request to the ExtensionPackageUploader servlet
                    request
                        .post(
                            {
                                url: `${options.thingworxServer}/Thingworx/ExtensionPackageUploader?purpose=import`,
                                headers: {
                                    'X-XSRF-TOKEN': 'TWX-XSRF-TOKEN-VALUE'
                                },
                                formData: formData
                            },
                            function (err, httpResponse, body) {
                                if (err) {
                                    console.error("Failed to upload widget to thingworx");
                                    throw err;
                                }
                                if (httpResponse.statusCode != 200) {
                                    throw `Failed to upload widget to thingworx. We got status code ${httpResponse.statusCode} (${httpResponse.statusMessage})`;
                                } else {
                                    console.log(`Uploaded widget version ${packageJson.version} to Thingworx!`);
                                }
                            }
                        )
                        .auth(options.thingworxUser, options.thingworxPassword);

                    if (err) {
                        console.error("Failed to delete widget from thingworx: " + err);
                        //throw err;
                    }
                    if (httpResponse.statusCode != 200) {
                        console.log(`Failed to delete widget from thingworx. We got status code ${httpResponse.statusCode} (${httpResponse.statusMessage})
                    body:
                    ${httpResponse.body}`);
                    } else {
                        console.log(`Deleted previous version of ${packageName} from Thingworx!`);
                    }
                })
                .auth(options.thingworxUser, options.thingworxPassword);


        });
    };
    return result;
};