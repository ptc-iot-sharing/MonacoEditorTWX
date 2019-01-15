import '../../editor/editor.api.js';
/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
import * as tsDefinitions from '../../basic-languages/typescript/typescript.js';
import * as jsDefinitions from '../../basic-languages/javascript/javascript.js';
var Emitter = monaco.Emitter;
// --- TypeScript configuration and defaults ---------
var LanguageServiceDefaultsImpl = /** @class */ (function () {
    function LanguageServiceDefaultsImpl(langualgeId, compilerOptions, diagnosticsOptions) {
        this._onDidChange = new Emitter();
        this._eagerExtraLibSync = true;
        this._extraLibs = Object.create(null);
        this._workerMaxIdleTime = 2 * 60 * 1000;
        this.setCompilerOptions(compilerOptions);
        this.setDiagnosticsOptions(diagnosticsOptions);
        this._languageId = langualgeId;
    }
    Object.defineProperty(LanguageServiceDefaultsImpl.prototype, "onDidChange", {
        get: function () {
            return this._onDidChange.event;
        },
        enumerable: true,
        configurable: true
    });
    LanguageServiceDefaultsImpl.prototype.getExtraLibs = function () {
        var result = Object.create(null);
        for (var key in this._extraLibs) {
            result[key] = this._extraLibs[key];
        }
        return Object.freeze(result);
    };
    LanguageServiceDefaultsImpl.prototype.addExtraLib = function (content, filePath) {
        var _this = this;
        if (typeof filePath === 'undefined') {
            filePath = "ts:extralib-" + Date.now();
        }
        if (this._extraLibs[filePath]) {
            this._extraLibs[filePath].version++;
            this._extraLibs[filePath].content = content;
        }
        else {
            this._extraLibs[filePath] = {
                content: content,
                version: 1
            };
        }
        if (this._eagerExtraLibSync) {
            this.syncExtraLibs();
        }
        return {
            dispose: function () {
                if (delete _this._extraLibs[filePath] && _this._eagerExtraLibSync) {
                    _this.syncExtraLibs();
                }
            }
        };
    };
    LanguageServiceDefaultsImpl.prototype.syncExtraLibs = function () {
        return __awaiter(this, void 0, void 0, function () {
            var worker, ignored_1, client, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 6, , 7]);
                        worker = void 0;
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, getLanguageWorker(this._languageId)];
                    case 2:
                        worker = _a.sent();
                        return [3 /*break*/, 4];
                    case 3:
                        ignored_1 = _a.sent();
                        return [2 /*return*/];
                    case 4: return [4 /*yield*/, worker("")];
                    case 5:
                        client = _a.sent();
                        client.syncExtraLibs(this._extraLibs);
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _a.sent();
                        console.error(error_1);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/];
                }
            });
        });
    };
    LanguageServiceDefaultsImpl.prototype.getCompilerOptions = function () {
        return this._compilerOptions;
    };
    LanguageServiceDefaultsImpl.prototype.setCompilerOptions = function (options) {
        this._compilerOptions = options || Object.create(null);
        this._onDidChange.fire(this);
    };
    LanguageServiceDefaultsImpl.prototype.getDiagnosticsOptions = function () {
        return this._diagnosticsOptions;
    };
    LanguageServiceDefaultsImpl.prototype.setDiagnosticsOptions = function (options) {
        this._diagnosticsOptions = options || Object.create(null);
        this._onDidChange.fire(this);
    };
    LanguageServiceDefaultsImpl.prototype.setMaximumWorkerIdleTime = function (value) {
        // doesn't fire an event since no
        // worker restart is required here
        this._workerMaxIdleTime = value;
    };
    LanguageServiceDefaultsImpl.prototype.getWorkerMaxIdleTime = function () {
        return this._workerMaxIdleTime;
    };
    LanguageServiceDefaultsImpl.prototype.setEagerModelSync = function (value) {
        // doesn't fire an event since no
        // worker restart is required here
        this._eagerModelSync = value;
    };
    LanguageServiceDefaultsImpl.prototype.getEagerModelSync = function () {
        return this._eagerModelSync;
    };
    LanguageServiceDefaultsImpl.prototype.setEagerExtraLibSync = function (value) {
        this._eagerExtraLibSync = value;
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
    ModuleKind[ModuleKind["ESNext"] = 6] = "ESNext";
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
    ScriptTarget[ScriptTarget["ESNext"] = 6] = "ESNext";
    ScriptTarget[ScriptTarget["JSON"] = 100] = "JSON";
    ScriptTarget[ScriptTarget["Latest"] = 6] = "Latest";
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
setupLanguageServiceDefaults("typescript", true);
setupLanguageServiceDefaults("javascript", false);
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
    return monaco.Promise.wrap(import('./tsMode'));
}
setupNamedLanguage({
    id: 'typescript',
    extensions: ['.ts', '.tsx'],
    aliases: ['TypeScript', 'ts', 'typescript'],
    mimetypes: ['text/typescript']
}, true);
setupNamedLanguage({
    id: 'javascript',
    extensions: ['.js', '.es6', '.jsx'],
    firstLine: '^#!.*\\bnode',
    filenames: ['jakefile'],
    aliases: ['JavaScript', 'javascript', 'js'],
    mimetypes: ['text/javascript'],
}, false);
