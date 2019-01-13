import * as monaco from './monaco-editor/esm/vs/editor/editor.api';

export class WorkerScriptManager {
    typescriptDefaults: monaco.languages.typescript.LanguageServiceDefaults;
    javascriptDefaults: monaco.languages.typescript.LanguageServiceDefaults;

    /**
     * Create a new WorkerScriptManager that acts as a interface allowing us to more easily interact with monaco library
     */
    constructor(typescriptDefaults: monaco.languages.typescript.LanguageServiceDefaults, javascriptDefaults: monaco.languages.typescript.LanguageServiceDefaults) {
        this.typescriptDefaults = typescriptDefaults;
        this.javascriptDefaults = javascriptDefaults;
        typescriptDefaults.setEagerExtraLibSync(false);
        javascriptDefaults.setEagerExtraLibSync(false);
    }

    syncExtraLibs() {
        this.javascriptDefaults.syncExtraLibs();
        this.typescriptDefaults.syncExtraLibs();
    }

    addExtraLib(code, name) {
        return [this.typescriptDefaults.addExtraLib(code, name), this.javascriptDefaults.addExtraLib(code, name)];
    }

    async addRemoteExtraLib(location, name) {
        // TODO: do we need a polyfill?
        const response = await fetch(location);
        const data = await response.text();
        this.addExtraLib(data, name);
    }

    setCompilerOptions(options) {
        this.typescriptDefaults.setCompilerOptions(options);
        this.javascriptDefaults.setCompilerOptions(options);
    }
}