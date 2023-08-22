// This file is based on https://github.com/BogdanMihaiciuc/ThingCLI/blob/master/src/Utilities/TWClient.ts
// No changes should be done here, rather they should be done upstream
import * as fs from 'fs';
import * as Path from 'path';

/**
 * The options that may be passed to a thingworx request.
 */
interface TWClientRequestOptions {
    /**
     * The endpoint to invoke
     */
    url: string;

    /**
     * An optional set of HTTP headers to include in addition to the
     * default thingworx headers.
     */
    headers?: Record<string, string>;

    /**
     * An optional text or JSON body to send.
     */
    body?: string | Record<string, any>;

    /**
     * An optional multipart body to send.
     */
    formData?: FormData;
}

/**
 * The interface for an object that contains the response returned from
 * a TWClient request.
 */
interface TWClientResponse {
    /**
     * The response's body.
     */
    body: string;

    /**
     * The response headers.
     */
    headers: Headers;

    /**
     * The status code.
     */
    statusCode?: number;

    /**
     * The status message.
     */
    statusMessage?: string;
}

/**
 * A class that is responsible for performing requests to a thingworx server.
 */
export class TWClient {
    /**
     * The cached package.json contents.
     */
    private static _cachedPackageJSON?: any;

    /**
     * The contents of the project's package.json file.
     */
    private static get _packageJSON() {
        if (this._cachedPackageJSON) return this._cachedPackageJSON;
        this._cachedPackageJSON = require(`${process.cwd()}/package.json`) as TWPackageJSON;
        return this._cachedPackageJSON;
    }

    /**
     * The cached connection details.
     */
    private static _cachedConnectionDetails?: TWPackageJSONConnectionDetails;

    /**
     * The cached header to use for Authentication.
     * Automatically set when the _cachedConnectionDetails are accessed
     */
    private static _authenticationHeaders?: Record<string, string>;

    /**
     * The connection details to be used.
     */
    private static get _connectionDetails(): TWPackageJSONConnectionDetails {
        // Return the cached connection details if they exist.
        if (this._cachedConnectionDetails) {
            return this._cachedConnectionDetails;
        }

        // Otherwise try to get them from the environment variables, falling back to loading
        // them from package.json if they are not defined in the environment.
        if (!process.env.THINGWORX_SERVER) {
            console.error(
                'The thingworx server is not defined in your environment, defaulting to loading from package.json',
            );
            this._cachedConnectionDetails = {
                thingworxServer: this._packageJSON.thingworxServer,
                thingworxUser: this._packageJSON.thingworxUser,
                thingworxPassword: this._packageJSON.thingworxPassword,
                thingworxAppKey: this._packageJSON.thingworxAppKey,
            };
        } else {
            this._cachedConnectionDetails = {
                thingworxServer: process.env.THINGWORX_SERVER,
                thingworxUser: process.env.THINGWORX_USER,
                thingworxPassword: process.env.THINGWORX_PASSWORD,
                thingworxAppKey: process.env.THINGWORX_APPKEY,
            };
        }

        // Try to authorize using an app key if provided, which is the preferred method
        if (this._connectionDetails.thingworxAppKey) {
            this._authenticationHeaders = { appKey: this._connectionDetails.thingworxAppKey };
        }
        // Otherwise use the username and password combo
        else if (
            this._connectionDetails.thingworxUser &&
            this._connectionDetails.thingworxPassword
        ) {
            const basicAuth = Buffer.from(
                this._connectionDetails.thingworxUser +
                    ':' +
                    this._connectionDetails.thingworxPassword,
            ).toString('base64');
            this._authenticationHeaders = { Authorization: 'Basic ' + basicAuth };
        } else {
            throw new Error(
                'Unable to authorize a request to thingworx because an app key or username/password combo was not provided.',
            );
        }

        return this._cachedConnectionDetails;
    }

    /**
     * Returns the thingworx server.
     */
    static get server(): string | undefined {
        return this._connectionDetails.thingworxServer;
    }

    /**
     * Performs a request, returning a promise that resolves with its response.
     * @param options       The requests's options.
     * @returns             A promise that resolves with the response when
     *                      the request finishes.
     */
    private static async _performRequest(
        options: TWClientRequestOptions,
        method: 'get' | 'post' = 'post',
    ): Promise<TWClientResponse> {
        const { thingworxServer: host } = this._connectionDetails;

        // Automatically prepend the base thingworx url
        options.url = `${host}/Thingworx/${options.url}`;

        // Automatically add the thingworx specific headers to options
        const headers = Object.assign(
            {},
            options.headers || {},
            {
                'X-XSRF-TOKEN': 'TWX-XSRF-TOKEN-VALUE',
                'X-THINGWORX-SESSION': 'true',
                Accept: 'application/json',
            },
            this._authenticationHeaders,
        );

        const fetchOptions: RequestInit = { method, headers };

        if (options.body) {
            // If the body is specified as an object, stringify it
            if (typeof options.body == 'object') {
                fetchOptions.body = JSON.stringify(options.body);
            } else {
                fetchOptions.body = options.body;
            }
        } else if (options.formData) {
            fetchOptions.body = options.formData;
        }

        const response = await fetch(options.url, fetchOptions);

        return {
            body: await response.text(),
            headers: response.headers,
            statusCode: response.status,
            statusMessage: response.statusText,
        };
    }

    /**
     * Deletes the specified extension from the thingworx server.
     * @param name      The name of the extension to remove.
     * @returns         A promise that resolves with the server response when the
     *                  operation finishes.
     */
    static async removeExtension(name: string): Promise<TWClientResponse> {
        return await this._performRequest({
            url: `Subsystems/PlatformSubsystem/Services/DeleteExtensionPackage`,
            headers: {
                'Content-Type': 'application/json',
            },
            body: { packageName: name },
        });
    }

    /**
     * Imports the specified extension package to the thingworx server.
     * @param data      A form data object containing the extension to import.
     * @returns         A promise that resolves with the server response when
     *                  the operation finishes.
     */
    static async importExtension(formData: FormData): Promise<TWClientResponse> {
        return await this._performRequest({
            url: `ExtensionPackageUploader?purpose=import`,
            formData: formData,
        });
    }

    /**
     * Sends a POST request to the specified endpoint, with an empty body.
     * @param endpoint      The endpoint.
     * @returns             A promise that resolves with the server response when
     *                      the operation finishes.
     */
    static async invokeEndpoint(endpoint: string): Promise<TWClientResponse> {
        return await this._performRequest({
            url: endpoint,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    /**
     * Retrieves the metadata of the specified entity.
     * @param name          The name of the entity.
     * @param kind          The kind of entity.
     * @returns             A promise that resolves with the server response when
     *                      the operation finishes.
     */
    static async getEntity(name: string, kind: string): Promise<TWClientResponse> {
        const url = `${kind}/${name}${kind == 'Resources' ? '/Metadata' : ''}`;
        return await this._performRequest({ url }, 'get');
    }

    /**
     * Retrieves a list containing the entities that the specified entity depends on.
     * @param name          The name of the entity.
     * @param kind          The kind of entity.
     * @returns             A promise that resolves with the server response when
     *                      the operation finishes.
     */
    static async getEntityDependencies(name: string, kind: string): Promise<TWClientResponse> {
        const url = `${kind}/${name}/Services/GetOutgoingDependencies`;
        return await this._performRequest({
            url,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }

    /**
     * Retrieves a list containing the entities that are part of the specified project.
     * @param name          The name of the project.
     * @returns             A promise that resolves with the server response when
     *                      the operation finishes.
     */
    static async getProjectEntities(name: string): Promise<TWClientResponse> {
        const url = `Resources/SearchFunctions/Services/SpotlightSearch`;
        return await this._performRequest({
            url,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                searchExpression: '**',
                withPermissions: false,
                sortBy: 'name',
                isAscending: true,
                searchDescriptions: true,
                aspects: {
                    isSystemObject: false,
                },
                projectName: name,
                searchText: '',
            }),
        });
    }

    /**
     * Retrieves the typings file for the specified extension package.
     * @param name          The name of the extension package.
     * @returns             A promise that resolves with the server response when
     *                      the operation finishes.
     */
    static async getExtensionTypes(name: string): Promise<TWClientResponse> {
        const url = `Common/extensions/${name}/ui/@types/index.d.ts`;
        return await this._performRequest({ url }, 'get');
    }

    /**
     * Retrieves the package details of the specified extension package.
     * @param name          The name of the extension package.
     * @returns             A promise that resolves with the server response when
     *                      the operation finishes.
     */
    static async getExtensionPackageDetails(name: string): Promise<TWClientResponse> {
        return await this._performRequest({
            url: 'Subsystems/PlatformSubsystem/Services/GetExtensionPackageDetails',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ packageName: name }),
        });
    }

    /**
     * Executes the source control import of a path on the file repository into ThingWorx.
     * @param fileRepository    Name of the ThingWorx FileRepository thing from where the import happens
     * @param path              Path in the `fileRepository` where the entities are.
     * @param projectName       Defaults to `'project'`. The name of the project being imported.
     *                          This is only used for error reporting if the import fails.
     * @returns                 A promise that resolves with the server response when
     *                          the operation finishes.
     */
    static async sourceControlImport(
        fileRepository: string,
        path: string,
        projectName?: string,
    ): Promise<TWClientResponse> {
        const url = `Resources/SourceControlFunctions/Services/ImportSourceControlledEntities`;

        try {
            const response = await this._performRequest({
                url,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    repositoryName: fileRepository,
                    path: path,
                    includeDependents: false,
                    overwritePropertyValues: true,
                    useDefaultDataProvider: false,
                    withSubsystems: false,
                },
            });
            if (response.statusCode != 200) {
                throw new Error(
                    `Got status code ${response.statusCode} (${response.statusMessage}). Body: ${response.body}`,
                );
            }
            return response;
        } catch (err) {
            throw new Error(
                `Error executing source control import for project '${
                    projectName || 'project'
                }' because: ${err}`,
            );
        }
    }

    /**
     * Uploads a local file into a ThingWorx file repository.
     * @param filePath                  Local path to the folder the file is in.
     * @param fileName                  Name of the file to be uploaded.
     * @param fileRepository            Name of the TWX file repository the file should be uploaded to.
     * @param targetPath                Remote path in the TWX file repository where the file should be stored.
     * @returns                         A promise that resolves with the server response when
     *                                  the operation finishes.
     */
    static async uploadFile(
        filePath: string,
        fileName: string,
        fileRepository: string,
        targetPath: string,
    ): Promise<TWClientResponse> {
        try {
            // load the file from the build folder
            let formData = new FormData();
            formData.append('upload-repository', fileRepository);
            formData.append('upload-path', targetPath);
            formData.append(
                'upload-files',
                new Blob([fs.readFileSync(Path.join(filePath, fileName))]),
                fileName,
            );
            formData.append('upload-submit', 'Upload');

            // POST request to the Thingworx FileRepositoryUploader endpoint
            const response = await this._performRequest({
                url: 'FileRepositoryUploader',
                formData,
            });

            if (response.statusCode != 200) {
                throw new Error(
                    `Got status code ${response.statusCode} (${response.statusMessage}). Body: ${response.body}`,
                );
            }
            return response;
        } catch (err) {
            throw new Error(`Error uploading file '${filePath}' into repository because: ${err}`);
        }
    }

    /**
     * Performs a unzip operation on a remote file in a ThingWorx file repository
     * @param fileRepository Name of the TWX FileRepository thing
     * @param filePath Remote path to where the zip file is
     * @param targetFolder Remote path to where the file should be extracted
     * @returns A promise that resolves with the server response when
     *                                  the operation finishes.
     */
    static async unzipAndExtractRemote(
        fileRepository: string,
        filePath: string,
        targetFolder: string,
    ): Promise<TWClientResponse> {
        const url = `Things/${fileRepository}/Services/ExtractZipArchive`;

        try {
            const response = await this._performRequest({
                url,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    path: targetFolder,
                    zipFileName: filePath,
                },
            });
            if (response.statusCode != 200) {
                throw new Error(
                    `Got status code ${response.statusCode} (${response.statusMessage}). Body: ${response.body}`,
                );
            }
            return response;
        } catch (err) {
            throw new Error(`Error executing remote file unzip because: ${err}`);
        }
    }

    /**
     * Deletes the specified remote folder in a ThingWorx file repository.
     * @param fileRepository    Name of the FileRepository from which the folder should be deleted.
     * @param targetFolder      Remote path to the folder to be deleted.
     * @returns                 A promise that resolves with the server response when
     *                          the operation finishes.
     */
    static async deleteRemoteDirectory(
        fileRepository: string,
        targetFolder: string,
    ): Promise<TWClientResponse> {
        const url = `Things/${fileRepository}/Services/DeleteFolder`;
        try {
            const response = await this._performRequest({
                url,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    path: targetFolder,
                },
            });
            if (response.statusCode != 200) {
                throw new Error(
                    `Got status code ${response.statusCode} (${response.statusMessage}). Body: ${response.body}`,
                );
            }
            return response;
        } catch (err) {
            throw new Error(`Error executing remote folder delete because: ${err}`);
        }
    }

    /**
     * Execute a source control export of the specified project.
     * @param project           The name of the Thingworx project to export.
     * @param fileRepository    Name of the FileRepository where the export will be saved.
     * @param path              Remote path where the files should be exported to.
     * @param name              Name of the folder where the files should be stored.
     * @returns                 A promise that resolves with the URL where the zip containing the exports is found
     *                          when the operation completes.
     */
    static async sourceControlExport(
        project: string,
        fileRepository: string,
        path: string,
        name: string,
    ): Promise<string> {
        const { thingworxServer: host } = this._connectionDetails;

        try {
            // Do a ExportToSourceControl to export the project
            const exportResponse = await this._performRequest({
                url: 'Resources/SourceControlFunctions/Services/ExportSourceControlledEntities',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    projectName: project,
                    repositoryName: fileRepository,
                    path: path,
                    name: name,
                    exportMatchingModelTags: true,
                    includeDependents: false,
                },
            });

            if (exportResponse.statusCode != 200) {
                throw new Error(
                    `Got status code ${exportResponse.statusCode} (${exportResponse.statusMessage}). Body: ${exportResponse.body}`,
                );
            }

            // Create a zip from the folder that was exported
            await this._performRequest({
                url: `Things/${fileRepository}/Services/CreateZipArchive`,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    newFileName: project + '.zip',
                    path: path,
                    files: path + '/' + project + '/',
                },
            });

            return `${host}/Thingworx/FileRepositories/${fileRepository}/${path}/${project}.zip`;
        } catch (err) {
            throw new Error(
                `Error executing source control export for project '${project}' because: ${err}`,
            );
        }
    }

    /**
     * Downloads a remote file into the specified path.
     * @param fileUrl           Path to the file to download.
     * @param targetPath        Local path to where the file should be saved.
     * @returns                 A promise that resolves when the file has been written to the specified path.
     */
    static async downloadFile(fileUrl: string, targetPath: string): Promise<void> {
        const response = await fetch(fileUrl, { headers: this._authenticationHeaders });
        fs.writeFileSync(targetPath, Buffer.from(await (await response.blob()).arrayBuffer()));
    }
}

/**
 * A subset of the package.json file for a thingworx vscode project that contains
 * the thingworx connection details.
 */
interface TWPackageJSONConnectionDetails {
    /**
     * The URL to the thingworx server.
     */
    thingworxServer?: string;

    /**
     * The username to use when connecting to the thingworx server.
     */
    thingworxUser?: string;

    /**
     * The password to use when connecting to the thingworx server.
     */
    thingworxPassword?: string;

    /**
     * When specified, has priority over `thingworxUser` and `thingworxPassword`.
     * The app key to use when connecting to the thingworx server.
     */
    thingworxAppKey?: string;
}

/**
 * The interface for a package.json file with the thingworx vscode project specific
 * entries.
 */
interface TWPackageJSON extends TWPackageJSONConnectionDetails {}
