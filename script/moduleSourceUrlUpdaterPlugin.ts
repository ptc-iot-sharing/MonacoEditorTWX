import { Compilation, Compiler, WebpackPluginInstance, sources } from 'webpack';

/**
 * Webpack plugin that walks through all the compilation generated files (chunks)
 * and updates their source url to match the specified context
 * Used because otherwise the developer can confuse between sourcemaps, especially on Chrome
 */
export class ModuleSourceUrlUpdaterPlugin implements WebpackPluginInstance {
    options: { context: string };

    constructor(options: { context: string }) {
        this.options = options;
    }

    apply(compiler: Compiler) {
        const options = this.options;
        compiler.hooks.compilation.tap('ModuleSourceUrlUpdaterPlugin', (compilation) => {
            compilation.hooks.processAssets.tap(
                {
                    name: 'ModuleSourceUrlUpdaterPlugin',
                    stage: Compilation.PROCESS_ASSETS_STAGE_ADDITIONS,
                },
                () => {
                    for (const chunk of compilation.chunks) {
                        for (const file of chunk.files) {
                            compilation.updateAsset(file, (old) => {
                                return new sources.RawSource(
                                    getAssetSourceContents(old).replace(
                                        /\/\/# sourceURL=webpack-internal:\/\/\//g,
                                        '//# sourceURL=webpack-internal:///' +
                                            options.context +
                                            '/',
                                    ),
                                );
                            });
                        }
                    }
                },
            );
        });
    }
}

/**
 * Returns the string representation of an assets source.
 *
 * @param source
 * @returns
 */
export const getAssetSourceContents = (assetSource: sources.Source): string => {
    const source = assetSource.source();
    if (typeof source === 'string') {
        return source;
    }

    return source.toString();
};
