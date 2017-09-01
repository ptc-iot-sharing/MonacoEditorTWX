// @ts-nocheck
/* global TW:false, ThingworxInvoker: false, monaco:false, require:false, $:false*/
if (!TW.monacoEditor) {
    TW.monacoEditor = {};
}
TW.monacoEditor.editorLibs = {
    serviceLibs: [],
    // libs in here follow the following format:
    // {entityId, entityType, disposable}
    entityCollectionLibs: {},
    entityCollection: undefined
};

// avalible options: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditoroptions.html
TW.monacoEditor.defaultEditorSettings = {
    editor: {
        showFoldingControls: "mouseover",
        folding: true,
        fontSize: 12,
        fontFamily: "Fira Code,Monaco,monospace",
        fontLigatures: true,
        mouseWheelZoom: true,
        formatOnPaste: true,
        scrollBeyondLastLine: true,
        theme: "vs"
    },
    diffEditor: {},
    thingworx: {
        showGenericServices: false
    }
};
TW.monacoEditor.initializedDefaults = false;

/**
 * Called when the extension is asked to insert a code snippet via the snippets.
 * We make sure that we also have an undo stack here
 * @param  {string} code code to be inserted into the editor
 */
TW.jqPlugins.twCodeEditor.prototype.insertCode = function (code) {
    var thisPlugin = this;
    var op = {
        range: thisPlugin.monacoEditor.getSelection(),
        text: code,
        forceMoveMarkers: true
    };
    thisPlugin.monacoEditor.executeEdits("insertSnippet", [op]);
};

/**
 * Build the html for the code editor. Called by other thingworx widgets. 
 * Only returns a div where the monaco editor goes
 */
TW.jqPlugins.twCodeEditor.prototype._plugin_afterSetProperties = function () {
    this._plugin_cleanup();
    var thisPlugin = this;
    var jqEl = thisPlugin.jqElement;
    jqEl.html(
        "<div class=\"editor-container\" >" +
        "</div>"
    );

};

/**
 * Properly dispose the editor when needed. This is called by the thingworx editor when the editor closes or opens
 */
TW.jqPlugins.twCodeEditor.prototype._plugin_cleanup = function () {
    var thisPlugin = this;
    try {
        if (thisPlugin.monacoEditor !== undefined) {
            window.removeEventListener("resize", thisPlugin.updateContainerSize.bind(thisPlugin));
            if (thisPlugin.monacoEditor.getModel()) {
                thisPlugin.monacoEditor.getModel().dispose();
            }
            thisPlugin.monacoEditor.dispose();
        }
    } catch (err) {
        TW.log.error("Failed to destory the monaco editor", err);
    }
    this.monacoEditor = undefined;
    thisPlugin.jqElement.off(".twCodeEditor");
};

/**
 * Called when move from fullscreen or to fullscreen.
 * @param {int} height The height of the editor.
 */
TW.jqPlugins.twCodeEditor.prototype.setHeight = function (height) {
    var jqEl = this.jqElement;
    var container = jqEl.find(".editor-container");
    container.height(height);
    this.updateContainerSize();
};

/**
 * Overriden method from the twServiceEditor. We do this because in our version, the footer has absolute positoning.
 * Because of this, it does not need to be taken into cosideration when calculating sizes for the editor
 * Also, we must increase the size of the targetBodyHt from 360 to 535
 */
TW.jqPlugins.twServiceEditor.prototype.resize = function (includeCodeEditor) {
    var thisPlugin = this;
    var serviceDefinitionBody;
    var detailsEl;
    var targetBodyHt = 535;

    if (thisPlugin.properties.isFullScreen) {
        detailsEl = thisPlugin.detachedExpandCollapseContent;
        var fullscreenContainer = thisPlugin.detachedExpandCollapseContent.closest(".full-tab-div");
        var fullscreenTitle = fullscreenContainer.find(".popover-title");
        var fullscreenFooter = fullscreenContainer.find(".inline-footer");
        if (fullscreenContainer.length > 0) {
            targetBodyHt = (fullscreenContainer.innerHeight() - fullscreenTitle.outerHeight() - 10);
        }
        if (thisPlugin.properties.readOnly) {
            targetBodyHt = (fullscreenContainer.innerHeight() - fullscreenTitle.outerHeight() - 10);
        }
    } else {
        detailsEl = thisPlugin.detailsElem;
    }
    serviceDefinitionBody = detailsEl.find(".inline-body");
    serviceDefinitionBody.height(targetBodyHt);

    var serviceTabContent = detailsEl.find(".script-editor-tab-content");
    var inlineServiceTabHeight = detailsEl.find(".io-code-tabs");

    serviceTabContent.outerHeight(targetBodyHt - inlineServiceTabHeight.outerHeight());

    var navTabsHt;
    var navTabs = detailsEl.find(".nav-tabs");
    if (navTabs.length > 0) {
        navTabsHt = navTabs.outerHeight(true);
    }
    var bodyHt = serviceDefinitionBody.innerHeight();
    if (includeCodeEditor) {
        thisPlugin.scriptCodeElem.twCodeEditor("setHeight", bodyHt - serviceDefinitionBody.find(".script-editor-header").outerHeight() - 10);
    }
};

/**
 * Makes the monaco editor layout again
 */
TW.jqPlugins.twCodeEditor.prototype.updateContainerSize = function () {
    if (this.monacoEditor) {
        this.monacoEditor.layout();
    }
};

/**
 * Scrolls code to a certain location. This is not really used, but we implement it anyhow
 */
TW.jqPlugins.twCodeEditor.prototype.scrollCodeTo = function (x, y) {
    var thisPlugin = this;
    if (thisPlugin.monacoEditor) {
        thisPlugin.monacoEditor.revealPositionInCenter({
            lineNumber: (x || 0),
            column: (y || 0)
        });
    }
};

/**
 * Checks the syntax of the underlying code using a server based method
 */
TW.jqPlugins.twCodeEditor.prototype.checkSyntax = function (showSuccess, callback, btnForPopover) {
    var thisPlugin = this;
    var jqEl = thisPlugin.jqElement;
    var btn = jqEl.find("button[cmd=\"syntax-check\"]");
    if (btnForPopover !== undefined) {
        btn = btnForPopover;
    }
    var invoker = new ThingworxInvoker({
        entityType: "Resources",
        entityName: "ScriptServices",
        characteristic: "Services",
        target: "CheckScript",
        apiMethod: "post",
        parameters: {
            script: thisPlugin.properties.handler === "TypeScript" ? thisPlugin.properties.javascriptCode : thisPlugin.properties.code
        }
    });

    invoker.invokeService(
        function (invoker) {
            var resultInfo = invoker.result.rows[0];
            if (resultInfo.status === true) {
                if (showSuccess) {
                    TW.IDE.twPopoverNotification("info", btn, TW.IDE.I18NController.translate("tw.code-editor.editor.syntax-check-passed"));
                }
                if (callback !== undefined) {
                    callback(true);
                }
            } else {
                // 	"missing ( before condition at line 6 column 2 source: [if]"
                TW.IDE.twPopoverNotification("warning", btn, TW.IDE.I18NController.translate("tw.code-editor.editor.syntax-check-failed", { syntaxCheckFail: resultInfo.message }));

                // NOTE: got to learn the regex stuff ... this code is ridiculous :)

                var lineNoText = resultInfo.message.indexOf(" at line ");
                if (lineNoText > 0) {
                    var linePlusText = resultInfo.message.substring(lineNoText + " at line ".length);
                    var firstSpace = linePlusText.indexOf(" ");
                    var line = parseInt(linePlusText.substring(0, firstSpace));
                    var columnNo = linePlusText.indexOf(" column ");
                    var columnPlusText = linePlusText.substring(columnNo + " column ".length);
                    firstSpace = columnPlusText.indexOf(" ");
                    var column = parseInt(columnPlusText.substring(0, firstSpace));
                    thisPlugin.myCodeMirror.setCursor(line - 1, column);
                    thisPlugin.myCodeMirror.focus();
                    if (callback !== undefined) {
                        callback(false);
                    }
                }
            }
        },
        function (invoker, xhr) {
            TW.IDE.twPopoverNotification("error", btn, TW.IDE.I18NController.translate("tw.code-editor.editor.syntax-evaluation-error", { syntaxEvalError1: xhr.status, syntaxEvalError2: xhr.responseText }));
            TW.log.error("CheckScript failed unexpectedly status:" + xhr.status + ", message: " + xhr.responseText);
            if (callback !== undefined) {
                callback(false);
            }
        }
    );

};

/**
 * Initilizes a new code mirror. This takes care of the contidion that 
 * we must create the monaco editor only once.
 */
TW.jqPlugins.twCodeEditor.prototype.showCodeProperly = function () {
    var thisPlugin = this;
    var jqEl = thisPlugin.jqElement;
    var monacoEditorLibs = TW.monacoEditor.editorLibs;
    var defaultEditorSettings = TW.monacoEditor.defaultEditorSettings;
    var codeTextareaElem = jqEl.find(".editor-container");
    var Utilities = TW.monacoEditor.utilities;
    // A list of all the entity collections avalible in TWX. Datashapes and Resources are not included
    var entityCollections = ["ApplicationKeys", "Authenticators", "Bindings", "Blogs", "ContentCrawlers", "Dashboards",
        "DataAnalysisDefinitions", "DataTables", "DataTags", "ModelTags", "DirectoryServices", "Groups", "LocalizationTables",
        "Logs", "Mashups", "MediaEntities", "Menus", "Networks", "Organizations", "Permissions", "Projects", "StateDefinitions", "Streams",
        "StyleDefinitions", "Subsystems", "Things", "ThingTemplates", "ThingShapes", "Users", "ValueStreams", "Wikis"
    ];

    // make sure that the key events stay inside the editor.
    codeTextareaElem.on("keydown.twCodeEditor keypress.twCodeEditor keyup.twCodeEditor", function (e) {
        e.stopPropagation();
    });
    // make sure the textArea will strech, but have a minimum height
    codeTextareaElem.height("100%");
    codeTextareaElem.css("min-height", (thisPlugin.height || 535) + "px");
    if (codeTextareaElem.find(".monaco-editor").length > 0 && thisPlugin.monacoEditor !== undefined) {
        // already done, don't init the editor again
        return;
    }
    // handle the different modes. For sql, we also need to hide the syntax check button
    var mode;
    switch (thisPlugin.properties.handler) {
        case "SQLCommand":
        case "SQLQuery":
            mode = "sql";
            break;
        case "TypeScript":
            mode = "twxTypescript";
            break;
        case "Script":
            mode = "twxJavascript";
            break;
        // experimental stuff from James Mccuen
        case "Python":
            mode = "python";
            break;
        case "R":
            mode = "r";
            break;
    }

    // root of where the entire vs folder is
    var extRoot = "/Thingworx/Common/extensions/MonacoScriptEditor/ui/monacoScriptEditor";
    // configure AMD require module
    require.config({
        paths: {
            "vs": extRoot + "/vs"
        }
    });
    // begin to init our editor
    require(["vs/editor/editor.main"], function () {
        // get the service model from the parent twService editor
        var parentServiceEditorJqEl = jqEl.closest("tr").prev();
        if (!parentServiceEditorJqEl) {
            return;
        }
        var parentPluginType = parentServiceEditorJqEl.attr("tw-jqPlugin");
        // if the parent service editor is not available then don't go further
        if (!parentServiceEditorJqEl[parentPluginType]) {
            return;
        }
        var serviceModel = parentServiceEditorJqEl[parentPluginType]("getAllProperties");
        // there are cases where showCodeProperly is called, but no properties are yet set.
        // there are cases where the parent twServiceEditor doesn't have a model set
        // just exit in those cases
        if (!thisPlugin.properties || !serviceModel || !serviceModel.model) {
            return;
        }
        // the code comes from the plugin properties
        var codeValue = thisPlugin.properties.code;
        // if the editor is javascript, then we need to init the compiler, and generate models
        if (!TW.monacoEditor.initializedDefaults) {
            try {
                defaultEditorSettings = JSON.parse(TW.IDE.synchronouslyLoadPreferenceData("MONACO_EDITOR_SETTINGS"));
                if (defaultEditorSettings.editor.theme) {
                    monaco.editor.setTheme(defaultEditorSettings.editor.theme);
                }
            } catch (e) {
                TW.log.warn("Failed to load settings from preferences. Using defaults");
            }
            $.get(extRoot + "/configs/confSchema.json", function (data) {
                // text formatting 
                monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
                    schemas: [{
                        uri: "http://monaco-editor/schema.json",
                        schema: data,
                        fileMatch: ["*"]
                    }],
                    validate: true
                });
            });
        }
        if (mode === "twxJavascript" || mode === "twxTypescript") {
            // if this is the first initalization attempt, then set the compiler options and load the custom settings
            if (!TW.monacoEditor.initializedDefaults) {
                try {
                    // create a new language called twxJavascript
                    monaco.languages.typescript.setupNamedLanguage({ id: "twxJavascript" }, false);
                    // create a new language called twxTypescript
                    monaco.languages.typescript.setupNamedLanguage({ id: "twxTypescript" }, true);
                } catch (e) {
                    alert("There was an error initializing monaco. Please clean the browser cache.");
                    throw e;
                }
                TW.monacoEditor.scriptManager = new TW.monacoEditor.workerScriptManager(monaco.languages.typescript.getLanguageDefaults("twxTypescript"),
                    monaco.languages.typescript.getLanguageDefaults("twxJavascript"));
                // set the compiler options
                TW.monacoEditor.scriptManager.setCompilerOptions({
                    target: monaco.languages.typescript.ScriptTarget.ES5,
                    allowNonTsExtensions: true,
                    noLib: true
                });
                // register the rhino es5 library
                TW.monacoEditor.scriptManager.addRemoteExtraLib(extRoot + "/configs/lib.rhino.es5.d.ts", "lib.rhino.es5.d.ts");
                // register the thingworx base types and the logger class
                TW.monacoEditor.scriptManager.addRemoteExtraLib(extRoot + "/configs/declarations/ThingworxBaseTypes.d.ts", "ThingworxBaseTypes.d.ts");
                // register the thingworx datashape library
                TW.monacoEditor.scriptManager.addRemoteExtraLib(extRoot + "/configs/declarations/ThingworxDataShape.d.ts", "ThingworxDataShape.d.ts");
                generateDataShapeDefs();
                generateScriptFunctions();
                generateResourceFunctions();
                registerEntityCollectionDefs();
                // generate the completion for language snippets
                Utilities.loadSnippets(extRoot + "/configs/javascriptSnippets.json").then(function (snippets) {
                    monaco.languages.registerCompletionItemProvider("twxJavascript", {
                        provideCompletionItems: function (model, position) {
                            return snippets;
                        }
                    });
                });
                Utilities.loadSnippets(extRoot + "/configs/typescriptSnippets.json").then(function (snippets) {
                    monaco.languages.registerCompletionItemProvider("twxTypescript", {
                        provideCompletionItems: function (model, position) {
                            return snippets;
                        }
                    });
                });

                // generate the completion for twx snippets
                Utilities.loadSnippets(extRoot + "/configs/thingworxJavascriptSnippets.json").then(function (snippets) {
                    monaco.languages.registerCompletionItemProvider("twxJavascript", {
                        provideCompletionItems: function (model, position) {
                            return snippets;
                        }
                    });
                });
                Utilities.loadSnippets(extRoot + "/configs/thingworxTypescriptSnippets.json").then(function (snippets) {
                    monaco.languages.registerCompletionItemProvider("twxTypescript", {
                        provideCompletionItems: function (model, position) {
                            return snippets;
                        }
                    });
                });

                // generate the regex that matches the autocomplete for the entity collection
                var entityMatchCompleteRegex = new RegExp("(" + entityCollections.join("|") + ")\\[['\"]([^'\"\\]]*)$");
                // this handles on demand code completion for Thingworx entity names
                monaco.languages.registerCompletionItemProvider(["twxJavascript", "twxTypescript"], {
                    triggerCharacters: ["[", "[\""],
                    provideCompletionItems: function (model, position) {
                        // find out if we are completing on a entity collection. Get the line until the current position
                        var textUntilPosition = model.getValueInRange(new monaco.Range(position.lineNumber, 1, position.lineNumber, position.column));
                        // matches if we have at the end of our line an entity definition. example: Things["gg"]
                        var match = textUntilPosition.match(entityMatchCompleteRegex);
                        if (match) {
                            // get metadata for this
                            var entityType = match[1];
                            var entitySearch = match[2];
                            // returns a  promise to the search
                            return Utilities.spotlightSearch(entityType, entitySearch).then(function (rows) {
                                var result = [];
                                for (var i = 0; i < rows.length; i++) {
                                    // generate the items list
                                    result.push({
                                        label: rows[i].name,
                                        kind: monaco.languages.CompletionItemKind.Field,
                                        documentation: rows[i].description,
                                        detail: "Entity type: " + rows[i].type
                                    });
                                }
                                return result;
                            });
                        }
                        return [];
                    }
                });
                // generate the regex that matches the autocomplete for the entity collection enties
                var entityMatchRegex = new RegExp("(" + entityCollections.join("|") + ")" + "\\[['\"]([^'\"]+?)['\"]\\]\\.?$");

                // this handles on demand code completion for Thingworx entities medadata
                monaco.languages.registerCompletionItemProvider(["twxJavascript", "twxTypescript"], {
                    triggerCharacters: ["]", "."],
                    provideCompletionItems: function (model, position) {
                        // find out if we are completing on a entity collection. Get the line until the current position
                        var textUntilPosition = model.getValueInRange(new monaco.Range(position.lineNumber, 1, position.lineNumber, position.column));
                        // matches if we have at the end of our line an entity definition. example: Things["gg"]
                        var match = textUntilPosition.match(entityMatchRegex);
                        if (match) {
                            // get metadata for this
                            var entityType = match[1];
                            var entityId = match[2];
                            var metadata = TW.IDE.getEntityMetaData(entityType, entityId);
                            if (metadata) {
                                // generate the typescript definition
                                var entityName = entityType + "" + sanitizeEntityName(entityId);
                                var entityTypescriptDef = generateTypeScriptDefinitions(metadata, entityName, true, true);
                                // if our definition is not yet added, then generate it
                                if (registerEntityDefinitionLibrary(entityTypescriptDef, entityType, entityId)) {
                                    registerEntityCollectionDefs();
                                }

                            }
                        }
                        return [];
                    }
                });

                TW.monacoEditor.initializedDefaults = true;
            }

            refreshMeDefinitions(serviceModel);
        }
        // modify the initial settions
        var editorSettings = $.extend({}, defaultEditorSettings.editor);
        editorSettings.language = mode;
        editorSettings.readOnly = !thisPlugin.properties.editMode;
        editorSettings.value = codeValue;

        var editor;
        // if we already have an editor (mostly because showCode properly is called too often by twx), then update it
        if (thisPlugin.monacoEditor) {
            editor = thisPlugin.monacoEditor;
            editor.updateOptions(editorSettings);
        } else {
            // else create a new one
            editor = monaco.editor.create(codeTextareaElem[0], editorSettings);
        }
        var initialCode = codeValue;

        // make the editor layout again on window resize
        window.addEventListener("resize", thisPlugin.updateContainerSize.bind(thisPlugin));

        if (mode === "twxJavascript" || mode === "twxTypescript") {
            // whenever the editor regains focus, we regenerate the first line (inputs defs) and me defs
            editor.onDidFocusEditorText(function () {
                // get the service model again
                var serviceModel = parentServiceEditorJqEl[parentPluginType]("getAllProperties");
                refreshMeDefinitions(serviceModel);
            });
        }
        var transpileTypeScript = function () {
            setTimeout(function () {
                monaco.languages.typescript.getLanguageWorker("twxTypescript")
                    .then(function (worker) {
                        // if there is an uri available
                        if (editor.getModel()) {
                            worker(editor.getModel().uri)
                                .then(function (client) {
                                    client.getEmitOutput(editor.getModel().uri.toString())
                                        .then(function (result) {
                                            thisPlugin.properties.javascriptCode = result.outputFiles[0].text;
                                        });
                                });
                        }
                    });
            }, 10);
        };
        if (mode === "twxTypescript") {
            transpileTypeScript();
        }
        // whenever the model changes, we need to also push the changes up to the other plugins
        editor.getModel().onDidChangeContent(function (e) {
            thisPlugin.properties.code = editor.getModel().getValue();
            if (mode === "twxTypescript") {
                transpileTypeScript();
            }
            thisPlugin.properties.change(thisPlugin.properties.code);
        });


        editor.layout();
        // action to enable generic services
        // clicks the cancel button, closing the service
        editor.addAction({
            id: "showGenericServices",
            label: "Toggle Generic Services",
            run: function (ed) {
                defaultEditorSettings.thingworx.showGenericServices = !defaultEditorSettings.thingworx.showGenericServices;
                TW.IDE.savePreferenceData("MONACO_EDITOR_SETTINGS", JSON.stringify(defaultEditorSettings));
                // get the service model again
                var serviceModel = parentServiceEditorJqEl[parentPluginType]("getAllProperties");
                refreshMeDefinitions(serviceModel);
            }
        });

        // Action triggered by CTRL+S
        // Clicks the save entity button 
        // add actions for editor
        editor.addAction({
            id: "saveCodeAction",
            label: "Save Service",
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
            keybindingContext: null,
            contextMenuGroupId: "service",
            contextMenuOrder: 1.5,
            run: function (ed) {
                // fake a click on the saveEntity button
                // TODO: this is hacky... there is no other way of executing the saveService on the twServiceEditor
                // if the service is new, click the done button instead
                if (serviceModel.isNew) {
                    var doneButton = findEditorButton(".done-btn");
                    doneButton.click();
                } else {
                    var saveEntityButton = findEditorButton(".save-entity-btn");
                    saveEntityButton.click();
                }
            }
        });

        // Action triggered by CTRL+Enter
        // Saves the service and closes it. Clicks the done button 
        if (findEditorButton(".done-btn").length > 0) {
            editor.addAction({
                id: "doneCodeAction",
                label: "Save and Close",
                keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
                keybindingContext: null,
                run: function (ed) {
                    // fake a click on the done button
                    // TODO: this is hacky... there is no other way of executing the saveService on the twServiceEditor
                    var doneButton = findEditorButton(".done-btn");
                    doneButton.click();
                }
            });
        }
        // Action triggered by Ctrl+Y
        // Opens the test service window. Does not save the service before
        editor.addAction({
            id: "testCodeAction",
            label: "Test Service",
            contextMenuGroupId: "service",
            contextMenuOrder: 1.5,
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_Y],
            keybindingContext: null,
            run: function (ed) {
                if (serviceModel.isNew) {
                    alert("This service has not been saved yet. Please save and then test.");
                } else {
                    serviceModel.testService();
                    // if we have no input parameters, just focus the execute button
                    if ($.isEmptyObject(serviceModel.serviceDefinition.parameterDefinitions)) {
                        var executeButton = TW.IDE.CurrentTab.contentView.find(".twPopoverDialog").find(".execute-btn");
                        // hacky here, but a service should never have more than 20 inputs
                        executeButton.attr({
                            "role": "button",
                            "tabindex": "20"
                        });
                        executeButton.keydown(function (e) {
                            var code = e.which;
                            // 13 = Return, 32 = Space
                            if ((code === 13) || (code === 32)) {
                                $(this).click();
                            }
                        });
                        executeButton.focus();
                    } else {
                        // focus the first input in the popup that opens
                        TW.IDE.CurrentTab.contentView.find(".twPopoverDialog").find(".std-input-container").find("input").first().focus();
                    }
                }
            }
        });
        // action triggered by CTRL+Backspace
        // clicks the cancel button, closing the service
        if (findEditorButton(".save-entity-btn").length > 0) {
            editor.addAction({
                id: "closeCodeAction",
                label: "Close Service",
                keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_Q],
                keybindingContext: null,
                run: function (ed) {
                    var cancelButton = findEditorButton(".cancel-btn");
                    cancelButton.click();
                }
            });
        }
        // action triggered by CTRL+K
        // shows a popup with a diff editor with the initial state of the editor
        // reuse the current model, so changes can be made directly in the diff editor
        editor.addAction({
            id: "viewDiffAction",
            label: "View Diff",
            contextMenuGroupId: "service",
            contextMenuOrder: 1.6,
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_K],
            keybindingContext: null,
            run: function (ed) {
                var originalModel = monaco.editor.createModel(initialCode, mode);
                var modifiedModel = ed.getModel();
                var diffEditor;

                TW.IDE.showModalDialog({
                    title: "Diff Editor",
                    show: function (popover) {
                        // hide the footer and the body because we show the editor directly in the popover
                        popover.find(".modal-footer, .modal-body").hide();
                        // make sure we make the popover big enough
                        popover.css({
                            margin: "0",
                            height: "85%",
                            width: "85%",
                            top: "5%",
                            left: "5%",
                            overflow: "hidden"
                        });
                        // make sure that the key events stay inside the editor.
                        popover.on("keydown keypress keyup", function (e) {
                            e.stopPropagation();
                        });
                        var editorSettings = $.extend(defaultEditorSettings.editor, defaultEditorSettings.diffEditor);
                        // create the diff editor
                        diffEditor = monaco.editor.createDiffEditor(popover[0], editorSettings);
                        diffEditor.setModel({
                            original: originalModel,
                            modified: modifiedModel
                        });
                        diffEditor.focus();
                    },
                    close: function () {
                        // dispose everything
                        diffEditor.dispose();
                        originalModel.dispose();
                    }
                });
            }
        });

        // action triggered by CTRL+~
        // shows a popup with a json configuration for the editor
        editor.addAction({
            id: "viewConfAction",
            label: "View Configuration",
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.US_BACKTICK],
            keybindingContext: null,
            run: function (ed) {
                var confEditor;
                TW.IDE.showModalDialog({
                    title: "Config Editor. Use Intellisense or check <a href='https://code.visualstudio.com/docs/getstarted/settings#_settings-and-security'>here</a> for available options.",
                    show: function (popover) {
                        // hide the footer and the body because we show the editor directly in the popover
                        popover.find(".modal-footer, .modal-body").hide();
                        // make sure we make the popover big enough
                        popover.css({
                            margin: "0",
                            height: "85%",
                            width: "85%",
                            top: "5%",
                            left: "5%",
                            overflow: "hidden"
                        });
                        // make sure that the key events stay inside the editor.
                        popover.on("keydown keypress keyup", function (e) {
                            e.stopPropagation();
                        });
                        // create the conf editor
                        var editorSettings = $.extend({}, defaultEditorSettings.editor);
                        // set the intial text to be the current config
                        editorSettings.value =
                            JSON.stringify(Utilities.flatten(defaultEditorSettings), null, "\t");

                        editorSettings.language = "json";
                        confEditor = monaco.editor.create(popover[0], editorSettings);
                        confEditor.focus();
                        // whenever the model changes, we need to also update the current editor, as well as other editors
                        confEditor.onDidChangeModelContent(function (e) {
                            try {
                                // if the json is valid, then set it on this editor as well as the editor behind
                                var expandedOptions = Utilities.unflatten(JSON.parse(confEditor.getModel().getValue()));
                                confEditor.updateOptions(expandedOptions.editor);
                                editor.updateOptions(expandedOptions.editor);
                                // theme has to be updated separately
                                if (defaultEditorSettings.editor.theme != expandedOptions.editor.theme) {
                                    monaco.editor.setTheme(expandedOptions.editor.theme);
                                }
                                defaultEditorSettings = expandedOptions;
                                TW.IDE.savePreferenceData("MONACO_EDITOR_SETTINGS", JSON.stringify(defaultEditorSettings));
                            } catch (e) {
                                return false;
                            }
                            return true;
                        });
                    },
                    close: function () {
                        // dispose everything
                        confEditor.dispose();
                        confEditor.dispose();
                    }
                });
            }
        });

        // shows a popup allowing you to configure the code styles
        editor.addAction({
            id: "changeTheme",
            label: "Change Theme",
            run: function (ed) {
                TW.IDE.showModalDialog({
                    title: "Editor Theme",
                    show: function (popover) {
                        // hide the footer and the body because we show the editor directly in the popover
                        popover.find(".modal-body").append("<div>\
							<select id=\"theme-picker\">\
								<option value=\"vs\">Visual Studio</option>\
								<option value=\"vs-dark\">Visual Studio Dark</option>\
								<option value=\"hc-black\">High Contrast Dark</option>\
							</select>\
						</div>");
                        $("#theme-picker").val(defaultEditorSettings.theme);

                        $("#theme-picker").change(function () {
                            if (editor) {
                                monaco.editor.setTheme(this.value);
                            }
                        });
                    },
                    close: function () {
                        defaultEditorSettings.editor.theme = $("#theme-picker").val();
                        TW.IDE.savePreferenceData("MONACO_EDITOR_SETTINGS", JSON.stringify(defaultEditorSettings));
                    }
                });
            }
        });
        editor.focus();
        thisPlugin.monacoEditor = editor;
    });

    /**
     * Refreshes the definitions related to the me context
     */
    function refreshMeDefinitions(serviceModel) {
        var meThingModel = serviceModel.model;
        // if we have a valid entity name and the effectiveShape is set
        if (meThingModel.id && meThingModel.attributes.effectiveShape) {
            var entityName = meThingModel.entityType + "" + sanitizeEntityName(meThingModel.id);
            // remove the previous definitions
            removeEditorLibs("serviceLibs");

            // we append an me in here, just in case the definition is already added by the autocomplete in another service
            var fileName = "thingworx/" + entityName + "Me.d.ts";
            monacoEditorLibs.serviceLibs.push(TW.monacoEditor.scriptManager.addExtraLib(generateTypeScriptDefinitions(
                meThingModel.attributes.effectiveShape, entityName, false, true), fileName));
            // in the current globals we have me declarations as well as input parameters
            monacoEditorLibs.serviceLibs.push(TW.monacoEditor.scriptManager.addExtraLib(generateServiceGlobals(
                serviceModel.serviceDefinition, entityName), "thingworx/currentGlobals.d.ts"));
        }
    }

    /**
     * Registers a typescript definiton in the extra serviceLibs
     * If it already exists, just returns
     */
    function registerEntityDefinitionLibrary(typescriptMetadata, entityType, entityId) {
        var entityName = entityType + "" + sanitizeEntityName(entityId);
        var defintionInfo = monacoEditorLibs.entityCollectionLibs[entityName];
        if (!defintionInfo) {
            monacoEditorLibs.entityCollectionLibs[entityName] = {
                disposable: TW.monacoEditor.scriptManager.addExtraLib(typescriptMetadata, "thingworx/" + entityName + ".d.ts"),
                entityId: entityId,
                entityType: entityType
            };
            return true;
        }
        return false;
    }

    /**
     * Declares the me object and the inputs of the service
     */
    function generateServiceGlobals(serviceMetadata, entityName) {
        var definition = "const me = new twx." + entityName + "." + entityName + "(); ";
        for (var key in serviceMetadata.parameterDefinitions) {
            if (!serviceMetadata.parameterDefinitions.hasOwnProperty(key)) continue;
            var inputDef = serviceMetadata.parameterDefinitions[key];
            definition += "var " + key + ": " + getTypescriptBaseType(inputDef) + "; ";
        }
        return definition;
    }

    /**
     * Generates a typescript class and namespace for a metadata.
     * @param  {} effectiveShapeMetadata The enity metadata as a standard object with info about the properties. This is what thingworx responds for a object metadata request
     * @param  {String} entityName The name of the entity that has this metadata
     * @param  {Boolean} isGenericMetadata Specifies where to take the services definitios for. This differes if we are on the "me" metadata, or on a generic metadata
     * @param  {Boolean} showGenericServices Include the generic services in the results
     * @return The typescript definitions generated using this metadata
     */
    function generateTypeScriptDefinitions(effectiveShapeMetadata, entityName, isGenericMetadata, showGenericServices) {
        // based on a module class declaration
        // https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-class-d-ts.html
        var namespaceDefinition = "declare namespace twx." + entityName + " {\n";
        var classDefinition = "export class " + entityName + " {\n constructor(); \n";

        // generate info retated to services
        var serviceDefs = effectiveShapeMetadata.serviceDefinitions;
        for (var key in serviceDefs) {
            if (!serviceDefs.hasOwnProperty(key)) continue;
            var userConfigShowGenericServices = TW.monacoEditor.defaultEditorSettings.thingworx.showGenericServices;
            if (!(showGenericServices && userConfigShowGenericServices) && TW.IDE.isGenericServiceName(key)) continue;
            // first create an interface for service params
            var service = serviceDefs[key];
            // metadata for the service parameters
            var serviceParamDefinition = "";
            var serviceParameterMetadata;
            if (isGenericMetadata) {
                serviceParameterMetadata = service.Inputs.fieldDefinitions;
            } else {
                serviceParameterMetadata = service.parameterDefinitions;
            }
            if (serviceParameterMetadata && Object.keys(serviceParameterMetadata).length > 0) {
                namespaceDefinition += "export interface " + service.name + "Params {\n";
                for (var parameterDef in serviceParameterMetadata) {
                    if (!serviceParameterMetadata.hasOwnProperty(parameterDef)) continue;
                    var inputDef = serviceParameterMetadata[parameterDef];

                    namespaceDefinition += "/** \n * " + inputDef.description +
                        (inputDef.aspects.dataShape ? ("  \n * Datashape: " + inputDef.aspects.dataShape) : "") + " \n */ \n " +
                        inputDef.name + (inputDef.aspects.isRequired ? "" : "?") + ":" + getTypescriptBaseType(inputDef) + ";\n";
                    // generate a nice description of the service params
                    serviceParamDefinition += "*     " + inputDef.name + ": " + getTypescriptBaseType(inputDef) +
                        (inputDef.aspects.dataShape ? (" datashape with " + inputDef.aspects.dataShape) : "") + " - " + inputDef.description + "\n ";
                }
                namespaceDefinition += "}\n";
            }
            var outputMetadata;
            if (isGenericMetadata) {
                outputMetadata = service.Outputs;
            } else {
                outputMetadata = service.resultType;
            }
            // now generate the service definition, as well as jsdocs
            classDefinition += "/** \n * Category: " + service.category + "\n * " + service.description +
                "\n * " + (serviceParamDefinition ? ("Params: \n " + serviceParamDefinition) : "\n") + " **/ \n " +
                service.name + "(" + (serviceParamDefinition ? ("params:" + entityName + "." + service.name + "Params") : "") +
                "): " + getTypescriptBaseType(outputMetadata) + ";\n";
        }

        // we handle property definitions here
        var propertyDefs = effectiveShapeMetadata.propertyDefinitions;
        for (var def in propertyDefs) {
            if (!propertyDefs.hasOwnProperty(def)) continue;

            var property = propertyDefs[def];
            // generate an export for each property
            classDefinition += "/** \n * " + property.description + " \n */" + "\n" + property.name + ":" + getTypescriptBaseType(property) + ";\n";
        }
        classDefinition = classDefinition + "}\n";

        namespaceDefinition = namespaceDefinition + classDefinition + "}\n";

        return "export as namespace twx." + entityName + ";\n" + namespaceDefinition;
    }

    /**
     * Removes all the temporary typescript definions with a category
     */
    function removeEditorLibs(category) {
        // remove the previous definitions
        for (var i = 0; i < monacoEditorLibs[category].length; i++) {
            // there should be two libraries here, one for javascript and one for typescript
            var node = TW.monacoEditor.editorLibs[category][i];
            if (node instanceof Array) {
                for (var j = 0; j < node.length; j++) {
                    node[j].dispose();
                }
            } else {
                TW.monacoEditor.editorLibs[category][i].dispose();
            }
        }
        TW.monacoEditor.editorLibs[category] = [];
    }
    /**
     * Retuns a button on the button toolbar with a certain name.
     * If the button is not found, it returns null
     */
    function findEditorButton(buttonName) {
        // find the visible button
        var button = thisPlugin.jqElement.closest("tr").find(buttonName + ":visible");
        // we must be in fullscreen, try to find the button elsewhere
        if (button.length === 0) {
            button = thisPlugin.jqElement.closest(".inline-body").next().find(buttonName + ":visible");
        }
        return button;
    }

    /**
     * Generate typescript definitions for the script library functions
     */
    function generateScriptFunctions() {
        TW.IDE.getScriptFunctionLibraries(false, function (scriptFunctions) {
            var result = "";
            // iterate through all the script functions libraries
            for (var key in scriptFunctions) {
                if (!scriptFunctions.hasOwnProperty(key)) continue;
                // iterate through all the functiond definitions
                var scriptLibrary = scriptFunctions[key].details.functionDefinitions;
                for (var def in scriptLibrary) {
                    if (!scriptLibrary.hasOwnProperty(def)) continue;
                    var functionDef = scriptLibrary[def];
                    // generate in paralel both the jsdoc as well as the function declaration
                    var jsDoc = "/**\n * " + functionDef.description;
                    var declaration = "declare function " + functionDef.name + "(";
                    for (var i = 0; i < functionDef.parameterDefinitions.length; i++) {
                        jsDoc += "\n * @param " + functionDef.parameterDefinitions[i].name + "  " + functionDef.parameterDefinitions[i].description;
                        declaration += functionDef.parameterDefinitions[i].name + ": " + getTypescriptBaseType(functionDef.parameterDefinitions[i]);
                        // add a comma between the parameters
                        if (i < functionDef.parameterDefinitions.length - 1) {
                            declaration += ", ";
                        }
                    }
                    // add the return info
                    jsDoc += "\n * @return " + functionDef.resultType.description + " \n **/";
                    declaration += "):" + getTypescriptBaseType(functionDef.resultType);
                    result += "\n" + jsDoc + "\n" + declaration + ";";
                }
            }
            TW.monacoEditor.scriptManager.addExtraLib(result, "thingworx/scriptFunctions.d.ts");
        });
    }

    /**
     * Generates typescript interfaces from all thingworx datashapes
     */
    function generateDataShapeDefs() {
        Utilities.getDataShapeDefinitons().then(function (dataShapes) {
            addDataShapesAsInterfaces(dataShapes);
            addDatashapesCollection(dataShapes);
        }, function (reason) {
            TW.log.error("Failed to generate typescript definitions from datashapes " + reason);
        });
    }

    /**
     * Generate typescript defs for all the datashapes in the system.
     */
    function addDatashapesCollection(dataShapes) {
        var datashapesDef = "declare namespace twx {\n";
        datashapesDef += "interface DataShapes {\n";
        // iterate through all the datashapes
        for (var i = 0; i < dataShapes.length; i++) {
            var datashape = dataShapes[i];
            // generate the metadata for this resource
            var validEntityName = sanitizeEntityName(datashape.name);
            datashapesDef += "/**\n * " + datashape.description + " \n**/\n";
            datashapesDef += "    '" + datashape.name + "': twx.ds<twx.ds." + validEntityName + ">;\n";
        }
        datashapesDef += "}\n}\n var DataShapes: twx.DataShapes;";
        TW.monacoEditor.scriptManager.addExtraLib(datashapesDef, "thingworx/DataShapes.d.ts");
    }

    /**
     * Generate a typescript lib with all the datashapes as interfaces
     */
    function addDataShapesAsInterfaces(dataShapes) {
        // declare the namespace
        var dataShapeTs = "export as namespace twx.ds;\n";
        dataShapeTs += "declare namespace twx.ds { \n";
        for (var i = 0; i < dataShapes.length; i++) {
            var datashape = dataShapes[i];
            // description as jsdoc
            dataShapeTs += "\t/**\n\t *" + datashape.description + "\n\t*/\n";
            dataShapeTs += "\texport interface " + sanitizeEntityName(datashape.name) + " {\n";
            for (var j = 0; j < datashape.fieldDefinitions.rows.length; j++) {
                var fieldDef = datashape.fieldDefinitions.rows[j];
                // description as jsdoc
                dataShapeTs += "\t/**\n\t *" + fieldDef.description + "\n\t*/";
                // generate the definition of this field
                dataShapeTs += "\n\t'" + fieldDef.name + "'?:" + getTypescriptBaseType({
                    baseType: fieldDef.baseType,
                    aspects: {
                        dataShape: fieldDef.dataShape
                    }
                });
                dataShapeTs += ";\n";
            }
            dataShapeTs += "}\n\n";
        }
        dataShapeTs += "}\n";
        TW.monacoEditor.scriptManager.addExtraLib(dataShapeTs, "thingworx/DataShapeDefinitions.d.ts");
    }

    /**
     * Gets the typescript interface definiton from a thingworx defintion
     */
    function getTypescriptBaseType(definition) {
        if (definition.baseType != "INFOTABLE") {
            return "twx." + definition.baseType;
        } else {
            return "twx." + definition.baseType + (definition.aspects.dataShape ? ("<twx.ds." + sanitizeEntityName(definition.aspects.dataShape) + ">") : "");
        }
    }

    function generateResourceFunctions() {
        TW.IDE.getResources(false, function (resourceLibraries) {
            var resourcesDef = "declare namespace twx {\n";
            resourcesDef += "export interface ResourcesInterface {\n";
            // iterate through all the resources
            for (var key in resourceLibraries) {
                if (!resourceLibraries.hasOwnProperty(key)) continue;
                // generate the metadata for this resource
                var resourceLibrary = resourceLibraries[key].details;
                var validEntityName = sanitizeEntityName(key);
                var libraryName = "Resource" + validEntityName;
                var resourceDefinition = generateTypeScriptDefinitions(resourceLibrary, libraryName, true, false);
                TW.monacoEditor.scriptManager.addExtraLib(resourceDefinition, "thingworx/" + libraryName + ".d.ts");
                resourcesDef += "/**\n * " + resourceLibraries[key].description + " \n**/\n";
                resourcesDef += "    '" + key + "': twx." + libraryName + "." + libraryName + ";\n";
            }
            resourcesDef += "}\n}\n var Resources: twx.ResourcesInterface;";
            TW.monacoEditor.scriptManager.addExtraLib(resourcesDef, "thingworx/Resources.d.ts");
        });
    }
    /**
     * Sanitizes an entity name to be a valid javascript declaration
     */
    function sanitizeEntityName(entityName) {
        return entityName.replace(/^[^a-zA-Z_]+|[^a-zA-Z_0-9]+/g, "");
    }

    /**
     * Generate the collection definitions
     * Also adds the avalible entity definitons
     */
    function registerEntityCollectionDefs() {
        if (monacoEditorLibs.entityCollection) {
            monacoEditorLibs.entityCollection[0].dispose();
            monacoEditorLibs.entityCollection[1].dispose();
        }
        var entityCollectionsDefs = "declare namespace twx { \n";
        for (var i = 0; i < entityCollections.length; i++) {
            entityCollectionsDefs += "export interface " + entityCollections[i] + "Interface {\n";
            for (var typescriptDef in monacoEditorLibs.entityCollectionLibs) {
                if (!monacoEditorLibs.entityCollectionLibs.hasOwnProperty(typescriptDef)) continue;

                if (monacoEditorLibs.entityCollectionLibs[typescriptDef].entityType == entityCollections[i]) {
                    entityCollectionsDefs += "    '" + monacoEditorLibs.entityCollectionLibs[typescriptDef].entityId + "': twx." + typescriptDef + "." + typescriptDef + ";\n";
                }
            }
            // close the class declaration
            entityCollectionsDefs += "}\n";
        }
        // close the namespace declaration
        entityCollectionsDefs += "}\n";
        // now add all the entity collections
        for (var j = 0; j < entityCollections.length; j++) {
            entityCollectionsDefs += "var " + entityCollections[j] + ": twx." + entityCollections[j] + "Interface;\n";
        }

        monacoEditorLibs.entityCollection = TW.monacoEditor.scriptManager.addExtraLib(
            entityCollectionsDefs, "thingworx/entityCollections.d.ts");
    }
};

TW.monacoEditor.workerScriptManager = function (typescriptDefaults, javascriptDefaults) {
    this.setDefaults(typescriptDefaults, javascriptDefaults);
};

/**
 * Abstracts over the typescript and javascript workers in monaco
 */
TW.monacoEditor.workerScriptManager.prototype = {
    setDefaults: function (typescriptDefaults, javascriptDefaults) {
        this.typescriptDefaults = typescriptDefaults;
        this.javascriptDefaults = javascriptDefaults;
    },
    addExtraLib: function (code, name) {
        return [this.typescriptDefaults.addExtraLib(code, name), this.javascriptDefaults.addExtraLib(code, name)];
    },
    addRemoteExtraLib: function (location, name) {
        var self = this;
        $.get(location, function (data) {
            self.addExtraLib(data, name);
        });
    },
    setCompilerOptions: function (options) {
        this.typescriptDefaults.setCompilerOptions(options);
        this.javascriptDefaults.setCompilerOptions(options);
    }
};