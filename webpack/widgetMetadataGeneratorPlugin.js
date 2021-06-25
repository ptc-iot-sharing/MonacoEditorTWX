const xml2js = require('xml2js');

const XML_FILE_TEMPLATE = `
<?xml version="1.0" encoding="UTF-8"?><Entities>
<ExtensionPackages>
  <ExtensionPackage name="" description="" vendor="" packageVersion="" minimumThingWorxVersion="" buildNumber=""/>
</ExtensionPackages>
<Widgets>
  <Widget name="">
    <UIResources/>
  </Widget>
</Widgets>
</Entities>
`;

class WidgetMetadataGenerator {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
        compiler.hooks.compilation.tap('ModuleSourceUrlUpdaterPlugin', (compilation) => {
            compilation.hooks.additionalAssets.tap('WidgetMetadataGeneratorPlugin', () => {
                const options = this.options;
                // read the metadata xml file using xml2js
                // transform the metadata to json
                xml2js.parseString(XML_FILE_TEMPLATE, function (err, result) {
                    if (err) console.log('Error parsing metadata file' + err);
                    const extensionPackageAttributes =
                        result.Entities.ExtensionPackages[0].ExtensionPackage[0].$;
                    // set the name of the extension package
                    extensionPackageAttributes.name = options.packageName;
                    // set the description from the package.json
                    extensionPackageAttributes.description = options.packageJson.description;
                    // set the vendor using the author field in package json
                    extensionPackageAttributes.vendor = options.packageJson.author;
                    // set the minimum thingworx version
                    extensionPackageAttributes.minimumThingWorxVersion =
                        options.packageJson.minimumThingWorxVersion;
                    // set the version of the package
                    extensionPackageAttributes.packageVersion = options.packageJson.version;
                    // set the name of the widget itself
                    result.Entities.Widgets[0].Widget[0].$.name = options.packageName;
                    if (options.packageJson.autoUpdate) {
                        extensionPackageAttributes.buildNumber = JSON.stringify(
                            options.packageJson.autoUpdate,
                        );
                    }
                    // if there is no file resource set, then we must add a node in the xml
                    if (!result.Entities.Widgets[0].Widget[0].UIResources[0].FileResource) {
                        result.Entities.Widgets[0].Widget[0].UIResources[0] = {};
                        result.Entities.Widgets[0].Widget[0].UIResources[0].FileResource = [];
                    }
                    // add the ide file
                    result.Entities.Widgets[0].Widget[0].UIResources[0].FileResource.push({
                        $: {
                            type: 'JS',
                            file: `${options.packageName}.ide.bundle.js`,
                            description: '',
                            isDevelopment: 'true',
                            isRuntime: 'false',
                        },
                    });
                    // add the runtime file
                    result.Entities.Widgets[0].Widget[0].UIResources[0].FileResource.push({
                        $: {
                            type: 'JS',
                            file: `${options.packageName}.runtime.bundle.js`,
                            description: '',
                            isDevelopment: 'false',
                            isRuntime: 'true',
                        },
                    });
                    // transform the metadata back into xml
                    const xml = new xml2js.Builder().buildObject(result);

                    // insert the metadata xml as a file asset
                    compilation.assets['../../metadata.xml'] = {
                        source: () => xml,
                        size: () => xml.length,
                    };
                });
            });
        });
    }
}

module.exports = WidgetMetadataGenerator;
