const got = require('got');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

class UploadToThingworxPlugin {
    constructor(options) {
        this.options = options;
        if (!this.options.thingworxServer) {
            throw 'No target ThingWorx server declared for upload. Create a .env file';
        }
        // make sure the thingworx server does not end with /
        if (this.options.thingworxServer.endsWith('/')) {
            this.options.thingworxServer = this.options.thingworxServer.slice(0, -1);
        }
        this.authorizationHeader =
            'Basic ' +
            Buffer.from(`${this.options.thingworxUser}:${this.options.thingworxPassword}`).toString(
                'base64',
            );
    }

    apply(compiler) {
        // this happens in the 'done' phase of the compilation so it will happen at the end
        compiler.hooks.done.tap('UploadToThingworxPlugin', async () => {
            console.info('Starting widget upload');
            // remove the current version before uploading
            try {
                await this.deleteExtension();
            } catch (ex) {
                if (ex.response) {
                    console.warn(
                        `Failed to delete extension from thingworx because ${ex}. \n${ex.response.body}. \nThis is not a critical error`,
                    );
                } else {
                    console.warn(
                        `Failed to delete extension from thingworx because ${ex}. \nThis is not a critical error`,
                    );
                }
            }
            // upload the new extension version
            try {
                await this.importExtension();
                console.log(`Uploaded widget version ${this.options.packageVersion} to Thingworx!`);
            } catch (ex) {
                if (ex.response) {
                    console.error(
                        `Failed to import extension to thingworx because ${ex}. \n${ex.response.body}. \nThis is a critical error`,
                    );
                } else {
                    console.error(
                        `Failed to import extension to thingworx because ${ex}. \nThis is a critical error`,
                    );
                }
            }
        });
    }

    async deleteExtension() {
        return await got.default.post({
            url: `${this.options.thingworxServer}/Thingworx/Subsystems/PlatformSubsystem/Services/DeleteExtensionPackage`,
            headers: {
                'X-XSRF-TOKEN': 'TWX-XSRF-TOKEN-VALUE',
                Authorization: this.authorizationHeader,
            },
            json: { packageName: this.options.packageName },
            responseType: 'json',
            username: this.options.thingworxUser,
            password: this.options.thingworxPassword,
        });
    }

    async importExtension() {
        const form = new FormData();
        form.append(
            'file',
            fs.createReadStream(
                path.join(
                    process.cwd(),
                    'zip',
                    `${this.options.packageName}-${this.options.isProduction ? 'min' : 'dev'}-${
                        this.options.packageVersion
                    }.zip`,
                ),
            ),
        );

        // POST request to the ExtensionPackageUploader servlet
        return await got.default.post({
            url: `${this.options.thingworxServer}/Thingworx/ExtensionPackageUploader?purpose=import`,
            headers: {
                'X-XSRF-TOKEN': 'TWX-XSRF-TOKEN-VALUE',
                Authorization: this.authorizationHeader,
            },
            body: form,
            username: this.options.thingworxUser,
            password: this.options.thingworxPassword,
        });
    }
}

module.exports = UploadToThingworxPlugin;
