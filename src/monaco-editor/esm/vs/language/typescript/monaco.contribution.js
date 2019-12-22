import '../../editor/editor.api.js';
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as tsDefinitions from '../../basic-languages/typescript/typescript.js';
import * as jsDefinitions from '../../basic-languages/javascript/javascript.js';
import { typescriptVersion } from './lib/typescriptServicesMetadata'; // do not import the whole typescriptServices here
var Emitter = monaco.Emitter;
var LanguageServiceDefaultsImpl = /** @class */ (function () {
    function LanguageServiceDefaultsImpl(langualgeId, compilerOptions, diagnosticsOptions) {
        this._onDidChange = new Emitter();
        this._onDidExtraLibsChange = new Emitter();
        this._extraLibs = Object.create(null);
        this._eagerModelSync = false;
        this.setCompilerOptions(compilerOptions);
        this.setDiagnosticsOptions(diagnosticsOptions);
        this._onDidExtraLibsChangeTimeout = -1;
    }
    Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "onDidChange", {
        get: function () {
            return this._onDidChange.event;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "onDidExtraLibsChange", {
        get: function () {
            return this._onDidExtraLibsChange.event;
        },
        enumerable: true,
        configurable: true
    });
    LanguageServiceDefaultsImpl.prototype.getExtraLibs = function () {
        return this._extraLibs;
    };
    LanguageServiceDefaultsImpl.prototype.addExtraLib = function (content, _filePath) {
        var _this = this;
        var filePath;
        if (typeof _filePath === 'undefined') {
            filePath = "ts:extralib-" + Math.random().toString(36).substring(2, 15);
        }
        else {
            filePath = _filePath;
        }
        if (this._extraLibs[filePath] && this._extraLibs[filePath].content === content) {
            // no-op, there already exists an extra lib with this content
            return {
                dispose: function () { }
            };
        }
        var myVersion = 1;
        if (this._extraLibs[filePath]) {
            myVersion = this._extraLibs[filePath].version + 1;
        }
        this._extraLibs[filePath] = {
            content: content,
            version: myVersion,
        };
        this._fireOnDidExtraLibsChangeSoon();
        return {
            dispose: function () {
                var extraLib = _this._extraLibs[filePath];
                if (!extraLib) {
                    return;
                }
                if (extraLib.version !== myVersion) {
                    return;
                }
                delete _this._extraLibs[filePath];
                _this._fireOnDidExtraLibsChangeSoon();
            }
        };
    };
    LanguageServiceDefaultsImpl.prototype.setExtraLibs = function (libs) {
        // clear out everything
        this._extraLibs = Object.create(null);
        if (libs && libs.length > 0) {
            for (var _i = 0, libs_1 = libs; _i < libs_1.length; _i++) {
                var lib = libs_1[_i];
                var filePath = lib.filePath || "ts:extralib-" + Math.random().toString(36).substring(2, 15);
                var content = lib.content;
                this._extraLibs[filePath] = {
                    content: content,
                    version: 1
                };
            }
        }
        this._fireOnDidExtraLibsChangeSoon();
    };
    LanguageServiceDefaultsImpl.prototype._fireOnDidExtraLibsChangeSoon = function () {
        var _this = this;
        if (this._onDidExtraLibsChangeTimeout !== -1) {
            // already scheduled
            return;
        }
        this._onDidExtraLibsChangeTimeout = setTimeout(function () {
            _this._onDidExtraLibsChangeTimeout = -1;
            _this._onDidExtraLibsChange.fire(undefined);
        }, 0);
    };
    LanguageServiceDefaultsImpl.prototype.getCompilerOptions = function () {
        return this._compilerOptions;
    };
    LanguageServiceDefaultsImpl.prototype.setCompilerOptions = function (options) {
        this._compilerOptions = options || Object.create(null);
        this._onDidChange.fire(undefined);
    };
    LanguageServiceDefaultsImpl.prototype.getDiagnosticsOptions = function () {
        return this._diagnosticsOptions;
    };
    LanguageServiceDefaultsImpl.prototype.setDiagnosticsOptions = function (options) {
        this._diagnosticsOptions = options || Object.create(null);
        this._onDidChange.fire(undefined);
    };
    LanguageServiceDefaultsImpl.prototype.setMaximumWorkerIdleTime = function (value) {
    };
    LanguageServiceDefaultsImpl.prototype.setEagerModelSync = function (value) {
        // doesn't fire an event since no
        // worker restart is required here
        this._eagerModelSync = value;
    };
    LanguageServiceDefaultsImpl.prototype.getEagerModelSync = function () {
        return this._eagerModelSync;
    };
    return LanguageServiceDefaultsImpl;
}());
export { LanguageServiceDefaultsImpl };
//#region enums copied from typescript to prevent loading the entire typescriptServices ---
var ModuleKind;
(function (ModuleKind) {
    ModuleKind[ModuleKind["None"] = 0] = "None";
    ModuleKind[ModuleKind["CommonJS"] = 1] = "CommonJS";
    ModuleKind[ModuleKind["AMD"] = 2] = "AMD";
    ModuleKind[ModuleKind["UMD"] = 3] = "UMD";
    ModuleKind[ModuleKind["System"] = 4] = "System";
    ModuleKind[ModuleKind["ES2015"] = 5] = "ES2015";
    ModuleKind[ModuleKind["ESNext"] = 99] = "ESNext";
})(ModuleKind || (ModuleKind = {}));
var JsxEmit;
(function (JsxEmit) {
    JsxEmit[JsxEmit["None"] = 0] = "None";
    JsxEmit[JsxEmit["Preserve"] = 1] = "Preserve";
    JsxEmit[JsxEmit["React"] = 2] = "React";
    JsxEmit[JsxEmit["ReactNative"] = 3] = "ReactNative";
})(JsxEmit || (JsxEmit = {}));
var NewLineKind;
(function (NewLineKind) {
    NewLineKind[NewLineKind["CarriageReturnLineFeed"] = 0] = "CarriageReturnLineFeed";
    NewLineKind[NewLineKind["LineFeed"] = 1] = "LineFeed";
})(NewLineKind || (NewLineKind = {}));
var ScriptTarget;
(function (ScriptTarget) {
    ScriptTarget[ScriptTarget["ES3"] = 0] = "ES3";
    ScriptTarget[ScriptTarget["ES5"] = 1] = "ES5";
    ScriptTarget[ScriptTarget["ES2015"] = 2] = "ES2015";
    ScriptTarget[ScriptTarget["ES2016"] = 3] = "ES2016";
    ScriptTarget[ScriptTarget["ES2017"] = 4] = "ES2017";
    ScriptTarget[ScriptTarget["ES2018"] = 5] = "ES2018";
    ScriptTarget[ScriptTarget["ES2019"] = 6] = "ES2019";
    ScriptTarget[ScriptTarget["ES2020"] = 7] = "ES2020";
    ScriptTarget[ScriptTarget["ESNext"] = 99] = "ESNext";
    ScriptTarget[ScriptTarget["JSON"] = 100] = "JSON";
    ScriptTarget[ScriptTarget["Latest"] = 99] = "Latest";
})(ScriptTarget || (ScriptTarget = {}));
var ModuleResolutionKind;
(function (ModuleResolutionKind) {
    ModuleResolutionKind[ModuleResolutionKind["Classic"] = 1] = "Classic";
    ModuleResolutionKind[ModuleResolutionKind["NodeJs"] = 2] = "NodeJs";
})(ModuleResolutionKind || (ModuleResolutionKind = {}));
//#endregion
var languageDefaultOptions = {
    javascript: {
        compilerOptions: { allowNonTsExtensions: true, allowJs: true, target: ScriptTarget.Latest },
        diagnosticsOptions: { noSemanticValidation: true, noSyntaxValidation: false },
    },
    typescript: {
        compilerOptions: { allowNonTsExtensions: true, target: ScriptTarget.Latest },
        diagnosticsOptions: { noSemanticValidation: false, noSyntaxValidation: false }
    }
};
var languageDefaults = {};
function setupLanguageServiceDefaults(languageId, isTypescript) {
    var languageOptions = languageDefaultOptions[isTypescript ? "typescript" : "javascript"];
    languageDefaults[languageId] = new LanguageServiceDefaultsImpl(languageId, languageOptions.compilerOptions, languageOptions.diagnosticsOptions);
}
setupNamedLanguage({
    id: 'typescript',
    extensions: ['.ts', '.tsx'],
    aliases: ['TypeScript', 'ts', 'typescript'],
    mimetypes: ['text/typescript']
}, true, true);
setupNamedLanguage({
    id: 'javascript',
    extensions: ['.js', '.es6', '.jsx'],
    firstLine: '^#!.*\\bnode',
    filenames: ['jakefile'],
    aliases: ['JavaScript', 'javascript', 'js'],
    mimetypes: ['text/javascript'],
}, false, true);
function getTypeScriptWorker() {
    return getLanguageWorker("typescript");
}
function getJavaScriptWorker() {
    return getLanguageWorker("javascript");
}
function getLanguageWorker(languageName) {
    return getMode().then(function (mode) { return mode.getNamedLanguageWorker(languageName); });
}
function getLanguageDefaults(languageName) {
    return languageDefaults[languageName];
}
function setupNamedLanguage(languageDefinition, isTypescript, registerLanguage) {
    if (registerLanguage) {
        monaco.languages.register(languageDefinition);
        var langageConfig = isTypescript ? tsDefinitions : jsDefinitions;
        monaco.languages.setMonarchTokensProvider(languageDefinition.id, langageConfig.language);
        monaco.languages.setLanguageConfiguration(languageDefinition.id, langageConfig.conf);
    }
    setupLanguageServiceDefaults(languageDefinition.id, isTypescript);
    monaco.languages.onLanguage(languageDefinition.id, function () {
        return getMode().then(function (mode) { return mode.setupNamedLanguage(languageDefinition.id, isTypescript, languageDefaults[languageDefinition.id]); });
    });
}
// Export API
function createAPI() {
    return {
        ModuleKind: ModuleKind,
        JsxEmit: JsxEmit,
        NewLineKind: NewLineKind,
        ScriptTarget: ScriptTarget,
        ModuleResolutionKind: ModuleResolutionKind,
        typescriptDefaults: getLanguageDefaults("typescript"),
        javascriptDefaults: getLanguageDefaults("javascript"),
        typescriptVersion: typescriptVersion,
        getLanguageDefaults: getLanguageDefaults,
        getTypeScriptWorker: getTypeScriptWorker,
        getJavaScriptWorker: getJavaScriptWorker,
        getLanguageWorker: getLanguageWorker,
        setupNamedLanguage: setupNamedLanguage
    };
}
monaco.languages.typescript = createAPI();
// --- Registration to monaco editor ---
function getMode() {
    return import('./tsMode');
}
