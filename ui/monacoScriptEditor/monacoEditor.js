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
    jqEl.find('.btn-toolbar').hide();
    codeTextareaElem.height("100%");
    codeTextareaElem.css("min-height", "365px");
    if (thisPlugin.monacoEditor !== undefined) {
        // already done
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
            'vs': '/Thingworx/Common/extensions/MonacoScriptEditor/ui/monacoScriptEditor/vs'
        }
    });
    require(['vs/editor/editor.main'], function () {
        if (thisPlugin.properties) {

            // compiler options
            monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
                target: monaco.languages.typescript.ScriptTarget.ES5,
                allowNonTsExtensions: true
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
            var thingModel = jqEl.closest("tbody").find(".twServiceEditor").twServiceEditor("getAllProperties").model;
            var meClass = "declare class me {";
            var propertyDefs = thingModel.attributes.thingShape.propertyDefinitions;
            for (var key in propertyDefs) {
                // skip loop if the property is from prototype
                if (!propertyDefs.hasOwnProperty(key)) continue;

                var obj = propertyDefs[key];
                meClass += "/** \n * " + obj.description + " \n */" + "\n static " + obj.name + ":" + obj.baseType +";\n";
            }
            meClass = meClass +  "\n}";
            
            monaco.languages.typescript.javascriptDefaults.addExtraLib(meClass, 'thingworx/me.d.ts');
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
}