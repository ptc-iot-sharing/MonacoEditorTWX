TW.jqPlugins.twCodeEditor.monacoEditorLibs = [];
/**
 * Called when the exttension is asked to insert a code snippet via the snippets
 * We make sure that we also have an undo stack here
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
 * Called when move from fullscreen or to fullscreen
 */
TW.jqPlugins.twCodeEditor.prototype.setHeight = function (height) {
    var thisPlugin = this;
    var jqEl = thisPlugin.jqElement;
    var container = jqEl.find('.editor-container');
    container.height(height);
    if (thisPlugin.monacoEditor) {
        thisPlugin.monacoEditor.layout();
    }
};
/**
 * Initializes a new code mirror and registeres all the listeners
 */
TW.jqPlugins.twCodeEditor.prototype.showCodeProperly = function () {
    var thisPlugin = this;
    var jqEl = thisPlugin.jqElement;
    var codeTextareaElem = jqEl.find('.code-container');
    // avalible options: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditoroptions.html
    var defaultMonacoSettings = {
        folding: true,
        fontSize: 12,
        fontFamily: "Fira Code,Monaco,monospace",
        fontLigatures: true,
        mouseWheelZoom: true,
        formatOnPaste: true,
        scrollBeyondLastLine: false,
        theme: "vs"
    };
    // make sure that the key events stay inside the editor.
    codeTextareaElem.on("keydown keypress keyup", function (e) {
        e.stopPropagation();
    })
    // root of where the entire vs folder is
    var vsRoot = '/Thingworx/Common/extensions/MonacoScriptEditor/ui/monacoScriptEditor/vs';
    // hide the toolbar since we have all the toolbar functionality in the editor
    jqEl.find('.btn-toolbar').hide();
    // make sure the textArea will strech, but have a minimum height
    codeTextareaElem.height("100%");
    codeTextareaElem.css("min-height", "365px");
    if (thisPlugin.monacoEditor !== undefined) {
        // already done, don't init the editor again
        return;
    }
    // handle the different modes. For sql, we also need to hide the syntax check button
    var mode = 'javascript';
    switch (thisPlugin.properties.handler) {
        case 'SQLCommand':
        case 'SQLQuery':
            mode = 'sql';
            jqEl.find('[cmd="syntax-check"]').hide();
            break;

        case 'Script':
            jqEl.find('[cmd="syntax-check"]').show();
            break;
    }

    // configure AMD require module
    require.config({
        paths: {
            'vs': vsRoot
        }
    });
    // begin to init our editor
    require(['vs/editor/editor.main'], function () {
        // get the service model from the parent twService editor
        var parentServiceEditorJqEl = jqEl.closest("tbody").find(".twServiceEditor");
        var serviceModel = parentServiceEditorJqEl.twServiceEditor("getAllProperties");
        // there are cases where showCodeProperly is called, but no properties are yet set.
        // there are cases where the parent twServiceEditor doesn't have a model set
        // just exit in those cases
        if (!thisPlugin.properties || !serviceModel || !serviceModel.model) {
            return;
        }
        // the code gets automatically put in a text area, so just grab it from there
        var codeValue = jqEl.find('.actual-code').val();
        // if the editor is javascript, then we need to init the compiler, and generate models
        if (mode === "javascript") {
            // if this is the first initalization attempt, then set the compiler optios
            if (!TW.jqPlugins.twCodeEditor.initializedDefaults) {
                // compiler options
                monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                    target: monaco.languages.typescript.ScriptTarget.ES5,
                    allowNonTsExtensions: true,
                    noLib: true
                });
                var coreDefsName = 'lib.es5.d.ts';
                $.get(vsRoot + "/language/typescript/lib/" + coreDefsName, function (data) {
                    // Register the es5 library
                    monaco.languages.typescript.javascriptDefaults.addExtraLib(
                        data,
                        coreDefsName
                    );
                });
                loadStandardTypescriptDefs();

                TW.jqPlugins.twCodeEditor.initializedDefaults = true;
            }
            // remove the previous definitions
            removeEditorDefinitions();
            var meThingModel = serviceModel.model;

            var entityName = meThingModel.entityType + '' + meThingModel.id.replace(/^[^a-zA-Z_]+|[^a-zA-Z_0-9]+/g, '');
            var fileName = 'thingworx/' + entityName + '.d.ts';
            TW.jqPlugins.twCodeEditor.monacoEditorLibs.push(monaco.languages.typescript.javascriptDefaults
                .addExtraLib(generateTypeScriptDefinitions(meThingModel, entityName), fileName));
            // add the first lines to the service
            codeValue = generateServiceFirstLine(serviceModel.serviceDefinition, entityName) + "\n" + codeValue;
        }
        // modify the initial settions
        var editorSettings = $.extend({}, defaultMonacoSettings);
        editorSettings.language = mode;
        editorSettings.readOnly = !thisPlugin.properties.editMode;
        editorSettings.value = codeValue;

        var editor = monaco.editor.create(codeTextareaElem[0], editorSettings);
        var initialCode = codeValue;

        if (mode == "javascript") {
            // TODO: Huge hack here. Because the folding controller resets the hidden areas,
            // we override the setHiddenAreas function to always hide the first three lines
            var proxiedSetHiddenAreas = editor.setHiddenAreas;
            editor.setHiddenAreas = function (ranges) {
                ranges.push(new monaco.Range(1, 1, 1, 2));
                ranges.push(new monaco.Range(2, 1, 1, 2))
                ranges.push(new monaco.Range(3, 1, 3, 2));
                return proxiedSetHiddenAreas.apply(this, arguments);
            };
            // hide the first three lines
            editor.setHiddenAreas([]);
            // whenever the editor regains focus, we regenerate the first line (inputs defs) and me defs
            editor.onDidFocusEditor(function () {
                // get the service model again
                var serviceModel = parentServiceEditorJqEl.twServiceEditor("getAllProperties");
                var meThingModel = serviceModel.model;
                var entityName = meThingModel.entityType + '' + meThingModel.id.replace(/^[^a-zA-Z_]+|[^a-zA-Z_0-9]+/g, '');
                var op = {
                    range: new monaco.Range(1, 1, 3, 9999999),
                    text: generateServiceFirstLine(serviceModel.serviceDefinition, entityName),
                    forceMoveMarkers: true
                };
                // update the first list. Use apply edits for no undo stack
                thisPlugin.monacoEditor.executeEdits("modelUpdated", [op]);
                // remove the previous definitions
                removeEditorDefinitions();

                var fileName = 'thingworx/' + entityName + '.d.ts';
                TW.jqPlugins.twCodeEditor.monacoEditorLibs.push(monaco.languages.typescript.javascriptDefaults
                    .addExtraLib(generateTypeScriptDefinitions(meThingModel, entityName), fileName));

            });
        }

        // whenever the model changes, we need to also push the changes up to the other plugins
        editor.onDidChangeModelContent(function (e) {
            if (mode == "javascript") {
                var codeRange = new monaco.Range(4, 1, editor.getModel().getLineCount(), 999999);
                thisPlugin.properties.code = editor.getModel().getValueInRange(codeRange);
            } else {
                thisPlugin.properties.code = editor.getModel().getValue();
            }
            thisPlugin.properties.change(thisPlugin.properties.code);
        });
        editor.layout();
        // add actions for editor
        editor.addAction({
            id: 'saveCodeAction',
            label: 'Save Service',
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
            keybindingContext: null,
            contextMenuGroupId: 'service',
            contextMenuOrder: 1.5,
            run: function (ed) {
                // fake a click on the saveEntity button
                // TODO: this is hacky... there is no other way of executing the saveService on the twServiceEditor
                var saveEntityButton = findEditorButton(".save-entity-btn", parentServiceEditorJqEl);
                saveEntityButton.click();
            }
        });
        editor.addAction({
            id: 'doneCodeAction',
            label: 'Save and Close',
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Escape],
            keybindingContext: null,
            run: function (ed) {
                // fake a click on the done button
                // TODO: this is hacky... there is no other way of executing the saveService on the twServiceEditor
                var doneButton = findEditorButton(".done-btn", parentServiceEditorJqEl);
                doneButton.click();
            }
        });
        editor.addAction({
            id: 'testCodeAction',
            label: 'Test Service',
            contextMenuGroupId: 'service',
            contextMenuOrder: 1.5,
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_Y],
            keybindingContext: null,
            run: function (ed) {
                serviceModel.testService();
            }
        });
        editor.addAction({
            id: 'closeCodeAction',
            label: 'Close Service',
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_Q],
            keybindingContext: null,
            run: function (ed) {
                var cancelButton = findEditorButton(".cancel-btn", parentServiceEditorJqEl);
                cancelButton.click();
            }
        });
        // action triggered by CTRL+K
        // shows a popup with a diff editor with the initial state of the editor
        // reuse the current model, so changes can be made directly in the diff editor
        editor.addAction({
            id: 'viewDiffAction',
            label: 'View Diff',
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_K],
            keybindingContext: null,
            run: function (ed) {
                TW.IDE.showModalDialog({
                    title: "Diff Editor",
                    show: function (popover) {
                        popover.css({
                            margin: "0",
                            height: "85%",
                            width: "85%",
                            top: "5%",
                            left: "5%"
                        });
                        var originalModel = monaco.editor.createModel(initialCode, mode);
                        var modifiedModel = ed.getModel();

                        var diffEditor = monaco.editor.createDiffEditor(popover[0], defaultMonacoSettings);
                        diffEditor.setModel({
                            original: originalModel,
                            modified: modifiedModel
                        });

                    }
                });
            }
        });
        thisPlugin.monacoEditor = editor;
    });

    /**
     * In the first editor line we declare the "me" variable, as well as the inputs.
     */
    function generateServiceFirstLine(serviceMetadata, entityName) {
        var definition = "// The first line is not editable and declares the entities used in the service. The line is NOT saved\n";
        definition += "var me = new " + entityName + "(); "
        for (var key in serviceMetadata.parameterDefinitions) {
            if (!serviceMetadata.parameterDefinitions.hasOwnProperty(key)) continue;
            definition += "var " + key + ": " + serviceMetadata.parameterDefinitions[key].baseType + "; ";
        }
        return definition + '\n//------------------------------------------------------------------------';
    }

    /**
     * Generates a typescript class and namespace for a metadata.
     * 
     */
    function generateTypeScriptDefinitions(metadata, entityName) {
        // based on a module class declaration
        // https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-class-d-ts.html
        var namespaceDefinition = "declare namespace " + entityName + " {\n";
        var classDefinition = "declare class " + entityName + " {\n constructor(); \n";

        // generate info retated to services
        var serviceDefs = metadata.attributes.effectiveShape.serviceDefinitions;
        for (var key in serviceDefs) {
            if (!serviceDefs.hasOwnProperty(key)) continue;
            // first create an interface for service params
            var service = serviceDefs[key];
            // metadata for the service parameters
            var serviceParamDefinition = "";
            if (service.parameterDefinitions && Object.keys(service.parameterDefinitions).length > 0) {
                namespaceDefinition += "export interface " + service.name + "Params {\n";
                for (var parameterDef in service.parameterDefinitions) {
                    if (!service.parameterDefinitions.hasOwnProperty(parameterDef)) continue;
                    var inputDef = service.parameterDefinitions[parameterDef];

                    namespaceDefinition += "/** \n * " + inputDef.description +
                        (inputDef.aspects.dataShape ? ("  \n * Datashape: " + inputDef.aspects.dataShape) : "") + " \n */ \n " +
                        inputDef.name + ":" + inputDef.baseType + ";\n";
                    // generate a nice description of the service params
                    serviceParamDefinition += "*     " + inputDef.name + ": " + inputDef.baseType +
                        (inputDef.aspects.dataShape ? (" datashape with " + inputDef.aspects.dataShape) : "") + " - " + inputDef.description + "\n ";
                }
                namespaceDefinition += "}\n";
            }
            // now generate the service definition, as well as jsdocs
            classDefinition += "/** \n * Category: " + service.category + "\n * " + service.description +
                "\n * " + (serviceParamDefinition ? ("Params: \n " + serviceParamDefinition) : "\n") + " **/ \n " +
                service.name + "(" + (serviceParamDefinition ? ("params:" + entityName + "." + service.name + "Params") : "") +
                "): " + service.resultType.baseType + ";\n";
        }
        namespaceDefinition = namespaceDefinition + "}\n";

        // we handle property definitions here
        var propertyDefs = metadata.attributes.effectiveShape.propertyDefinitions;
        for (var key in propertyDefs) {
            if (!propertyDefs.hasOwnProperty(key)) continue;

            var property = propertyDefs[key];
            // generate an export for each property
            classDefinition += "/** \n * " + property.description + " \n */" + "\n" + property.name + ":" + property.baseType + ";\n";
        }
        classDefinition = classDefinition + "}\n";
        return "export as namespace " + entityName + ";\n" + namespaceDefinition + classDefinition;
    }

    function loadStandardTypescriptDefs() {
        // extra logger definitions
        monaco.languages.typescript.javascriptDefaults.addExtraLib([
            'declare class logger {',
            '    /**',
            '     * Log a debug warning',
            '     */',
            '    static debug(message:string)',
            '    /**',
            '     * Log a error warning',
            '     */',
            '    static error(message:string)',
            '    /**',
            '     * Log a warn warning',
            '     */',
            '    static warn(message:string)',
            '    /**',
            '     * Log a info warning',
            '     */',
            '    static info(message:string)',
            '}',
        ].join('\n'), 'thingworx/logger.d.ts');

        // extra definitions for the thingworx baseTypes
        monaco.languages.typescript.javascriptDefaults.addExtraLib([
            'interface STRING extends String{}',
            'interface LOCATION {',
            '   latitude: number',
            '   longitude: number',
            '   elevation: number',
            '   units: string',
            '}',
            'interface NUMBER extends Number{}',
            'interface INTEGER extends Number{}',
            'interface LONG extends Number{}',
            'interface BOOLEAN extends boolean{}',
            'interface DASHBOADNAME extends String{}',
            'interface GROUPNAME extends String{}',
            'interface GUID extends String{}',
            'interface HTML extends String{}',
            'interface HYPERLINK extends String{}',
            'interface IMAGELINK extends String{}',
            'interface MASHUPNAME extends String{}',
            'interface MENUNAME extends String{}',
            'interface PASSWORD extends String{}',
            'interface TEXT extends String{}',
            'interface THINGCODE extends String{}',
            'interface THINGNAME extends String{}',
            'interface USERNAME extends String{}',
            'interface DATETIME extends Date{}',
        ].join('\n'), 'thingworx/baseTypes.d.ts');
    }

    /**
     * Removes all the temporary typescript definions
     */
    function removeEditorDefinitions() {
        // remove the previous definitions
        for (var i = 0; i < TW.jqPlugins.twCodeEditor.monacoEditorLibs.length; i++) {
            TW.jqPlugins.twCodeEditor.monacoEditorLibs[i].dispose();
        }
        TW.jqPlugins.twCodeEditor.monacoEditorLibs = [];
    }
    /**
     * Finds the editor button in the button toolbar
     */
    function findEditorButton(buttonName, parentServiceEditorJqEl) {
        var parentServiceEditor = parentServiceEditorJqEl[0];
        var doneButton = $.data(parentServiceEditor, "twServiceEditor").jqSecondElement.find(buttonName);
        // we must be in fullscreen, try to find the button elsewhere
        if (doneButton.length == 0) {
            doneButton = thisPlugin.jqElement.closest(".inline-body").next().find(buttonName);
        }
        return doneButton;
    }
}