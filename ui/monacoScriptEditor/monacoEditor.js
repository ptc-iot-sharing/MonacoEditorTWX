TW.jqPlugins.twCodeEditor.prototype.insertCode = function (code) {
    var thisPlugin = this;
    var line = thisPlugin.monacoEditor.getSelection();
    var range = new monaco.Range(line.lineNumber, 1, line.lineNumber, 1);
    var id = {
        major: 1,
        minor: 1
    };
    var op = {
        identifier: id,
        range: line,
        text: code,
        forceMoveMarkers: true
    };
    thisPlugin.monacoEditor.executeEdits("my-source", [op]);
};
TW.jqPlugins.twCodeEditor.prototype.showCodeProperly = function () {
    var thisPlugin = this;
    var jqEl = thisPlugin.jqElement;
    var codeTextareaElem = jqEl.find('.code-container');
    jqEl.find('.btn-toolbar').hide();
    codeTextareaElem.height("365px");

    if (thisPlugin.myCodeMirror !== undefined) {
        // already done
        return;
    }

    //			if( CodeMirror.commands.autocomplete === undefined ) {
    //				CodeMirror.commands.autocomplete = function (cm) {
    //					CodeMirror.simpleHint(cm, CodeMirror.javascriptHintTw);
    //				};
    //			}
    //			if( CodeMirror.commands.testhere === undefined ) {
    //				CodeMirror.commands.testhere = function (cm) {
    //					alert('ctrl-E pressed');
    //				};
    //			}

    var mode = 'javascript';
    switch (thisPlugin.properties.handler) {
        case 'SQLCommand':
        case 'SQLQuery':
            mode = 'text/x-mysql';
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
            var editor = monaco.editor.create(codeTextareaElem[0], {
                language: 'javascript',
                readOnly: !thisPlugin.properties.editMode,
                value: jqEl.find('.actual-code').val()
            });
            thisPlugin.monacoEditor = editor;
            editor.onDidChangeModelContent(function (e) {
                thisPlugin.properties.code = editor.getValue();
                thisPlugin.properties.change(thisPlugin.properties.code);
            });
        }
    });
    //			thisPlugin.myCodeMirror.on('cursorActivity',function() {
    //				thisPlugin.myCodeMirror.matchHighlight("CodeMirror-matchhighlight");
    //			});

    var getSelectedRange = function () {
        return {
            from: thisPlugin.myCodeMirror.getCursor(true),
            to: thisPlugin.myCodeMirror.getCursor(false)
        };
    };

    var commentSelection = function () {
        var range = getSelectedRange();
        var commentText = '//';
        if (thisPlugin.properties.handler !== 'Script') {
            commentText = '--';
        }
        for (var line = range.from.line; line <= range.to.line; line++) {
            thisPlugin.myCodeMirror.setLine(line, commentText + thisPlugin.myCodeMirror.getLine(line))
        }
    };

    var unCommentSelection = function () {
        var range = getSelectedRange();
        var commentText = '//';
        if (thisPlugin.properties.handler !== 'Script') {
            commentText = '--';
        }
        for (var line = range.from.line; line <= range.to.line; line++) {
            var originalLine = thisPlugin.myCodeMirror.getLine(line);
            var trimmedLine = $.trim(originalLine);
            if (originalLine.indexOf(commentText) === 0) {
                var unCommentedLine = originalLine.replace(commentText, '');
                thisPlugin.myCodeMirror.setLine(line, unCommentedLine)
            }
        }
    };

    var indentSelection = function (dir) {
        var range = getSelectedRange();
        for (var line = range.from.line; line <= range.to.line; line++) {
            var originalLine = thisPlugin.myCodeMirror.indentLine(line, dir);
        }
    };

    var autoFormatSelection = function () {
        var range = getSelectedRange();
        thisPlugin.myCodeMirror.autoFormatRange(range.from, range.to);
    };

    var lastSearch = '';
    var searchCursor = undefined;
    var foundAny = false;

    if (thisPlugin.properties.handler !== 'Script') {
        jqEl.find('.check-syntax').hide();
    }

    jqEl.off('click.twCodeEditor', '.toolbar-cmd');
    jqEl.on('click.twCodeEditor', '.toolbar-cmd', function (e) {
        var btn = $(e.target).closest('.toolbar-cmd');
        var cmd = btn.attr('cmd');
        switch (cmd) {
            case 'undo':
                thisPlugin.myCodeMirror.undo();
                break;

            case 'redo':
                thisPlugin.myCodeMirror.redo();
                break;

            case 'comment':
                commentSelection();
                break;

            case 'uncomment':
                unCommentSelection();
                break;

            case 'format':
                autoFormatSelection();
                break;

            case 'indent-left':
                indentSelection(false);
                break;

            case 'indent-right':
                indentSelection(true);
                break;

            case 'find':
                var text = jqEl.find('.filter-text').val();
                if (text !== lastSearch) {
                    searchCursor = thisPlugin.myCodeMirror.getSearchCursor(text.toLowerCase(), false /*searchAll*/ , true /*caseFold*/ );
                    lastSearch = text;
                    foundAny = false;
                }

                if (searchCursor !== undefined) {
                    if (searchCursor.findNext()) {
                        foundAny = true;
                        searchCursor.doc.cm.setSelection(searchCursor.pos.from, searchCursor.pos.to, "CodeMirror-searching");
                        //searchCursor.doc.cm.markText(searchCursor.pos.from, searchCursor.pos.to, "CodeMirror-searching");
                    } else {
                        // start at beginning if we're at the end
                        if (foundAny) {
                            searchCursor = thisPlugin.myCodeMirror.getSearchCursor(text.toLowerCase(), false /*searchAll*/ , true /*caseFold*/ );
                            searchCursor.findNext();
                            searchCursor.doc.cm.setSelection(searchCursor.pos.from, searchCursor.pos.to, "CodeMirror-searching");
                            TW.IDE.twPopoverNotification('info', btn, TW.IDE.I18NController.translate("tw.code-editor.editor.find-restarted"));
                        } else {
                            TW.IDE.twPopoverNotification('warning', btn, TW.IDE.I18NController.translate("tw.code-editor.editor.find-empty", {
                                findEmpty: lastSearch
                            }));
                        }
                    }
                }
                thisPlugin.myCodeMirror.focus();

                break;

            case 'replace':
                var replacementText = jqEl.find('.replace-text').val();
                if (typeof replacementText === 'undefined' || replacementText.length === 0) {
                    TW.IDE.twPopoverNotification('info', btn, TW.IDE.I18NController.translate("tw.code-editor.editor.replace-no-text-entered"));
                    return;
                }
                thisPlugin.myCodeMirror.replaceSelection(replacementText);
                TW.IDE.twPopoverNotification('info', btn, TW.IDE.I18NController.translate("tw.code-editor.editor.replace-notify", {
                    replaceNotify: replacementText
                }));
                thisPlugin.myCodeMirror.focus();
                break;

            case 'replace-all':
                var text = jqEl.find('.filter-text').val();
                var replacementText = jqEl.find('.replace-text').val();
                if (text.length === 0) {
                    TW.IDE.twPopoverNotification('warning', jqEl.find('.filter-text'), TW.IDE.I18NController.translate("tw.code-editor.editor.search-and-replace-no-text-entered"));
                    return;
                }
                searchCursor = thisPlugin.myCodeMirror.getSearchCursor(text.toLowerCase(), false /*searchAll*/ , true /*caseFold*/ );

                var nReplaced = 0;
                while (searchCursor.findNext()) {
                    searchCursor.doc.cm.setSelection(searchCursor.pos.from, searchCursor.pos.to, "CodeMirror-searching");
                    thisPlugin.myCodeMirror.replaceSelection(replacementText);
                    nReplaced++;
                }
                TW.IDE.twPopoverNotification('info', btn, TW.IDE.I18NController.translate("tw.code-editor.editor.replace-all-notify", {
                    replaceAll1: nReplaced,
                    replaceAll2: text,
                    replaceAll3: replacementText
                }));
                thisPlugin.myCodeMirror.focus();
                break;

            case 'syntax-check':
                // http://localhost:8080/Thingworx/Resources/ScriptServices/Services/CheckScript?Accept=application%2Fjson&method=post
                thisPlugin.checkSyntax(true /*showSuccess*/ );
                break;
            default:
                alert('"' + cmd + '" coming soon...');
                break;
        }
    });
}