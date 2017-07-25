// @ts-nocheck
/* global TW:false, ThingworxInvoker: false, monaco:false, require:false, $:false*/
TW.jqPlugins.twCodeEditor.monacoEditorLibs = {
    serviceLibs: [],
    // libs in here follow the following format:
    // {entityId, entityType, disposable}
    entityCollectionLibs: {},
    entityCollection: undefined
};

// avalible options: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditoroptions.html
TW.jqPlugins.twCodeEditor.defaultEditorSettings = {
    editor: {
        showFoldingControls: "mouseover",
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

// converts a nested json into a flat json
TW.jqPlugins.twCodeEditor.flatten = function (data) {
    var result = {};
    function recurse(cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
            for (var i = 0, l = cur.length; i < l; i++)
                recurse(cur[i], prop + "[" + i + "]");
            if (l == 0)
                result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop + "." + p : p);
            }
            if (isEmpty && prop)
                result[prop] = {};
        }
    }
    recurse(data, "");
    return result;
};

// converts a flat json into a nested json
TW.jqPlugins.twCodeEditor.unflatten = function (data) {
    "use strict";
    if (Object(data) !== data || Array.isArray(data))
        return data;
    var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
        resultholder = {};
    for (var p in data) {
        var cur = resultholder,
            prop = "",
            m;
        while (m = regex.exec(p)) {
            cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
            prop = m[2] || m[1];
        }
        cur[prop] = data[p];
    }
    return resultholder[""] || resultholder;
};

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
 * Gets the metadata of all the datashapes in the system. Uses an imported service on the MonacoEditorHelper thing
 */
TW.jqPlugins.twCodeEditor.prototype.getDataShapeDefinitons = function () {
    var invokerSpec = {
        entityType: "Things",
        entityName: "MonacoEditorHelper",
        characteristic: "Services",
        target: "GetAllDataShapes",
        apiMethod: "post"
    };
    var invoker = new ThingworxInvoker(invokerSpec);
    return new monaco.Promise(function (c, e, p) {
        invoker.invokeService(
            function (invoker) {
                c(invoker.result.rows);
            },
            function (invoker, xhr) {
                e(invoker.result.rows);
            }
        );
    });
};

/**
 * Searches for enities in the platform using the spotlight search an retruns a new promise with the metadata
 * @param  {string} entityType Thingworx Entity Type. 
 * @param  {string} searchTerm The entity to search for. Only the prefix can be specified.
 */
TW.jqPlugins.twCodeEditor.prototype.spotlightSearch = function (entityType, searchTerm) {
    var invokerSpec = {
        entityType: "Resources",
        entityName: "SearchFunctions",
        characteristic: "Services",
        target: "SpotlightSearch",
        apiMethod: "post",
        parameters: {
            searchExpression: searchTerm + "*",
            withPermissions: false,
            isAscending: false,
            maxItems: 500,
            types: {
                // todo: proper fix for MediaEntities -> MediaEntity
                items: [entityType == "MediaEntities" ? "MediaEntity" : entityType.slice(0, -1)]
            },
            sortBy: "lastModifiedDate",
            searchDescriptions: true
        }
    };
    var invoker = new ThingworxInvoker(invokerSpec);
    return new monaco.Promise(function (c, e, p) {
        invoker.invokeService(
            function (invoker) {
                c(invoker.result.rows);
            },
            function (invoker, xhr) {
                e("failed to search" + invoker.result.rows);
            }
        );
    });
};

/**
 * Loads a json monaco snippet file and returns a promise
 *
 * @param  {string} filePath File to load
 */
TW.jqPlugins.twCodeEditor.prototype.loadSnippets = function (filePath) {
    return new monaco.Promise(function (c, e, p) {
        $.get(filePath, {}, c, "json").fail(e);
    }).then(function (data) {
        var result = [];
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                result.push({
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    label: data[key].prefix,
                    documentation: data[key].description,
                    insertText: {
                        value: data[key].body.join("\n")
                    }
                });
            }
        }
        return result;
    });
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
        console.log("Failed to destory the monaco editor", err);
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
 * Initilizes a new code mirror. This takes care of the contidion that 
 * we must create the monaco editor only once.
 */
TW.jqPlugins.twCodeEditor.prototype.showCodeProperly = function () {
    if (TW.jqPlugins.twCodeEditor.timeout) {
        window.clearTimeout(TW.jqPlugins.twCodeEditor.timeout);
    }
    TW.jqPlugins.twCodeEditor.timeout = setTimeout(TW.jqPlugins.twCodeEditor.initEditor.bind(this), 0);
};
/**
 * Initializes a new code mirror and registeres all the listeners
 */
TW.jqPlugins.twCodeEditor.initEditor = function () {
    var thisPlugin = this;
    var jqEl = thisPlugin.jqElement;
    var monacoEditorLibs = TW.jqPlugins.twCodeEditor.monacoEditorLibs;
    var defaultEditorSettings = TW.jqPlugins.twCodeEditor.defaultEditorSettings;
    var codeTextareaElem = jqEl.find(".editor-container");
    // A list of all the entity collections avalible in TWX. Datashapes and Resources are not included
    var entityCollections = ["ApplicationKeys", "Authenticators", "Bindings", "Blogs", "ContentCrawlers", "Dashboards",
        "DataAnalysisDefinitions", "DataTables", "DataTags", "ModelTags", "DirectoryServices", "Groups", "LocalizationTables",
        "Logs", "Mashups", "MediaEntities", "Menus", "Networks", "Organizations", "Permissions", "Projects", "StateDefinitions", "Streams",
        "StyleDefinitions", "Subsystems", "Things", "ThingTemplates", "ThingShapes", "Users", "ValueStreams", "Wikis"
    ];

    // make sure that the key events stay inside the editor.
    codeTextareaElem.on("keydown keypress keyup", function (e) {
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
    var mode = "thingworxJavascript";
    switch (thisPlugin.properties.handler) {
        case "SQLCommand":
        case "SQLQuery":
            mode = "sql";
            break;
        case "Script":
            break;
        case "Typescript":
            mode = "typescript";
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
        var parentPluginType = parentServiceEditorJqEl.attr("tw-jqPlugin");
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
        if (!TW.jqPlugins.twCodeEditor.initializedDefaults) {
            try {
                defaultEditorSettings = JSON.parse(TW.IDE.synchronouslyLoadPreferenceData("MONACO_EDITOR_SETTINGS"));
                if (defaultEditorSettings.editor.theme) {
                    monaco.editor.setThme(defaultEditorSettings.editor.theme);
                }
            } catch (e) {
                TW.log.log("Failed to load settings from preferences. Using defaults");
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
        if (mode === "thingworxJavascript") {
            // if this is the first initalization attempt, then set the compiler options and load the custom settings
            if (!TW.jqPlugins.twCodeEditor.initializedDefaults) {
                // compiler options
                monaco.languages.typescript.thingworxJavascriptDefaults.setCompilerOptions({
                    target: monaco.languages.typescript.ScriptTarget.ES5,
                    allowNonTsExtensions: true,
                    noLib: true
                });
                $.get(extRoot + "/configs/lib.rhino.es5.d.ts", function (data) {
                    // Register the es5 library
                    monaco.languages.typescript.thingworxJavascriptDefaults.addExtraLib(
                        data,
                        "lib.rhino.es5.d.ts"
                    );
                });
                loadStandardTypescriptDefs();
                $.get(extRoot + "/configs/ThingworxDataShape.d.ts", function (data) {
                    // Register the es5 library
                    monaco.languages.typescript.thingworxJavascriptDefaults.addExtraLib(
                        data,
                        "ThingworxDataShape.d.ts"
                    );
                });
                generateDataShapeDefs();
                generateScriptFunctions();
                generateResourceFunctions();
                registerEntityCollectionDefs();
                // generate the completion for snippets
                thisPlugin.loadSnippets(extRoot + "/configs/javascriptSnippets.json").then(function (snippets) {
                    monaco.languages.registerCompletionItemProvider("thingworxJavascript", {
                        provideCompletionItems: function (model, position) {
                            return snippets;
                        }
                    });
                });

                // generate the completion for twx snippets
                thisPlugin.loadSnippets(extRoot + "/configs/thingworxSnippets.json").then(function (snippets) {
                    monaco.languages.registerCompletionItemProvider("thingworxJavascript", {
                        provideCompletionItems: function (model, position) {
                            return snippets;
                        }
                    });
                });

                // generate the regex that matches the autocomplete for the entity collection
                var entityMatchCompleteRegex = new RegExp("(" + entityCollections.join("|") + ")" + "\\[['\"]([^'\"\\]]*)['\"]?");
                // this handles on demand code completion for Thingworx entity names
                monaco.languages.registerCompletionItemProvider("thingworxJavascript", {
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
                            return thisPlugin.spotlightSearch(entityType, entitySearch).then(function (rows) {
                                var result = [];
                                for (var i = 0; i < rows.length; i++) {
                                    // generate the items list
                                    result.push({
                                        label: rows[i].name,
                                        kind: monaco.languages.CompletionItemKind.Field,
                                        documentation: rows[i].description,
                                        detail: "Entity type: " + rows[i].type,
                                        insertText: rows[i].name.substring(entitySearch.length - 1)
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
                monaco.languages.registerCompletionItemProvider("thingworxJavascript", {
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

                TW.jqPlugins.twCodeEditor.initializedDefaults = true;
            }

            refreshMeDefinitions(serviceModel);
        }
        // modify the initial settions
        var editorSettings = $.extend({}, defaultEditorSettings.editor);
        editorSettings.language = mode;
        editorSettings.readOnly = !thisPlugin.properties.editMode;
        editorSettings.value = codeValue;

        var editor = monaco.editor.create(codeTextareaElem[0], editorSettings);
        var initialCode = codeValue;

        // make the editor layout again on window resize
        window.addEventListener("resize", thisPlugin.updateContainerSize.bind(thisPlugin));

        if (mode == "thingworxJavascript") {
            // whenever the editor regains focus, we regenerate the first line (inputs defs) and me defs
            editor.onDidFocusEditorText(function () {
                // get the service model again
                var serviceModel = parentServiceEditorJqEl[parentPluginType]("getAllProperties");
                refreshMeDefinitions(serviceModel);
            });
        }

        // whenever the model changes, we need to also push the changes up to the other plugins
        editor.onDidChangeModelContent(function (e) {
            thisPlugin.properties.code = editor.getModel().getValue();
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
        // shows a popup with a diff editor with the initial state of the editor
        // reuse the current model, so changes can be made directly in the diff editor
        editor.addAction({
            id: "viewConfAction",
            label: "View Configuration",
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.US_BACKTICK],
            keybindingContext: null,
            run: function (ed) {
                var confEditor;
                TW.IDE.showModalDialog({
                    title: "Conf Editor",
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
                            JSON.stringify(TW.jqPlugins.twCodeEditor.flatten(defaultEditorSettings), null, "\t");

                        editorSettings.language = "json";
                        confEditor = monaco.editor.create(popover[0], editorSettings);
                        confEditor.focus();
                        // whenever the model changes, we need to also update the current editor, as well as other editors
                        confEditor.onDidChangeModelContent(function (e) {
                            try {
                                // if the json is valid, then set it on this editor as well as the editor behind
                                var expandedOptions = TW.jqPlugins.twCodeEditor.unflatten(JSON.parse(confEditor.getModel().getValue()));
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
        TW.jqPlugins.twCodeEditor.timeout = 0;
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
            monacoEditorLibs.serviceLibs.push(monaco.languages.typescript.thingworxJavascriptDefaults
                .addExtraLib(generateTypeScriptDefinitions(meThingModel.attributes.effectiveShape, entityName, false, true), fileName));
            // in the current globals we have me declarations as well as input parameters
            monacoEditorLibs.serviceLibs.push(monaco.languages.typescript.thingworxJavascriptDefaults
                .addExtraLib(generateServiceGlobals(serviceModel.serviceDefinition, entityName), "thingworx/currentGlobals.d.ts"));
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
                disposable: monaco.languages.typescript.thingworxJavascriptDefaults.addExtraLib(typescriptMetadata, "thingworx/" + entityName + ".d.ts"),
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
        var definition = "const me = new internal." + entityName + "." + entityName + "(); ";
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
        var namespaceDefinition = "declare namespace internal." + entityName + " {\n";
        var classDefinition = "export class " + entityName + " {\n constructor(); \n";

        // generate info retated to services
        var serviceDefs = effectiveShapeMetadata.serviceDefinitions;
        for (var key in serviceDefs) {
            if (!serviceDefs.hasOwnProperty(key)) continue;
            if (!(showGenericServices && TW.jqPlugins.twCodeEditor.defaultEditorSettings.thingworx.showGenericServices) && TW.IDE.isGenericServiceName(key)) continue;
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

        return "export as namespace internal." + entityName + ";\n" + namespaceDefinition;
    }

    /**
     * Removes all the temporary typescript definions with a category
     */
    function removeEditorLibs(category) {
        // remove the previous definitions
        for (var i = 0; i < monacoEditorLibs[category].length; i++) {
            TW.jqPlugins.twCodeEditor.monacoEditorLibs[category][i].dispose();
        }
        TW.jqPlugins.twCodeEditor.monacoEditorLibs[category] = [];
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
            monaco.languages.typescript.thingworxJavascriptDefaults.addExtraLib(result, "thingworx/scriptFunctions.d.ts");
        });
    }

    /**
     * Generates typescript interfaces from all thingworx datashapes
     */
    function generateDataShapeDefs() {
        thisPlugin.getDataShapeDefinitons().then(function (dataShapes) {
            addDataShapesAsInterfaces(dataShapes);
            addDatashapesCollection(dataShapes);
        }, function (reason) {
            console.log("Failed to generate typescript definitions from datashapes " + reason);
        });
    }

    /**
     * Generate typescript defs for all the datashapes in the system.
     */
    function addDatashapesCollection(dataShapes) {
        var datashapesDef = "declare namespace internal {\n";
        datashapesDef += "interface DataShapes {\n";
        // iterate through all the datashapes
        for (var i = 0; i < dataShapes.length; i++) {
            var datashape = dataShapes[i];
            // generate the metadata for this resource
            var validEntityName = sanitizeEntityName(datashape.name);
            datashapesDef += "/**\n * " + datashape.description + " \n**/\n";
            datashapesDef += "    '" + datashape.name + "': internal.DataShape.DataShape<internal." + validEntityName + ">;\n";
        }
        datashapesDef += "}\n}\n var DataShapes: internal.DataShapes;";
        monaco.languages.typescript.thingworxJavascriptDefaults.addExtraLib(datashapesDef, "thingworx/DataShapes.d.ts");
    }

    /**
     * Generate a typescript lib with all the datashapes as interfaces
     */
    function addDataShapesAsInterfaces(dataShapes) {
        // declare the namespace
        var dataShapeTs = "export as namespace internal;\n";
        dataShapeTs += "declare namespace internal { \n";
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
        monaco.languages.typescript.thingworxJavascriptDefaults.addExtraLib(dataShapeTs, "thingworx/DataShapeDefinitions.d.ts");
    }

    /**
     * Gets the typescript interface definiton from a thingworx defintion
     */
    function getTypescriptBaseType(definition) {
        if (definition.baseType != "INFOTABLE") {
            return "internal." + definition.baseType;
        } else {
            return "internal." + definition.baseType + "<" + (definition.aspects.dataShape ? ("internal." + sanitizeEntityName(definition.aspects.dataShape)) : "any") + ">";
        }
    }

    function generateResourceFunctions() {
        TW.IDE.getResources(false, function (resourceLibraries) {
            var resourcesDef = "declare namespace internal {\n";
            resourcesDef += "export interface ResourcesInterface {\n";
            // iterate through all the resources
            for (var key in resourceLibraries) {
                if (!resourceLibraries.hasOwnProperty(key)) continue;
                // generate the metadata for this resource
                var resourceLibrary = resourceLibraries[key].details;
                var validEntityName = sanitizeEntityName(key);
                var libraryName = "Resource" + validEntityName;
                var resourceDefinition = generateTypeScriptDefinitions(resourceLibrary, libraryName, true, false);
                monaco.languages.typescript.thingworxJavascriptDefaults.addExtraLib(resourceDefinition, "thingworx/" + libraryName + ".d.ts");
                resourcesDef += "/**\n * " + resourceLibraries[key].description + " \n**/\n";
                resourcesDef += "    '" + key + "': internal." + libraryName + "." + libraryName + ";\n";
            }
            resourcesDef += "}\n}\n var Resources: internal.ResourcesInterface;";
            monaco.languages.typescript.thingworxJavascriptDefaults.addExtraLib(resourcesDef, "thingworx/Resources.d.ts");
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
            monacoEditorLibs.entityCollection.dispose();
        }
        var entityCollectionsDefs = "declare namespace internal { \n";
        for (var i = 0; i < entityCollections.length; i++) {
            entityCollectionsDefs += "export interface " + entityCollections[i] + "Interface {\n";
            for (var typescriptDef in monacoEditorLibs.entityCollectionLibs) {
                if (!monacoEditorLibs.entityCollectionLibs.hasOwnProperty(typescriptDef)) continue;

                if (monacoEditorLibs.entityCollectionLibs[typescriptDef].entityType == entityCollections[i]) {
                    entityCollectionsDefs += "    '" + monacoEditorLibs.entityCollectionLibs[typescriptDef].entityId + "': internal." + typescriptDef + "." + typescriptDef + ";\n";
                }
            }
            // close the class declaration
            entityCollectionsDefs += "}\n";
        }
        // close the namespace declaration
        entityCollectionsDefs += "}\n";
        // now add all the entity collections
        for (var j = 0; j < entityCollections.length; j++) {
            entityCollectionsDefs += "var " + entityCollections[j] + ": internal." + entityCollections[j] + "Interface;\n";
        }

        monacoEditorLibs.entityCollection = monaco.languages.typescript.thingworxJavascriptDefaults.addExtraLib(
            entityCollectionsDefs, "thingworx/entityCollections.d.ts");
    }

    function loadStandardTypescriptDefs() {
        // extra logger definitions
        monaco.languages.typescript.thingworxJavascriptDefaults.addExtraLib([
            "declare class logger {",
            "    /**",
            "     * Log a debug warning",
            "     */",
            "    static debug(message:string)",
            "    /**",
            "     * Log a error warning",
            "     */",
            "    static error(message:string)",
            "    /**",
            "     * Log a warn warning",
            "     */",
            "    static warn(message:string)",
            "    /**",
            "     * Log a info warning",
            "     */",
            "    static info(message:string)",
            "}",
        ].join("\n"), "thingworx/logger.d.ts");

        // extra definitions for the thingworx baseTypes
        monaco.languages.typescript.thingworxJavascriptDefaults.addExtraLib([
            "declare namespace internal {",
            "export type STRING = string;",
            "export interface LOCATION {",
            "   latitude: number",
            "   longitude: number",
            "   elevation?: number",
            "   units?: string",
            "}",
            "export interface NOTHING extends Void{}",
            "export type NUMBER= number;",
            "export type INTEGER = number",
            "export type LONG = number",
            "export type BOOLEAN = boolean",
            "export type DASHBOADNAME = string",
            "export type GROUPNAME = string",
            "export type GUID = string",
            "export type HTML = string",
            "export type HYPERLINK = string",
            "export type IMAGELINK = string",
            "export type MASHUPNAME = string",
            "export type MENUNAME = string",
            "export type PASSWORD = string",
            "export type TEXT = string",
            "export type THINGCODE = string",
            "export type THINGNAME = string",
            "export type USERNAME = string",
            "export interface DATETIME extends Date{}",
            "export interface XML {}",
            "export interface JSON {}",
            "export interface QUERY {",
            "   filters?:any;",
            "   sorts?:any;",
            "}",
            "export interface TAGS {}",
            "export interface SCHEDULE {}",
            "export interface VARIANT {}",
            "export interface BLOB {}",
            "export type THINGSHAPENAME = string",
            "export type THINGTEMPLATENAME = string",
            "export type DATASHAPENAME = string",
            "export type PROJECTNAME = string",
            "export type BASETYPENAME = string",
            "export interface FieldDefinition {",
            "    ordinal: number;",
            "    baseType: string;",
            "    name: string;",
            "    description: string;",
            "}",
            "export interface SortDefinition {",
            "    name: string;",
            "    ascending: boolean;",
            "}",
            "export interface DataShape {",
            "    fieldDefinitions: FieldDefinition;",
            "}",
            "",
            "export interface InfotableJson<T> {",
            "    /**",
            "     * An array of all the rows in the infotable",
            "     */",
            "    rows: T[];",
            "    datashape: DataShape;",
            "}",
            "export interface INFOTABLE<T> extends InfotableJson<T> {",
            "    /**",
            "     * Adds a field to this InfoTable datashape",
            "     */",
            "    AddField(params: FieldDefinition);",
            "    /**",
            "     * Adds a row to this InfoTable given the values as a JSON",
            "     */",
            "    AddRow(params: T);",
            "    /**",
            "     * Removes a field from this InfoTable given the field name as a String",
            "     */",
            "    RemoveField(fieldName: String);",
            "    /**",
            "     * Removes a row from the InfoTable given its index",
            "     */",
            "    RemoveRow(index: number);",
            "    /**",
            "     * Removes all rows from this InfoTable",
            "     */",
            "    RemoveAllRows();",
            "    /**",
            "     * Returns the number of rows in this InfoTable as an Integer",
            "     */",
            "    getRowCount(): number;",
            "    /**",
            "     * Sorts the infotable inplace on a particular field",
            "     */",
            "    Sort(field: SortDefinition);",
            "    /**",
            "     * Filters the infotable inplace base on values",
            "     */",
            "    Filter(values: T);",
            "    /**",
            "     * Finds the first row that matches the condition based on values",
            "     */",
            "    Find(values: T);",
            "    /**",
            "     * Deletes all the rows that match the given vales",
            "     */",
            "    Delete(values: T);",
            "    /**",
            "     * Transforms the infotable into a JSON infotable",
            "     */",
            "    ToJSON(): InfotableJson<T>;",
            "    /**",
            "     * Transforms the infotable into a JSON infotable",
            "     */",
            "    toJSONSubset(): InfotableJson<T>;",
            "    /**",
            "     * Transforms the infotable into a JSON infotable",
            "     */",
            "    toJSONLite(): InfotableJson<T>;",
            "    /**",
            "     * Finds rows in this InfoTable with values that match the values given and returns them as a new InfoTable",
            "     * @param values The values to be matched as a JSON",
            "     * @return InfoTable Containing the rows with matching values",
            "     * @throws Exception If an error occurs",
            "     */",
            "    // NOT WORKING NativeObject->JSONObject FilterToNewTable(values: any): INFOTABLE;",
            "    /**",
            "     * Verifies a field exists in this InfoTables DataShape given the field name as a String",
            "     *",
            "     * @param name String containing the name of the field to verify",
            "     * @return Boolean True: if field exists in DataShape, False: if field does not exist in DataShape",
            "     */",
            "    hasField(name: string): boolean;",
            "    /**",
            "     * Returns a FieldDefinition from this InfoTables DataShapeDefinition, given the name of the",
            "     * field as a String",
            "     *",
            "     * @param name String containing the name of the field",
            "     * @return FieldDefinition from this InfoTables DataShape or null if not found",
            "     */",
            "    getField(name: String): FieldDefinition;",
            "    /**",
            "     * Returns a row from this InfoTable given its index as an int",
            "     *",
            "     * @param index Location of the row (ValueCollection) in the ValueCollectionList",
            "     * @return ValueCollection of the row specified or null if index is out of range",
            "     */",
            "    getRow(index: number): T ;",
            "    /**",
            "     * Finds and returns the index of a row from this InfoTable that matches the values of all fields given as a ValueCollection",
            "     *",
            "     * @param values ValueCollection containing the values that match all fields in the row",
            "     * @return int Index of the row in this InfoTable that matches the values given or null if not found",
            "     */",
            "    findIndex(values: any): number;",
            "    /**",
            "     * Limits the infotable to the top N items. This happens inplace",
            "     */",
            "    topN(maxItems: int);",
            "    /**",
            "     * Limits the infotable to the top N items. Returns the new infotable",
            "     */",
            "    topNToNewTable(maxItems: int): INFOTABLE<T>;",
            "    /**",
            "     * Clones the infotable into a new one",
            "     */",
            "    clone(): INFOTABLE<T>;",
            "    /**",
            "     * Returns a new empty InfoTable with the same fields defined",
            "     *",
            "     * @return InfoTable with matching fields",
            "     */",
            "    // NOT WORKING CloneStructure(): INFOTABLE;",
            "    /**",
            "     * Copies a row from this InfoTable, given its row number as an int, and returns it in a new InfoTable",
            "     *",
            "     * @param rowNumber The row to be copied from this InfoTable as an int",
            "     * @return InfoTable containing the row copied from this InfoTable",
            "     */",
            "    CopyValues(rowNumber: number): INFOTABLE<T>;",
            "}",
            "}"
        ].join("\n"), "thingworx/baseTypes.d.ts");
    }
};