TW.jqPlugins.twCodeEditor.monacoEditorLibs = {
    serviceLibs: [],
    entityCollectionLibs: []
};
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
    var monacoEditorLibs = TW.jqPlugins.twCodeEditor.monacoEditorLibs;
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
    codeTextareaElem.css("min-height", (thisPlugin.height || 300) + "px");
    if (codeTextareaElem.find(".monaco-editor").length > 0 && thisPlugin.monacoEditor !== undefined) {
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
        var parentServiceEditorJqEl = jqEl.closest("tr").prev();
        var parentPluginType = parentServiceEditorJqEl.attr('tw-jqPlugin');
        var serviceModel = parentServiceEditorJqEl[parentPluginType]("getAllProperties");
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
                generateScriptFunctions();
                generateResourceFunctions();
                monacoEditorLibs.entityCollectionLibs.push(monaco.languages.typescript.javascriptDefaults.addExtraLib(
                    generateEntityCollectionDefs(), 'thingworx/entityCollections.d.ts'));

                TW.jqPlugins.twCodeEditor.initializedDefaults = true;
            }
            // remove the previous definitions
            removeEditorLibs('serviceLibs');
            var meThingModel = serviceModel.model;

            var entityName = meThingModel.entityType + '' + sanitizeEntityName(meThingModel.id);
            var fileName = 'thingworx/' + entityName + '.d.ts';
            monacoEditorLibs.serviceLibs.push(monaco.languages.typescript.javascriptDefaults
                .addExtraLib(generateTypeScriptDefinitions(meThingModel.attributes.effectiveShape, entityName, false, true), fileName));
            // in the current globals we have me declarations as well as input parameters
            monacoEditorLibs.serviceLibs.push(monaco.languages.typescript.javascriptDefaults
                .addExtraLib(generateServiceGlobals(serviceModel.serviceDefinition, entityName), "thingworx/currentGlobals.d.ts"));
        }
        // modify the initial settions
        var editorSettings = $.extend({}, defaultMonacoSettings);
        editorSettings.language = mode;
        editorSettings.readOnly = !thisPlugin.properties.editMode;
        editorSettings.value = codeValue;

        var editor = monaco.editor.create(codeTextareaElem[0], editorSettings);
        var initialCode = codeValue;

        if (mode == "javascript") {
            // whenever the editor regains focus, we regenerate the first line (inputs defs) and me defs
            editor.onDidFocusEditor(function () {
                // get the service model again
                var serviceModel = parentServiceEditorJqEl[parentPluginType]("getAllProperties");
                var meThingModel = serviceModel.model;
                var entityName = meThingModel.entityType + '' + sanitizeEntityName(meThingModel.id);
                // remove the previous definitions
                removeEditorLibs('serviceLibs');

                var fileName = 'thingworx/' + entityName + '.d.ts';
                monacoEditorLibs.serviceLibs.push(monaco.languages.typescript.javascriptDefaults
                    .addExtraLib(generateTypeScriptDefinitions(meThingModel.attributes.effectiveShape, entityName, false, true), fileName));
                monacoEditorLibs.serviceLibs.push(monaco.languages.typescript.javascriptDefaults
                    .addExtraLib(generateServiceGlobals(serviceModel.serviceDefinition, entityName), "thingworx/currentGlobals.d.ts"));
            });
            // this handles on demand code completion for Thingworx entities
            monaco.languages.registerCompletionItemProvider('javascript', {
                triggerCharacters: [']', '.'],
                provideCompletionItems: function (model, position) {
                    // find out if we are completing on a entity collection. Get the line until the current position
                    var textUntilPosition = model.getValueInRange(new monaco.Range(position.lineNumber, 1, position.lineNumber, position.column));
                    // matches if we have at the end of our line an entity definition. example: Things["gg"]
                    var match = textUntilPosition.match(/(Things)\[['"]([^'"]+?)['"]\]\.?$/);
                    if (match) {
                        // get metadata for this
                        var entityType = match[1];
                        var entityName = match[2];
                        var metadata = TW.IDE.getEntityMetaData(entityType, entityName);
                        if (metadata) {
                            // generate the typescript definition
                            var entityName = entityType + '' + sanitizeEntityName(entityName);
                            removeEditorLibs('entityCollectionLibs')
                            var entityTypescriptDef = generateTypeScriptDefinitions(metadata, entityName, true, true);

                            monacoEditorLibs.entityCollectionLibs.push(monaco.languages.typescript.javascriptDefaults.
                                addExtraLib(entityTypescriptDef, 'thingworx/' + entityName + '.d.ts'));

                            monacoEditorLibs.entityCollectionLibs.push(monaco.languages.typescript.javascriptDefaults.addExtraLib(
                                generateEntityCollectionDefs(entityType, entityName), 'thingworx/entityCollections.d.ts'));

                        }
                    }
                    return [];
                }
            });
        }

        // whenever the model changes, we need to also push the changes up to the other plugins
        editor.onDidChangeModelContent(function (e) {
            thisPlugin.properties.code = editor.getModel().getValue();
            thisPlugin.properties.change(thisPlugin.properties.code);
        });
        editor.layout();
        if (findEditorButton(".save-entity-btn", parentServiceEditorJqEl).length > 0) {
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
        }
        if (findEditorButton(".done-btn", parentServiceEditorJqEl).length > 0) {
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
        }
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
        if (findEditorButton(".save-entity-btn", parentServiceEditorJqEl).length > 0) {
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
        }
        // action triggered by CTRL+K
        // shows a popup with a diff editor with the initial state of the editor
        // reuse the current model, so changes can be made directly in the diff editor
        editor.addAction({
            id: 'viewDiffAction',
            label: 'View Diff',
            contextMenuGroupId: 'service',
            contextMenuOrder: 1.6,
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
    function generateServiceGlobals(serviceMetadata, entityName) {
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
    function generateTypeScriptDefinitions(effectiveShapeMetadata, entityName, isGenericMetadata, showGenericServices) {
        // based on a module class declaration
        // https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-class-d-ts.html
        var namespaceDefinition = "declare namespace " + entityName + " {\n";
        var classDefinition = "declare class " + entityName + " {\n constructor(); \n";

        // generate info retated to services
        var serviceDefs = effectiveShapeMetadata.serviceDefinitions;
        for (var key in serviceDefs) {
            if (!serviceDefs.hasOwnProperty(key)) continue;
            if (!showGenericServices && TW.IDE.isGenericServiceName(key)) continue;
            // first create an interface for service params
            var service = serviceDefs[key];
            // metadata for the service parameters
            var serviceParamDefinition = "";
            if (isGenericMetadata) {
                var serviceParameterMetadata = service.Inputs.fieldDefinitions;
            } else {
                var serviceParameterMetadata = service.parameterDefinitions;
            }
            if (serviceParameterMetadata && Object.keys(serviceParameterMetadata).length > 0) {
                namespaceDefinition += "export interface " + service.name + "Params {\n";
                for (var parameterDef in serviceParameterMetadata) {
                    if (!serviceParameterMetadata.hasOwnProperty(parameterDef)) continue;
                    var inputDef = serviceParameterMetadata[parameterDef];

                    namespaceDefinition += "/** \n * " + inputDef.description +
                        (inputDef.aspects.dataShape ? ("  \n * Datashape: " + inputDef.aspects.dataShape) : "") + " \n */ \n " +
                        inputDef.name + ":" + inputDef.baseType + ";\n";
                    // generate a nice description of the service params
                    serviceParamDefinition += "*     " + inputDef.name + ": " + inputDef.baseType +
                        (inputDef.aspects.dataShape ? (" datashape with " + inputDef.aspects.dataShape) : "") + " - " + inputDef.description + "\n ";
                }
                namespaceDefinition += "}\n";
            }
            if (isGenericMetadata) {
                var outputMetadata = service.Outputs;
            } else {
                var outputMetadata = service.resultType;
            }
            // now generate the service definition, as well as jsdocs
            classDefinition += "/** \n * Category: " + service.category + "\n * " + service.description +
                "\n * " + (serviceParamDefinition ? ("Params: \n " + serviceParamDefinition) : "\n") + " **/ \n " +
                service.name + "(" + (serviceParamDefinition ? ("params:" + entityName + "." + service.name + "Params") : "") +
                "): " + outputMetadata.baseType + ";\n";
        }
        namespaceDefinition = namespaceDefinition + "}\n";

        // we handle property definitions here
        var propertyDefs = effectiveShapeMetadata.propertyDefinitions;
        for (var key in propertyDefs) {
            if (!propertyDefs.hasOwnProperty(key)) continue;

            var property = propertyDefs[key];
            // generate an export for each property
            classDefinition += "/** \n * " + property.description + " \n */" + "\n" + property.name + ":" + property.baseType + ";\n";
        }
        classDefinition = classDefinition + "}\n";
        return "export as namespace " + entityName + ";\n" + namespaceDefinition + classDefinition;
    }

    /**
     * Removes all the temporary typescript definions
     */
    function removeEditorLibs(category) {
        // remove the previous definitions
        for (var i = 0; i < monacoEditorLibs[category].length; i++) {
            TW.jqPlugins.twCodeEditor.monacoEditorLibs[category][i].dispose();
        }
        TW.jqPlugins.twCodeEditor.monacoEditorLibs[category] = [];
    }
    /**
     * Finds the editor button in the button toolbar
     */
    function findEditorButton(buttonName, parentServiceEditorJqEl) {
        var button = thisPlugin.jqElement.closest("tr").find(buttonName);
        // we must be in fullscreen, try to find the button elsewhere
        if (button.length == 0) {
            button = thisPlugin.jqElement.closest(".inline-body").next().find(buttonName);
        }
        return button;
    }

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
                    var declaration = "declare function " + functionDef.name + "(";;
                    for (var i = 0; i < functionDef.parameterDefinitions.length; i++) {
                        jsDoc += "\n * @param " + functionDef.parameterDefinitions[i].name + "  " + functionDef.parameterDefinitions[i].description;
                        declaration += functionDef.parameterDefinitions[i].name + ": " + functionDef.parameterDefinitions[i].baseType;
                        // add a comma between the parameters
                        if (i < functionDef.parameterDefinitions.length - 1) {
                            declaration += ", ";
                        }
                    }
                    // add the return info
                    jsDoc += "\n * @return " + functionDef.resultType.description + " \n **/"
                    declaration += "):" + functionDef.resultType.baseType;
                    result += "\n" + jsDoc + "\n" + declaration + ";";
                }
            }
            monaco.languages.typescript.javascriptDefaults.addExtraLib(result, "thingworx/scriptFunctions.d.ts");
        });
    }

    function generateResourceFunctions() {
        TW.IDE.getResources(false, function (resourceLibraries) {
            var resourcesDef = "interface ResourcesInterface {\n";
            // iterate through all the resources
            for (var key in resourceLibraries) {
                if (!resourceLibraries.hasOwnProperty(key)) continue;
                // generate the metadata for this resource
                var resourceLibrary = resourceLibraries[key].details;
                var validEntityName = sanitizeEntityName(key);
                var resourceDefinition = generateTypeScriptDefinitions(resourceLibrary, "Resource" + validEntityName, true, false);
                monaco.languages.typescript.javascriptDefaults.addExtraLib(resourceDefinition, "thingworx/" + "Resource" + validEntityName + ".d.ts");
                resourcesDef += "/**\n * " + resourceLibraries[key].description + " \n**/\n";
                resourcesDef += "    '" + key + "': Resource" + validEntityName + ";\n";
            }
            resourcesDef += "}\n var Resources: ResourcesInterface;";
            monaco.languages.typescript.javascriptDefaults.addExtraLib(resourcesDef, "thingworx/Resources.d.ts");
        });
    }
    /**
     * Sanitizes an entity name to be a valid javascript declaration
     */
    function sanitizeEntityName(entityName) {
        return entityName.replace(/^[^a-zA-Z_]+|[^a-zA-Z_0-9]+/g, '');
    }

    function generateEntityCollectionDefs(entityType, entityName) {
        // generate entity collections
        var entityCollections = ["ApplicationKeys", "Authenticators", "Bindings", "Blogs", "Channels", "Configuration", "ContentCrawlers", "Dashboards",
            "DataAnalysisDefinitions", "DataShapes", "DataTables", "DataTags", "DataTagVocabulary", "ModelTags", "ModelTagVocabulary",
            "VocabularyTerm", "DirectoryServices", "Groups", "LocalizationTables", "Logs", "Mashups", "MediaEntities", "Menus", "Networks",
            "Organizations", "Permissions", "PersistenceProviderPackages", "PersistenceProviders", "Projects", "Properties",
            "StateDefinitions", "Streams", "StyleDefinitions", "Subsystems", "Things", "ThingTemplates", "ThingShapes", "Users", "ValueStreams", "Wikis"];
        var entityCollectionsDefs = "";
        for (var i = 0; i < entityCollections.length; i++) {
            entityCollectionsDefs += 'interface ' + entityCollections[i] + 'Interface {\n';
            if (entityType == entityCollections[i]) {
                entityCollectionsDefs += "    '" + entityName + "': " + sanitizeEntityName(entityName) + ";\n";
            }
            entityCollectionsDefs += "}\n";
            entityCollectionsDefs += 'var ' + entityCollections[i] + ': ' + entityCollections[i] + 'Interface;\n';
        }
        return entityCollectionsDefs;
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
            '   elevation?: number',
            '   units?: string',
            '}',
            'interface NOTHING extends Void{}',
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
            'interface XML {}',
            'interface JSON {}',
            'interface QUERY {',
            '   filters?:any;',
            '   sorts?:any;',
            '}',
            'interface TAGS {}',
            'interface SCHEDULE {}',
            'interface VARIANT {}',
            'interface BLOB {}',
            'interface THINGSHAPENAME extends String{}',
            'interface THINGTEMPLATENAME extends String {}',
            'interface DATASHAPENAME extends String {}',
            'interface PROJECTNAME extends String {}',
            'interface BASETYPENAME extends String {}',
            'interface FieldDefinition {',
            '    ordinal: number;',
            '    baseType: string;',
            '    name: string;',
            '    description: string;',
            '}',
            'interface SortDefinition {',
            '    name: string;',
            '    ascending: boolean;',
            '}',
            'interface DataShape {',
            '    fieldDefinitions: FieldDefinition;',
            '}',
            '',
            'interface InfotableJson {',
            '    /**',
            '     * An array of all the rows in the infotable',
            '     */',
            '    rows: any[];',
            '    datashape: DataShape;',
            '}',
            'interface INFOTABLE extends InfotableJson {',
            '    /**',
            '     * Adds a field to this InfoTable datashape',
            '     */',
            '    AddField(params: FieldDefinition);',
            '    /**',
            '     * Adds a row to this InfoTable given the values as a JSON',
            '     */',
            '    AddRow(params: any);',
            '    /**',
            '     * Removes a field from this InfoTable given the field name as a String',
            '     */',
            '    RemoveField(fieldName: String);',
            '    /**',
            '     * Removes a row from the InfoTable given its index',
            '     */',
            '    RemoveRow(index: number);',
            '    /**',
            '     * Removes all rows from this InfoTable',
            '     */',
            '    RemoveAllRows();',
            '    /**',
            '     * Returns the number of rows in this InfoTable as an Integer',
            '     */',
            '    getRowCount(): number;',
            '    /**',
            '     * Sorts the infotable inplace on a particular field',
            '     */',
            '    Sort(field: SortDefinition);',
            '    /**',
            '     * Filters the infotable inplace base on values',
            '     */',
            '    Filter(values: any);',
            '    /**',
            '     * Finds the first row that matches the condition based on values',
            '     */',
            '    Filter(values: any);',
            '    /**',
            '     * Deletes all the rows that match the given vales',
            '     */',
            '    Delete(values: any);',
            '    /**',
            '     * Transforms the infotable into a JSON infotable',
            '     */',
            '    ToJSON(): InfotableJson;',
            '    /**',
            '     * Transforms the infotable into a JSON infotable',
            '     */',
            '    toJSONSubset(): InfotableJson;',
            '    /**',
            '     * Transforms the infotable into a JSON infotable',
            '     */',
            '    toJSONLite(): InfotableJson;',
            '    /**',
            '     * Finds rows in this InfoTable with values that match the values given and returns them as a new InfoTable',
            '     * @param values The values to be matched as a JSON',
            '     * @return InfoTable Containing the rows with matching values',
            '     * @throws Exception If an error occurs',
            '     */',
            '    // NOT WORKING NativeObject->JSONObject FilterToNewTable(values: any): INFOTABLE;',
            '    /**',
            '     * Verifies a field exists in this InfoTables DataShape given the field name as a String',
            '     *',
            '     * @param name String containing the name of the field to verify',
            '     * @return Boolean True: if field exists in DataShape, False: if field does not exist in DataShape',
            '     */',
            '    hasField(name: string): boolean;',
            '    /**',
            '     * Returns a FieldDefinition from this InfoTables DataShapeDefinition, given the name of the',
            '     * field as a String',
            '     *',
            '     * @param name String containing the name of the field',
            '     * @return FieldDefinition from this InfoTables DataShape or null if not found',
            '     */',
            '    getField(name: String): FieldDefinition;',
            '    /**',
            '     * Returns a row from this InfoTable given its index as an int',
            '     *',
            '     * @param index Location of the row (ValueCollection) in the ValueCollectionList',
            '     * @return ValueCollection of the row specified or null if index is out of range',
            '     */',
            '    getRow(index: number): any ;',
            '    /**',
            '     * Finds and returns the index of a row from this InfoTable that matches the values of all fields given as a ValueCollection',
            '     *',
            '     * @param values ValueCollection containing the values that match all fields in the row',
            '     * @return int Index of the row in this InfoTable that matches the values given or null if not found',
            '     */',
            '    findIndex(values: any): number;',
            '    /**',
            '     * Limits the infotable to the top N items. This happens inplace',
            '     */',
            '    topN(maxItems: int);',
            '    /**',
            '     * Limits the infotable to the top N items. Returns the new infotable',
            '     */',
            '    topNToNewTable(maxItems: int): INFOTABLE;',
            '    /**',
            '     * Clones the infotable into a new one',
            '     */',
            '    clone(): INFOTABLE;',
            '    /**',
            '     * Returns a new empty InfoTable with the same fields defined',
            '     *',
            '     * @return InfoTable with matching fields',
            '     */',
            '    // NOT WORKING CloneStructure(): INFOTABLE;',
            '    /**',
            '     * Copies a row from this InfoTable, given its row number as an int, and returns it in a new InfoTable',
            '     *',
            '     * @param rowNumber The row to be copied from this InfoTable as an int',
            '     * @return InfoTable containing the row copied from this InfoTable',
            '     */',
            '    CopyValues(rowNumber: number): INFOTABLE;',
            '}',
        ].join('\n'), 'thingworx/baseTypes.d.ts');
    }
}