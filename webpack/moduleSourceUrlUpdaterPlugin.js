const { RawSource } = require('webpack-sources');
const { Compilation } = require('webpack');

class ModuleSourceUrlUpdaterPlugin {
    constructor(options) {
        this.options = options;
    }

    apply(compiler) {
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
                                return new RawSource(
                                    old
                                        .source()
                                        .replace(
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

module.exports = ModuleSourceUrlUpdaterPlugin;
