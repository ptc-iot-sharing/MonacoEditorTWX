import * as fs from 'fs';
import { TWClient } from './TWClient';
import * as path from 'path';
import { Compiler, WebpackPluginInstance } from 'webpack';

interface Options {
    packageVersion: string;
    packageName: string;
    isProduction: boolean;
}

/**
 * Utility webpack ThingWorx plugin that is used to upload the widget
 * into the target ThingWorx server.
 * Uses native node fetch to run.
 */
export class UploadToThingworxPlugin implements WebpackPluginInstance {
    options: Options;
    authorizationHeader: string;

    constructor(options: Options) {
        this.options = options;
    }

    apply(compiler: Compiler) {
        // this happens in the 'done' phase of the compilation so it will happen at the end
        compiler.hooks.afterDone.tap('UploadToThingworxPlugin', async () => {
            const extensionPath = path.join(
                process.cwd(),
                'zip',
                `${this.options.packageName}-${this.options.isProduction ? 'prod' : 'dev'}-v${
                    this.options.packageVersion
                }.zip`,
            );
            await this.uploadExtension(extensionPath, this.options.packageName);
        });
    }

    /**
     * Uploads an extension zip at the specified path to the thingworx server.
     * @param path      The path to the zip file to upload.
     * @param name      If specified, the name of the project that should appear in the console.
     * @returns         A promise that resolves when the operation completes.
     */
    async uploadExtension(path: string, name?: string): Promise<void> {
        process.stdout.write(
            `\x1b[2m❯\x1b[0m Uploading${name ? ` ${name}` : ''} to ${TWClient.server}`,
        );

        const formData = new FormData();

        formData.append(
            'file',
            new Blob([fs.readFileSync(path)]),
            path.toString().split('/').pop(),
        );

        const response = await TWClient.importExtension(formData);

        if (response.statusCode != 200) {
            process.stdout.write(
                `\r\x1b[1;31m✖\x1b[0m Unable to upload${name ? ` ${name}` : ''} to ${
                    TWClient.server
                }\n`,
            );
            throw new Error(
                `\x1b[1;31mFailed to upload project to thingworx with status code ${
                    response.statusCode
                } (${response.statusMessage})\x1b[0m${this.formattedUploadStatus(response.body)}`,
            );
        }

        process.stdout.write(
            `\r\x1b[1;32m✔\x1b[0m Uploaded${name ? ` ${name}` : ''} to ${TWClient.server}    \n`,
        );
        process.stdout.write(this.formattedUploadStatus(response.body));
    }

    /**
     * Returns a formatted string that contains the validation and installation status extracted
     * from the specified server response.
     * @param response         The server response.
     * @returns                The formatted upload status.
     */
    formattedUploadStatus(response): string {
        let infotable;
        let result = '';
        try {
            infotable = JSON.parse(response);

            // The upload response is an infotable with rows with two possible properties:
            // validate - an infotable where each row contains the validation result for each attempted extension
            // install - if validation passed, an infotable where each row contains the installation result for each attempted extension
            const validations = infotable.rows.filter((r) => r.validate);
            const installations = infotable.rows.filter((r) => r.install);

            const validation = validations.length && {
                rows: Array.prototype.concat.apply(
                    [],
                    validations.map((v) => v.validate.rows),
                ),
            };
            const installation = installations.length && {
                rows: Array.prototype.concat.apply(
                    [],
                    installations.map((i) => i.install.rows),
                ),
            };

            // A value of 1 for extensionReportStatus indicates failure, 2 indicates warning, and 0 indicates success
            for (const row of validation.rows) {
                if (row.extensionReportStatus == 1) {
                    result += `🛑 \x1b[1;31mValidation failed\x1b[0m for "${row.extensionPackage.rows[0].name}-${row.extensionPackage.rows[0].packageVersion}": "${row.reportMessage}"\n`;
                } else if (row.extensionReportStatus == 2) {
                    result += `🔶 \x1b[1;33mValidation warning\x1b[0m for "${row.extensionPackage.rows[0].name}-${row.extensionPackage.rows[0].packageVersion}": "${row.reportMessage}"\n`;
                } else {
                    result += `✅ \x1b[1;32mValidation passed\x1b[0m for "${row.extensionPackage.rows[0].name}-${row.extensionPackage.rows[0].packageVersion}": "${row.reportMessage}"\n`;
                }
            }

            if (!installation) return result;

            // If an installation status is provided, display it as well; it has the same format as validation
            for (const row of installation.rows) {
                if (row.extensionReportStatus == 1) {
                    result += `🛑 \x1b[1;31mInstallation failed\x1b[0m for "${row.extensionPackage.rows[0].name}-${row.extensionPackage.rows[0].packageVersion}": "${row.reportMessage}"\n`;
                } else if (row.extensionReportStatus == 2) {
                    result += `🔶 \x1b[1;33mInstallation warning\x1b[0m for "${row.extensionPackage.rows[0].name}-${row.extensionPackage.rows[0].packageVersion}": "${row.reportMessage}"\n`;
                } else {
                    result += `✅ \x1b[1;32mInstalled\x1b[0m "${row.extensionPackage.rows[0].name}-${row.extensionPackage.rows[0].packageVersion}": "${row.reportMessage}"\n`;
                }
            }

            return result;
        } catch (e) {
            // If the response isn't a parsable response, it is most likely a simple message
            // that may be printed directly.
            return response;
        }
    }
}
