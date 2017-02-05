TW.jqPlugins.twCodeEditor.monacoEditorLibs = [];
TW.jqPlugins.twCodeEditor.prototype.insertCode = function (code) {
    var thisPlugin = this;
    var op = {
        identifier: {
            major: 1,
            minor: 1
        },
        range: thisPlugin.monacoEditor.getSelection(),
        text: code,
        forceMoveMarkers: true
    };
    thisPlugin.monacoEditor.executeEdits("my-source", [op]);
};
TW.jqPlugins.twCodeEditor.prototype.setHeight = function (height) {
    var thisPlugin = this;
    var jqEl = thisPlugin.jqElement;
    var container = jqEl.find('.editor-container');
    container.height(height);
    if (thisPlugin.monacoEditor) {
        thisPlugin.monacoEditor.layout();
    }
};
TW.jqPlugins.twCodeEditor.prototype.showCodeProperly = function () {
    var thisPlugin = this;
    var jqEl = thisPlugin.jqElement;
    var codeTextareaElem = jqEl.find('.code-container');
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


    require.config({
        paths: {
            'vs': vsRoot
        }
    });
    require(['vs/editor/editor.main'], function () {
        if (thisPlugin.properties) {
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

                // extra libraries
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
                TW.jqPlugins.twCodeEditor.initializedDefaults = true;
            }
            // remove the previous definitions
            for (var i = 0; i < TW.jqPlugins.twCodeEditor.monacoEditorLibs.length; i++) {
                TW.jqPlugins.twCodeEditor.monacoEditorLibs[i].dispose();
            }
            TW.jqPlugins.twCodeEditor.monacoEditorLibs = [];

            var meThingModel = jqEl.closest("tbody").find(".twServiceEditor").twServiceEditor("getAllProperties").model;

            var fileName = 'thingworx/' + meThingModel.entityType + '/' + meThingModel.id + '.d.ts';
            TW.jqPlugins.twCodeEditor.monacoEditorLibs.push(monaco.languages.typescript.javascriptDefaults
                .addExtraLib(generateTypeScriptDefinitions(meThingModel), fileName));

            // avalible options: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditoroptions.html
            var editor = monaco.editor.create(codeTextareaElem[0], {
                language: mode,
                readOnly: !thisPlugin.properties.editMode,
                value: jqEl.find('.actual-code').val(),
                folding: true,
                fontSize: 12,
                fontFamily: "Fira Code,Monaco,monospace",
                fontLigatures: true,
                mouseWheelZoom: true,
                theme: "vs"
            });
            thisPlugin.monacoEditor = editor;
            editor.onDidChangeModelContent(function (e) {
                thisPlugin.properties.code = editor.getValue();
                thisPlugin.properties.change(thisPlugin.properties.code);
            });
            editor.layout();
        }
    });

    function generateTypeScriptDefinitions(metadata) {
        // this is me
        var definiton = "export as namespace me;\n";
        // we handle property definitions first
        var propertyDefs = metadata.attributes.effectiveShape.propertyDefinitions;
        for (var key in propertyDefs) {
            if (!propertyDefs.hasOwnProperty(key)) continue;

            var property = propertyDefs[key];
            // generate an export for each property
            definiton += "/** \n * " + property.description + " \n */" + "\n export " + property.name + ":" + property.baseType + ";\n";
        }
        // generate service definitions
        var serviceDefs = metadata.attributes.effectiveShape.serviceDefinitions;
        for (var key in serviceDefs) {
            if (!serviceDefs.hasOwnProperty(key)) continue;
            // first create an interface for service params
            var service = serviceDefs[key];
            definiton += "interface " + service.name + "Params\n {";
            for (var parameterDef in service.parameterDefinitions) {
                if (!service.parameterDefinitions.hasOwnProperty(parameterDef)) continue;
                var inputDef = service.parameterDefinitions[parameterDef];

                definiton += "/** \n * " + inputDef.description + " \n */ \n " +
                    inputDef.name + ":" + inputDef.baseType + ";\n";
            }
            // now define the service
            definiton += "}\n";
            definiton += "/** \n * Category: " + service.category + "\n * " + service.description + " \n */" + "\n export function " +
                service.name + "(params:" + service.name + "Params):" + service.resultType.baseType + ";\n";
        }
        definiton = definiton + "\n";
        return definiton;
    }
}