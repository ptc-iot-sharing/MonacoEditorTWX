TW.jqPlugins.twCodeEditor.prototype.showCodeProperly = function () {
        var thisPlugin = this;
        var jqEl = thisPlugin.jqElement;
        var codeTextareaElem = jqEl.find('.actual-code');

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

        thisPlugin.myCodeMirror = CodeMirror.fromTextArea(codeTextareaElem[0], {
            mode: mode,
            lineNumbers: true,
            //fixedGutter: false,
            indentUnit: 4,
            theme: 'eclipse',
            readOnly: !thisPlugin.properties.editMode,
            matchBrackets: true
        });

        thisPlugin.myCodeMirror.on('change', function (cm, info) {
            /*
             When given, this function will be called every time the content of the editor is changed. It will be given the
             editor instance as first argument, and an {from, to, text, next} object containing information about the changes
             that occurred as second argument. from and to are the positions (in the pre-change coordinate system) where the
             change started and ended (for example, it might be {ch:0, line:18} if the position is at the beginning of line #19).
             text is an array of strings representing the text that replaced the changed range (split by line). If multiple
             changes happened during a single operation, the object will have a next property pointing to another change
             object (which may point to another, etc).
             */
            thisPlugin.properties.code = cm.getValue();
            thisPlugin.properties.change(thisPlugin.properties.code);
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