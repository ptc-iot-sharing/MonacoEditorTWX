/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/
'use strict';
import * as ts from './lib/typescriptServices.js';
import { lib_dts, lib_es6_dts } from './lib/lib.js';
var DEFAULT_LIB = {
    NAME: 'defaultLib:lib.d.ts',
    CONTENTS: lib_dts
};
var ES6_LIB = {
    NAME: 'defaultLib:lib.es6.d.ts',
    CONTENTS: lib_es6_dts
};
export var CodeOutlineTokenKind;
(function (CodeOutlineTokenKind) {
    CodeOutlineTokenKind["Class"] = "Class";
    CodeOutlineTokenKind["ObjectLiteral"] = "ObjectLiteral";
    CodeOutlineTokenKind["Method"] = "Method";
    CodeOutlineTokenKind["Constructor"] = "Constructor";
    CodeOutlineTokenKind["Function"] = "Function";
    CodeOutlineTokenKind["Get"] = "Get";
    CodeOutlineTokenKind["Set"] = "Set";
})(CodeOutlineTokenKind || (CodeOutlineTokenKind = {}));
var TypeScriptWorker = /** @class */ (function () {
    function TypeScriptWorker(ctx, createData) {
        this._extraLibs = Object.create(null);
        this._languageService = ts.createLanguageService(this);
        this._ctx = ctx;
        this._compilerOptions = createData.compilerOptions;
        this._extraLibs = createData.extraLibs;
    }
    // --- language service host ---------------
    TypeScriptWorker.prototype.getCompilationSettings = function () {
        return this._compilerOptions;
    };
    TypeScriptWorker.prototype.getScriptFileNames = function () {
        var models = this._ctx.getMirrorModels().map(function (model) { return model.uri.toString(); });
        return models.concat(Object.keys(this._extraLibs));
    };
    TypeScriptWorker.prototype._getModel = function (fileName) {
        var models = this._ctx.getMirrorModels();
        for (var i = 0; i < models.length; i++) {
            if (models[i].uri.toString() === fileName) {
                return models[i];
            }
        }
        return null;
    };
    TypeScriptWorker.prototype.getScriptVersion = function (fileName) {
        var model = this._getModel(fileName);
        if (model) {
            return model.version.toString();
        }
        else if (this.isDefaultLibFileName(fileName)) {
            // default lib is static
            return '1';
        }
        else if (fileName in this._extraLibs) {
            return String(this._extraLibs[fileName].version);
        }
        return '';
    };
    TypeScriptWorker.prototype.getScriptSnapshot = function (fileName) {
        var text;
        var model = this._getModel(fileName);
        if (model) {
            // a true editor model
            text = model.getValue();
        }
        else if (fileName in this._extraLibs) {
            // extra lib
            text = this._extraLibs[fileName].content;
        }
        else if (fileName === DEFAULT_LIB.NAME) {
            text = DEFAULT_LIB.CONTENTS;
        }
        else if (fileName === ES6_LIB.NAME) {
            text = ES6_LIB.CONTENTS;
        }
        else {
            return;
        }
        return {
            getText: function (start, end) { return text.substring(start, end); },
            getLength: function () { return text.length; },
            getChangeRange: function () { return undefined; }
        };
    };
    TypeScriptWorker.prototype.getScriptKind = function (fileName) {
        var suffix = fileName.substr(fileName.lastIndexOf('.') + 1);
        switch (suffix) {
            case 'ts': return ts.ScriptKind.TS;
            case 'tsx': return ts.ScriptKind.TSX;
            case 'js': return ts.ScriptKind.JS;
            case 'jsx': return ts.ScriptKind.JSX;
            default: return this.getCompilationSettings().allowJs
                ? ts.ScriptKind.JS
                : ts.ScriptKind.TS;
        }
    };
    TypeScriptWorker.prototype.getCurrentDirectory = function () {
        return '';
    };
    TypeScriptWorker.prototype.getDefaultLibFileName = function (options) {
        // TODO@joh support lib.es7.d.ts
        return (options.target || ts.ScriptTarget.ES5) <= ts.ScriptTarget.ES5 ? DEFAULT_LIB.NAME : ES6_LIB.NAME;
    };
    TypeScriptWorker.prototype.isDefaultLibFileName = function (fileName) {
        return fileName === this.getDefaultLibFileName(this._compilerOptions);
    };
    // --- language features
    TypeScriptWorker.clearFiles = function (diagnostics) {
        // Clear the `file` field, which cannot be JSON'yfied because it
        // contains cyclic data structures.
        diagnostics.forEach(function (diag) {
            diag.file = undefined;
            var related = diag.relatedInformation;
            if (related) {
                related.forEach(function (diag2) { return diag2.file = undefined; });
            }
        });
    };
    TypeScriptWorker.prototype.getSyntacticDiagnostics = function (fileName) {
        var diagnostics = this._languageService.getSyntacticDiagnostics(fileName);
        TypeScriptWorker.clearFiles(diagnostics);
        return Promise.resolve(diagnostics);
    };
    TypeScriptWorker.prototype.getSemanticDiagnostics = function (fileName) {
        var diagnostics = this._languageService.getSemanticDiagnostics(fileName);
        TypeScriptWorker.clearFiles(diagnostics);
        return Promise.resolve(diagnostics);
    };
    TypeScriptWorker.prototype.getSuggestionDiagnostics = function (fileName) {
        var diagnostics = this._languageService.getSuggestionDiagnostics(fileName);
        TypeScriptWorker.clearFiles(diagnostics);
        return Promise.resolve(diagnostics);
    };
    TypeScriptWorker.prototype.getCompilerOptionsDiagnostics = function (fileName) {
        var diagnostics = this._languageService.getCompilerOptionsDiagnostics();
        TypeScriptWorker.clearFiles(diagnostics);
        return Promise.resolve(diagnostics);
    };
    TypeScriptWorker.prototype.getCompletionsAtPosition = function (fileName, position) {
        return Promise.resolve(this._languageService.getCompletionsAtPosition(fileName, position, undefined));
    };
    TypeScriptWorker.prototype.getCompletionEntryDetails = function (fileName, position, entry) {
        return Promise.resolve(this._languageService.getCompletionEntryDetails(fileName, position, entry, undefined, undefined, undefined));
    };
    TypeScriptWorker.prototype.getSignatureHelpItems = function (fileName, position) {
        return Promise.resolve(this._languageService.getSignatureHelpItems(fileName, position, undefined));
    };
    TypeScriptWorker.prototype.getQuickInfoAtPosition = function (fileName, position) {
        return Promise.resolve(this._languageService.getQuickInfoAtPosition(fileName, position));
    };
    TypeScriptWorker.prototype.getOccurrencesAtPosition = function (fileName, position) {
        return Promise.resolve(this._languageService.getOccurrencesAtPosition(fileName, position));
    };
    TypeScriptWorker.prototype.getDefinitionAtPosition = function (fileName, position) {
        return Promise.resolve(this._languageService.getDefinitionAtPosition(fileName, position));
    };
    TypeScriptWorker.prototype.getReferencesAtPosition = function (fileName, position) {
        return Promise.resolve(this._languageService.getReferencesAtPosition(fileName, position));
    };
    TypeScriptWorker.prototype.getNavigationBarItems = function (fileName) {
        return Promise.resolve(this._languageService.getNavigationBarItems(fileName));
    };
    TypeScriptWorker.prototype.getFormattingEditsForDocument = function (fileName, options) {
        return Promise.resolve(this._languageService.getFormattingEditsForDocument(fileName, options));
    };
    TypeScriptWorker.prototype.getFormattingEditsForRange = function (fileName, start, end, options) {
        return Promise.resolve(this._languageService.getFormattingEditsForRange(fileName, start, end, options));
    };
    TypeScriptWorker.prototype.getFormattingEditsAfterKeystroke = function (fileName, postion, ch, options) {
        return Promise.resolve(this._languageService.getFormattingEditsAfterKeystroke(fileName, postion, ch, options));
    };
    TypeScriptWorker.prototype.findRenameLocations = function (fileName, positon, findInStrings, findInComments, providePrefixAndSuffixTextForRename) {
        return Promise.resolve(this._languageService.findRenameLocations(fileName, positon, findInStrings, findInComments, providePrefixAndSuffixTextForRename));
    };
    TypeScriptWorker.prototype.getRenameInfo = function (fileName, positon, options) {
        return Promise.resolve(this._languageService.getRenameInfo(fileName, positon, options));
    };
    TypeScriptWorker.prototype.getEmitOutput = function (fileName) {
        return Promise.resolve(this._languageService.getEmitOutput(fileName));
    };
    TypeScriptWorker.prototype.getPropertiesOrAttributesOf = function (fileName, parentObjects) {
        var referencedEntities = {};
        parentObjects.forEach(function (key) { referencedEntities[key] = {}; });
        var program = this._languageService.getProgram();
        if (program) {
            var currentFile = program.getSourceFile(fileName);
            if (currentFile) {
                var typeChecker_1 = program.getTypeChecker();
                ts.forEachChild(currentFile, function visitNodes(node) {
                    if (ts.isPropertyAccessExpression(node) && referencedEntities[node.expression.getText()]) {
                        // Matches Things.test
                        if (!(node.name.text in referencedEntities[node.expression.getText()])) {
                            referencedEntities[node.expression.getText()][node.name.text] = true;
                        }
                    }
                    else if (ts.isElementAccessExpression(node) && referencedEntities[node.expression.getText()] && node.argumentExpression) {
                        if (node.argumentExpression.kind == ts.SyntaxKind.Identifier) {
                            if (node.expression.getText() == "Users" && node.argumentExpression.getText() == "principal") {
                                // a special case for Users[principal] => replace principal with "Administrator",
                                // since all users have the same properties and functions
                                referencedEntities["Users"]["System"] = true;
                            }
                        }
                        if (node.argumentExpression.kind == ts.SyntaxKind.PropertyAccessExpression) {
                            // matches Things[me.property]
                            var type = typeChecker_1.getTypeAtLocation(node.argumentExpression);
                            if ('value' in type) {
                                referencedEntities[node.expression.getText()][type["value"]] = true;
                            }
                        }
                        else if (ts.isStringLiteral(node.argumentExpression)) {
                            // matches Things["test"]
                            referencedEntities[node.expression.getText()][node.argumentExpression.getText().slice(1, -1)] = true;
                        }
                    }
                    ts.forEachChild(node, visitNodes);
                });
            }
        }
        return referencedEntities;
    };
    TypeScriptWorker.prototype.getOutline = function (fileName, parentObjects) {
        var tokens = [];
        var program = this._languageService.getProgram();
        if (program) {
            var currentFile_1 = program.getSourceFile(fileName);
            if (currentFile_1) {
                var ordinal_1 = 0;
                var indentation_1 = 0;
                var getEscapedTextOfIdentifierOrLiteral_1 = function (node) {
                    if (node) {
                        return node.kind === ts.SyntaxKind.Identifier ? node.escapedText : node.text;
                    }
                };
                var extractLiteral_1 = function (liternalNode) {
                    var _a;
                    var didExtractLiteral = false;
                    // Object literals should only be extracted if they have at least a method or any getter/setter
                    var methodCount = 0;
                    liternalNode.properties.forEach(function (property) {
                        switch (property.kind) {
                            case ts.SyntaxKind.MethodDeclaration:
                                methodCount++;
                                break;
                            case ts.SyntaxKind.GetAccessor:
                            case ts.SyntaxKind.SetAccessor:
                                didExtractLiteral = true;
                                break;
                            case ts.SyntaxKind.PropertyAssignment:
                                if (property.initializer &&
                                    (property.initializer.kind == ts.SyntaxKind.FunctionDeclaration || property.initializer.kind == ts.SyntaxKind.FunctionExpression)) {
                                    methodCount++;
                                }
                        }
                    });
                    if (methodCount > 0) {
                        didExtractLiteral = true;
                    }
                    if (didExtractLiteral) {
                        ordinal_1++;
                        var parentNode = liternalNode.parent;
                        // Compute the name for assignments, call expressions and others
                        var name_1 = '';
                        if (parentNode.kind == ts.SyntaxKind.VariableDeclaration || parentNode.kind == ts.SyntaxKind.PropertyAssignment) {
                            var parentNodeAsVariableDeclaration = parentNode;
                            name_1 = getEscapedTextOfIdentifierOrLiteral_1(parentNodeAsVariableDeclaration.name) || '';
                        }
                        else if (parentNode.kind == ts.SyntaxKind.CallExpression) {
                            var parentNodeAsCallExpression = parentNode;
                            name_1 = (parentNodeAsCallExpression.expression && parentNodeAsCallExpression.expression.getFullText().trim()) || '';
                            if (name_1) {
                                var nameTokens = name_1.split('\n');
                                name_1 = nameTokens[nameTokens.length - 1];
                                name_1 = name_1 + '()';
                            }
                        }
                        else if (parentNode.kind == ts.SyntaxKind.BinaryExpression) {
                            var parentNodeAsBinaryExpression = parentNode;
                            // Only handle these for assignments
                            var sign = parentNodeAsBinaryExpression.operatorToken;
                            if (ts.tokenToString(sign.kind) == '=') {
                                var left = parentNodeAsBinaryExpression.left;
                                var nameTokens = void 0;
                                switch (left.kind) {
                                    case ts.SyntaxKind.VariableDeclaration:
                                        var leftVariableDeclaration = left;
                                        name_1 = getEscapedTextOfIdentifierOrLiteral_1(leftVariableDeclaration.name) || '';
                                        break;
                                    case ts.SyntaxKind.PropertyAccessExpression:
                                        name_1 = left.getFullText().trim();
                                        nameTokens = name_1.split('\n');
                                        name_1 = nameTokens[nameTokens.length - 1];
                                        break;
                                }
                            }
                        }
                        tokens.push({
                            name: name_1 || '{}',
                            kind: CodeOutlineTokenKind.ObjectLiteral,
                            ordinal: ordinal_1,
                            line: ((_a = currentFile_1) === null || _a === void 0 ? void 0 : _a.getLineAndCharacterOfPosition(liternalNode.getStart()).line) || 0,
                            indentAmount: indentation_1
                        });
                    }
                    return didExtractLiteral;
                };
                var extractClass_1 = function (classNode) {
                    var _a, _b;
                    ordinal_1++;
                    if (classNode.name) {
                        tokens.push({
                            name: getEscapedTextOfIdentifierOrLiteral_1(classNode.name) || "",
                            kind: CodeOutlineTokenKind.Class,
                            ordinal: ordinal_1,
                            line: ((_a = currentFile_1) === null || _a === void 0 ? void 0 : _a.getLineAndCharacterOfPosition(classNode.getStart()).line) || 0,
                            indentAmount: indentation_1
                        });
                    }
                    else {
                        tokens.push({
                            name: '{}',
                            kind: CodeOutlineTokenKind.Class,
                            ordinal: ordinal_1,
                            line: ((_b = currentFile_1) === null || _b === void 0 ? void 0 : _b.getLineAndCharacterOfPosition(classNode.getStart()).line) || 0,
                            indentAmount: indentation_1
                        });
                    }
                };
                var extractMethod_1 = function (methodNode) {
                    var _a;
                    ordinal_1++;
                    var node = methodNode;
                    var line = ((_a = currentFile_1) === null || _a === void 0 ? void 0 : _a.getLineAndCharacterOfPosition(methodNode.getStart()).line) || 0;
                    var parentNode = methodNode.parent;
                    // isMethodKind is set to YES for function declarations whose parent is a property assignment
                    var isMethodKind = false;
                    // Compute the name for assignments
                    var name = '';
                    if (parentNode.kind == ts.SyntaxKind.PropertyAssignment) {
                        var parentNodeAsPropertyAssignment = parentNode;
                        name = getEscapedTextOfIdentifierOrLiteral_1(parentNodeAsPropertyAssignment.name) || '';
                        isMethodKind = true;
                    }
                    else if (parentNode.kind == ts.SyntaxKind.VariableDeclaration) {
                        var parentNodeAsVariableDeclaration = parentNode;
                        name = getEscapedTextOfIdentifierOrLiteral_1(parentNodeAsVariableDeclaration.name) || '';
                    }
                    else if (parentNode.kind == ts.SyntaxKind.CallExpression) {
                        var parentNodeAsCallExpression = parentNode;
                        name = (parentNodeAsCallExpression.expression && parentNodeAsCallExpression.expression.getFullText().trim()) || '';
                        if (name) {
                            var nameTokens = name.split('\n');
                            name = nameTokens[nameTokens.length - 1].trim();
                            name = name + '()';
                        }
                    }
                    else if (parentNode.kind == ts.SyntaxKind.BinaryExpression) {
                        // Only handle these for assignments
                        var parentNodeAsBinaryExpression = parentNode;
                        var sign = parentNodeAsBinaryExpression.operatorToken;
                        if (ts.tokenToString(sign.kind) == '=') {
                            var left = parentNodeAsBinaryExpression.left;
                            var nameTokens = void 0;
                            switch (left.kind) {
                                case ts.SyntaxKind.VariableDeclaration:
                                    var leftAsVariableDeclaration = left;
                                    name = getEscapedTextOfIdentifierOrLiteral_1(leftAsVariableDeclaration.name) || '';
                                    break;
                                case ts.SyntaxKind.PropertyAccessExpression:
                                    name = left.getFullText().trim();
                                    nameTokens = name.split('\n');
                                    name = nameTokens[nameTokens.length - 1].trim();
                                    break;
                            }
                        }
                    }
                    switch (methodNode.kind) {
                        case ts.SyntaxKind.Constructor:
                            tokens.push({
                                name: 'constructor ()',
                                kind: CodeOutlineTokenKind.Constructor,
                                ordinal: ordinal_1,
                                line: line,
                                indentAmount: indentation_1
                            });
                            break;
                        case ts.SyntaxKind.MethodDeclaration:
                            var nodeAsMethodDeclaration = node;
                            tokens.push({
                                name: getEscapedTextOfIdentifierOrLiteral_1(nodeAsMethodDeclaration.name) || '{}',
                                kind: CodeOutlineTokenKind.Method,
                                ordinal: ordinal_1,
                                line: line,
                                indentAmount: indentation_1
                            });
                            break;
                        case ts.SyntaxKind.FunctionExpression:
                        case ts.SyntaxKind.FunctionDeclaration:
                            var nodeAsFunctionDeclaration = node;
                            tokens.push({
                                name: getEscapedTextOfIdentifierOrLiteral_1(nodeAsFunctionDeclaration.name) || name || '{}',
                                kind: isMethodKind ? CodeOutlineTokenKind.Method : CodeOutlineTokenKind.Function,
                                ordinal: ordinal_1,
                                line: line,
                                indentAmount: indentation_1
                            });
                            break;
                        case ts.SyntaxKind.GetAccessor:
                            tokens.push({
                                name: getEscapedTextOfIdentifierOrLiteral_1(node.name) || '()',
                                kind: CodeOutlineTokenKind.Get,
                                ordinal: ordinal_1,
                                line: line,
                                indentAmount: indentation_1
                            });
                            break;
                        case ts.SyntaxKind.SetAccessor:
                            tokens.push({
                                name: getEscapedTextOfIdentifierOrLiteral_1(node.name) || '()',
                                kind: CodeOutlineTokenKind.Set,
                                ordinal: ordinal_1,
                                line: line,
                                indentAmount: indentation_1
                            });
                            break;
                        case ts.SyntaxKind.ArrowFunction:
                            tokens.push({
                                name: getEscapedTextOfIdentifierOrLiteral_1(node.name) || name || '() => {}',
                                kind: CodeOutlineTokenKind.Function,
                                ordinal: ordinal_1,
                                line: line,
                                indentAmount: indentation_1
                            });
                            break;
                        default:
                            break;
                    }
                };
                var buildOutline_1 = function (node) {
                    var didIndent = false;
                    switch (node.kind) {
                        case ts.SyntaxKind.ObjectLiteralExpression:
                            if (extractLiteral_1(node)) {
                                indentation_1 += 1;
                                didIndent = true;
                            }
                            break;
                        case ts.SyntaxKind.ClassExpression:
                        case ts.SyntaxKind.ClassDeclaration:
                            extractClass_1(node);
                            indentation_1 += 1;
                            didIndent = true;
                            break;
                        case ts.SyntaxKind.MethodDeclaration:
                        case ts.SyntaxKind.MethodSignature:
                        case ts.SyntaxKind.FunctionDeclaration:
                        case ts.SyntaxKind.FunctionExpression:
                        case ts.SyntaxKind.GetAccessor:
                        case ts.SyntaxKind.SetAccessor:
                        case ts.SyntaxKind.Constructor:
                        case ts.SyntaxKind.ArrowFunction:
                            extractMethod_1(node);
                            indentation_1 += 1;
                            didIndent = true;
                            break;
                        default:
                            break;
                    }
                    ts.forEachChild(node, buildOutline_1);
                    if (didIndent)
                        indentation_1 -= 1;
                };
                buildOutline_1(currentFile_1);
            }
        }
        return tokens;
    };
    TypeScriptWorker.prototype.getCodeFixesAtPosition = function (fileName, start, end, errorCodes, formatOptions) {
        var preferences = {};
        return Promise.resolve(this._languageService.getCodeFixesAtPosition(fileName, start, end, errorCodes, formatOptions, preferences));
    };
    TypeScriptWorker.prototype.updateExtraLibs = function (extraLibs) {
        this._extraLibs = extraLibs;
    };
    return TypeScriptWorker;
}());
export { TypeScriptWorker };
export function create(ctx, createData) {
    return new TypeScriptWorker(ctx, createData);
}
