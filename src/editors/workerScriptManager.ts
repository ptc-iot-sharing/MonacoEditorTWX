import * as monaco from '../monaco-editor/esm/vs/editor/editor.api';

export class WorkerScriptManager {
    typescriptDefaults: monaco.languages.typescript.LanguageServiceDefaults;
    javascriptDefaults: monaco.languages.typescript.LanguageServiceDefaults;

    libNames: {
        [name: string]: [monaco.IDisposable, monaco.IDisposable]
    } = {};

    /**
     * Create a new WorkerScriptManager that acts as a interface allowing us to more easily interact with monaco library
     */
    constructor(typescriptDefaults: monaco.languages.typescript.LanguageServiceDefaults, javascriptDefaults: monaco.languages.typescript.LanguageServiceDefaults) {
        this.typescriptDefaults = typescriptDefaults;
        this.javascriptDefaults = javascriptDefaults;
    }

    addExtraLib(code, name): [monaco.IDisposable, monaco.IDisposable] {
        let disposables: [monaco.IDisposable, monaco.IDisposable] =  [this.typescriptDefaults.addExtraLib(code, name), this.javascriptDefaults.addExtraLib(code, name)];
        this.libNames[name] = disposables;
        return disposables;
    }

    disposeLib(name: string) {
        if(this.libNames[name]) {
            this.libNames[name][0].dispose();
            this.libNames[name][0].dispose();
        }
    }

    containsLib(name: string): boolean {
        return this.libNames[name] != undefined;
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