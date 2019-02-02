
import { DEFAULT_EDITOR_SETTINGS } from "./constants";
import { MonacoCodeEditor } from "./editors/basicCodeEditor";
import { TypescriptCodeEditor } from "./editors/typescript/typescriptCodeEditor";
var t = window["define"];
t('thingworx-ui-platform/components/editor/abstract-editor', ['exports', 'aurelia-i18n', 'aurelia-dependency-injection', 'lodash', 'jquery', 'codemirror', './codemirror-gutter-message-manager', '../../util/common-util', '../../util/object-util', '../../helpers/loader-helper', '../../events/channel-events', '../../events/event-helper', '../../services/user-service', '../../services/entity-service-base', 'codemirror/mode/css/css', 'codemirror/mode/javascript/javascript', 'codemirror/mode/xml/xml', 'codemirror/mode/sql/sql', 'codemirror/addon/selection/mark-selection', 'codemirror/addon/search/search', 'codemirror/addon/search/searchcursor', 'codemirror/addon/dialog/dialog', 'codemirror/addon/edit/matchbrackets', 'codemirror/addon/search/match-highlighter', 'codemirror/addon/hint/show-hint', 'codemirror/addon/hint/javascript-hint', 'codemirror/addon/fold/foldcode', 'codemirror/addon/fold/foldgutter', 'codemirror/addon/fold/brace-fold', 'codemirror/addon/fold/comment-fold', 'codemirror/addon/fold/indent-fold'], function (exports, _aureliaI18n, _aureliaDependencyInjection, _lodash, _jquery, _codemirror, _codemirrorGutterMessageManager, _commonUtil, _objectUtil, _loaderHelper, _channelEvents, _eventHelper, _userService, _entityServiceBase) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });
    exports.AbstractEditor = undefined;

    var _lodash2 = _interopRequireDefault(_lodash);

    var _jquery2 = _interopRequireDefault(_jquery);

    var _codemirror2 = _interopRequireDefault(_codemirror);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    _loaderHelper.LoaderHelper.importPlatformCss('/components/editor/codemirror-gutter-message.css');

    var SUPPORTED_LANG_MODES = ['javascript', 'text/x-sql', 'xml', 'json', 'css'];

    var DEFAULT_EDITOR_OPTIONS = {
        lineNumbers: true,
        indentUnit: 4,
        matchBrackets: true,
        highlightSelectionMatches: true,
        styleSelectedText: true,
        foldGutter: true,
        messageGutter: true
    };

    var AbstractEditor = exports.AbstractEditor = function () {
        function AbstractEditor(element, userService) {
            var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                eventHelperGroupName = _ref.eventHelperGroupName,
                langMode = _ref.langMode,
                editorOptions = _ref.editorOptions,
                _ref$valueField = _ref.valueField,
                valueField = _ref$valueField === undefined ? 'value' : _ref$valueField;

            _classCallCheck(this, AbstractEditor);

            this.TWX_MSG_GUTTER_ID = 'CodeMirror-twxmsg-markers';
            this.cursor = {
                line: 0,
                col: 0
            };
            this.action = '';
            this.actionHandler = this.editAction.bind(this);

            this.element = element;
            this.userService = userService;
            this.eventHelper = new _eventHelper.EventHelper(eventHelperGroupName || 'AbstractCodeEditor');
            this.langMode = _lodash2.default.defaults(langMode, { name: 'javascript', globalVars: true });
            this.valueField = valueField;
            if (SUPPORTED_LANG_MODES.indexOf(this.langMode.name) === -1) {
                throw new Error('Not supported language mode: ' + (this.langMode.name || 'unknown'));
            }
            this.$fontSizePopover = undefined;
            this._init(editorOptions);
        }

        AbstractEditor.prototype.attached = function attached() {
            (0, _jquery2.default)(this.element).find('.form-group').append((0, _jquery2.default)('<div class="editor-loading"></div>'));
            this.eventHelper.subscribe(_channelEvents.ChannelNames.CODE_SYNTAX_CHECK, this.checkSyntax.bind(this));
            this.eventHelper.subscribe(_channelEvents.ChannelNames.PREFERENCE_CHANGED, this._preferenceChanged.bind(this));
            this._initCodeMirrorDebounced();
            this._initFontSizePopoverDebounced();
        };

        AbstractEditor.prototype.detached = function detached() {
            this.eventHelper.destroyAll();
            this.destroy();
        };

        AbstractEditor.prototype.readOnlyChanged = function readOnlyChanged(newVal, oldVal) {
            if (_lodash2.default.isUndefined(oldVal)) {
                return;
            }
            this.readOnly = _objectUtil.ObjectUtil.asBoolean(newVal) || false;
            this._initCodeMirrorDebounced();
        };

        AbstractEditor.prototype.cursorChanged = function cursorChanged() {
            this._setCursor();
        };

        AbstractEditor.prototype.valueChanged = function valueChanged() {
            this.refreshDisplay();
        };

        AbstractEditor.prototype.visibleChanged = function visibleChanged(newval) {
            if (newval) {
                this._initCodeMirrorDebounced();
            }
        };

        AbstractEditor.prototype.refreshDisplay = function refreshDisplay() {
            if (_lodash2.default.isNil(this._getValue())) {
                return;
            }

            if (!this.codeMirror) {
                this._initCodeMirrorDebounced();
                return;
            }

            if (this.codeMirror.getValue() !== this._getValue()) {
                this.codeMirror.setValue(this._getValue());
            }
        };

        AbstractEditor.prototype.editAction = function editAction(newVal) {
            if (!newVal) {
                return;
            }

            var action = _lodash2.default.isString(newVal) ? newVal : newVal.action;
            switch (action) {
                case 'UNDO':
                    this.undo();
                    break;

                case 'REDO':
                    this.redo();
                    break;

                case 'COMMENT':
                    this.commentSelection();
                    break;

                case 'UNCOMMENT':
                    this.unCommentSelection();
                    break;

                case 'INDENT-LEFT':
                    this.indentSelection(false);
                    break;

                case 'INDENT-RIGHT':
                    this.indentSelection(true);
                    break;

                case 'AUTO-FORMAT':
                    this.autoFormatSelection();
                    break;

                case 'FIND':
                    this.find();
                    break;

                case 'REPLACE':
                    this.replace();
                    break;

                case 'REPLACE-ALL':
                    this.replaceAll(newVal.findString, newVal.replaceString);
                    break;

                case 'FOLD-ALL':
                    this._handleFolding('fold');
                    break;

                case 'UNFOLD-ALL':
                    this._handleFolding('unfold');
                    break;

                case 'CHECK-SYNTAX':
                    this.checkSyntax({ closeEditorOnValid: false });
                    break;

                case 'FONT-RESIZE':
                    this.showFontSizePopover();
                    break;

                case 'LINT':
                    this.editorOptions.linting = true;
                    this.lint(this.editorOptions);
                    break;

                case 'NOLINT':
                    this.editorOptions.linting = false;
                    this.lint(this.editorOptions);
                    break;

                default:
                    alert(action);
                    break;
            }
        };

        AbstractEditor.prototype.initialized = function initialized() { };

        AbstractEditor.prototype.destroy = function destroy() { };

        AbstractEditor.prototype.undo = function undo() {
            this.codeMirror.undo();
        };

        AbstractEditor.prototype.redo = function redo() {
            this.codeMirror.redo();
        };

        AbstractEditor.prototype.commentSelection = function commentSelection() {
            console.assert(false, 'commentSelection invoked by not implemented!');
        };

        AbstractEditor.prototype.unCommentSelection = function unCommentSelection() {
            console.assert(false, 'unCommentSelection invoked by not implemented!');
        };

        AbstractEditor.prototype.checkSyntax = function checkSyntax() {
            var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            console.assert(false, 'checkSyntax invoked by not implemented!');
        };

        AbstractEditor.prototype.lint = function lint() {
            var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

            console.assert(!this.editorOptions.lint, 'lint specified by not implemented!');
        };

        AbstractEditor.prototype.cursorActivity = function cursorActivity(cm, event) { };

        AbstractEditor.prototype.keydown = function keydown(cm, event) {
            if (_lodash2.default.has(this, 'entityModel.servicesModel.editModel.name')) {
                this.eventHelper.publish(_channelEvents.ChannelNames.ENTITY_DETAIL_CHANGE, {
                    action: 'code updated',
                    category: 'services',
                    entityModel: this.entityModel,
                    objectName: this.entityModel.servicesModel.editModel.name
                });
            }
        };

        AbstractEditor.prototype.blur = function blur(cm, event) { };

        AbstractEditor.prototype.indentSelection = function indentSelection(dir) {
            var range = this._getSelectedRange();
            for (var line = range.from.line; line <= range.to.line; line++) {
                this.codeMirror.indentLine(line, dir);
            }
        };

        AbstractEditor.prototype.autoFormatSelection = function autoFormatSelection() {
            var range = this._getSelectedRange();
            this.codeMirror.autoFormatRange(range.from, range.to);
        };

        AbstractEditor.prototype.find = function find() {
            this.codeMirror.execCommand('find');
        };

        AbstractEditor.prototype.replace = function replace() {
            this.codeMirror.execCommand('replace');
        };

        AbstractEditor.prototype.replaceAll = function replaceAll(findString, replaceString) {
            if (findString.length === 0) {
                alert('must enter some text to search for...');
                return;
            }
            this.searchCursor = this.codeMirror.getSearchCursor(findString.toLowerCase(), false, true);

            var nReplaced = 0;
            while (this.searchCursor.findNext()) {
                this.searchCursor.doc.cm.setSelection(this.searchCursor.pos.from, this.searchCursor.pos.to, 'CodeMirror-searching');
                this.codeMirror.replaceSelection(replaceString);
                nReplaced++;
            }
            this.codeMirror.focus();
        };

        AbstractEditor.prototype.insertTextIntoEditor = function insertTextIntoEditor(_ref2) {
            var text = _ref2.text,
                _ref2$keepSelected = _ref2.keepSelected,
                keepSelected = _ref2$keepSelected === undefined ? true : _ref2$keepSelected;

            var cursorPositionBefore = this.codeMirror.getCursor(true);
            this.codeMirror.replaceSelection(text);
            var cursorPositionAfter = this.codeMirror.getCursor(true);

            if (keepSelected) {
                this.codeMirror.doc.setSelection({ line: cursorPositionBefore.line, ch: cursorPositionBefore.ch }, { line: cursorPositionAfter.line, ch: cursorPositionAfter.ch });
            }

            this.codeMirror.focus();
        };

        AbstractEditor.prototype.showFontSizePopover = function showFontSizePopover() {
            var _this = this;

            this.$fontSizePopover.popover('show');
            this.$fontSizePopover.on('shown.bs.popover', function () {
                _this._initFontSizePopoverEvent();
            });
            this.$fontSizePopover.on('hide.bs.popover', function () {
                _this._clearFontSizePopoverEvent();
            });
        };

        AbstractEditor.prototype._init = function _init(opts) {
            var container = _aureliaDependencyInjection.Container.instance || new _aureliaDependencyInjection.Container();
            this.gutterMsgManager = container.get(_codemirrorGutterMessageManager.CodemirrorGutterMessageManager);
            this.entityService = container.get(_entityServiceBase.EntityServiceBase);
            this.i18n = container.get(_aureliaI18n.I18N);

            this.editorOptions = _lodash2.default.defaults(opts, DEFAULT_EDITOR_OPTIONS);
            this._setGuttersOption();
            this._initCodeMirrorDebounced = _lodash2.default.debounce(this._initCodeMirror.bind(this), 150);
            this._initFontSizePopoverDebounced = _lodash2.default.debounce(this._initFontSizePopover.bind(this), 150);
        };

        AbstractEditor.prototype._initFontSizePopover = function _initFontSizePopover() {
            this.$fontSizePopover = (0, _jquery2.default)(this.element).find('.font-resize-btn');
            var template = '<div class="popover font-size-list-popover" role="tooltip">' + '    <div class="arrow"></div>' + '    <div class="popover-body"></div>' + '</div>';

            var smallText = this.i18n.tr('tw.font-size.small');
            var normalText = this.i18n.tr('tw.font-size.normal');
            var largeText = this.i18n.tr('tw.font-size.large');

            var content = '<ul class="font-size-list">' + '    <li class="editor-font-size-small">' + smallText + '</li>' + '    <li class="editor-font-size-normal">' + normalText + '</li>' + '    <li class="editor-font-size-large">' + largeText + '</li>' + '</ul>';

            var opts = {
                content: content,
                html: true,
                placement: 'bottom',
                template: template,
                trigger: 'manual'
            };
            this.$fontSizePopover.popover(opts);
        };

        AbstractEditor.prototype._captureFontClass = function _captureFontClass(targetElement) {
            var className = (0, _jquery2.default)(targetElement.target).attr('class');
            this._setEditorFont(className);
            this.userPreferences[_userService.UserPreferenceKeys.SERVICE_EDITOR_FONT_SIZE] = className;
            this.userService.setUserPersistentValue(_userService.UserSessionInfoKeys.USER_PREFERENCES, this.userPreferences);
            this._closeFontSizePopover();
        };

        AbstractEditor.prototype._getUserFontClassName = function _getUserFontClassName(userPreferences) {
            return _lodash2.default.get(userPreferences, _userService.UserPreferenceKeys.SERVICE_EDITOR_FONT_SIZE, 'editor-font-size-normal');
        };

        AbstractEditor.prototype._setEditorFont = function _setEditorFont(fontClassName) {
            var element = this.codeMirror.getWrapperElement();
            _lodash2.default.forEach((0, _jquery2.default)(element).attr('class').split(' '), function (className) {
                if (_lodash2.default.startsWith(className, 'editor-font-size')) {
                    (0, _jquery2.default)(element).removeClass(className);
                }
            });
            (0, _jquery2.default)(element).addClass(fontClassName);
            this.codeMirror.refresh();
        };

        AbstractEditor.prototype._closeFontSizePopover = function _closeFontSizePopover() {
            this.$fontSizePopover.popover('hide');
            this.$fontSizePopover.off('shown.bs.popover');
            this.$fontSizePopover.off('hide.bs.popover');
        };

        AbstractEditor.prototype._initFontSizePopoverEvent = function _initFontSizePopoverEvent() {
            (0, _jquery2.default)('.font-size-list li').on('click', this._captureFontClass.bind(this));
            (0, _jquery2.default)('body').on('click', this._closeFontSizePopover.bind(this));
            var element = this.codeMirror.getWrapperElement();
            var currentFontSize = 'editor-font-size-normal';
            _lodash2.default.forEach((0, _jquery2.default)(element).attr('class').split(' '), function (className) {
                var retValue = true;
                if (_lodash2.default.startsWith(className, 'editor-font-size')) {
                    currentFontSize = className;
                    retValue = false;
                }
                return retValue;
            });
            (0, _jquery2.default)('.font-size-list li').each(function (index, ele) {
                if ((0, _jquery2.default)(ele).attr('class').indexOf(currentFontSize) >= 0) {
                    (0, _jquery2.default)(ele).addClass('editor-font-selected');
                }
            });
        };

        AbstractEditor.prototype._clearFontSizePopoverEvent = function _clearFontSizePopoverEvent() {
            (0, _jquery2.default)('.font-size-list li').off('click');
            (0, _jquery2.default)('.font-size-list li span').off('click');
            (0, _jquery2.default)('body').off('click');
        };

        AbstractEditor.prototype._setGuttersOption = function _setGuttersOption() {
            var gutters = this.editorOptions.gutters = this.editorOptions.gutters || [];

            if (this.editorOptions.lineNumbers) {
                gutters.push('CodeMirror-linenumbers');
            }

            if (this.editorOptions.foldGutter) {
                gutters.push('CodeMirror-foldgutter');
            }

            if (this.editorOptions.messageGutter) {
                var gutterId = this.TWX_MSG_GUTTER_ID;
                gutters.push(gutterId);
                this.editorOptions.twxMsgGutterId = gutterId;
            }
        };

        AbstractEditor.prototype._initCodeMirror = function _initCodeMirror() {
            var _this2 = this;

            (0, _jquery2.default)(this.element).find('.editor-loading').css('display', 'block');
            this._cleanupCodeMirror();

            var opts = {
                readOnly: this.readOnly ? 'nocursor' : false,
                mode: this.langMode
            };

            var cmOptions = Object.assign({}, this.editorOptions, opts);

            if (window.TWX.debug) {
                console.log('CodeMirror initialization options', cmOptions);
            }

            function convertHandlerToMonacoLanguage(language: string): string {
                let mapping = {
                    "text/x-sql": 'sql',
                    'javascript': 'twxJavascript',
                    'xml': 'xml',
                    'css': 'css'
                }
                return mapping[language];
            }

            _lodash2.default.defer(function () {
                if (!_this2.cmTextarea) {
                    return;
                }
                _this2._getUserPreferences().then(function (prefs) {
                    _this2.userPreferences = prefs;
                    _this2._initEditorTheme(_this2.userPreferences);
                    cmOptions.theme = _this2.theme;
                    let editorClass;
                    if (cmOptions.mode.name == 'twxTypescript' || cmOptions.mode.name == 'javascript') {
                        editorClass = TypescriptCodeEditor;
                    } else {
                        editorClass = MonacoCodeEditor;
                    }
                    var container = _this2.cmTextarea.parentElement;
                    container.innerHTML = "";
                    // else create a new one
                    _this2.codeMirror = new editorClass(container, { editor: DEFAULT_EDITOR_OPTIONS }, {
                        onClose: () => {
                            console.log("close action")
                        },
                        onSave: () => {
                            console.log("save action")
                        }, onDone: () => {
                            console.log("done action")
                        }, onTest: () => {
                            console.log("test action")
                        }, onPreferencesChanged: (preferences) => {
                            console.log("preferences action " + preferences)
                        }
                    },
                        {
                            code: _this2.cmTextarea.value,
                            language: convertHandlerToMonacoLanguage(cmOptions.mode.name),
                            modelName: "Test" + Math.random(),
                            readonly: cmOptions.readOnly
                        });

                    // _this2.codeMirror = _codemirror2.default.fromTextArea(_this2.cmTextarea, cmOptions);
                    _this2.initialized();

                    if (_this2.element) {
                        _this2.codeMirror.onEditorContentChange(function (code) {
                            if (code !== _this2._getValue()) {
                                _this2._setValue(code);
                                _commonUtil.CommonUtil.fireChangeEvent(_this2.element, code);
                            }
                        });

                        _this2.codeMirror.on('cursorActivity', function (cm, event) {
                            _this2.cursorActivity(cm, event);
                        });

                        _this2.codeMirror.on('keydown', function (cm, event) {
                            _this2.keydown(cm, event);
                        });

                        _this2.codeMirror.on('blur', function (cm, event) {
                            _this2.blur(cm, event);
                        });

                        _this2._setEditorFont(_this2._getUserFontClassName(_this2.userPreferences));
                    }

                    if (cmOptions.twxMsgGutterId) {
                        _this2.gutterMsgManager.initMessageGutter(_this2.codeMirror, cmOptions.twxMsgGutterId);
                        _this2._lintIfConfigured();
                    }

                    _this2._setCursor();
                    (0, _jquery2.default)(_this2.element).find('.editor-loading').css('display', 'none');
                });
            });
        };

        AbstractEditor.prototype._getValue = function _getValue() {
            return _lodash2.default.get(this, this.valueField);
        };

        AbstractEditor.prototype._setValue = function _setValue(newVal) {
            _lodash2.default.set(this, this.valueField, newVal);
        };

        AbstractEditor.prototype._lintIfConfigured = function _lintIfConfigured() {
            if (this.editorOptions.lint) {
                this.lint(this.editorOptions);
            }
        };

        AbstractEditor.prototype._cleanupCodeMirror = function _cleanupCodeMirror() {
            if (!this.codeMirror) {
                return;
            }
            this.codeMirror.dispose();
        };

        AbstractEditor.prototype._getSelectedRange = function _getSelectedRange() {
            return { from: this.codeMirror.getCursor(true), to: this.codeMirror.getCursor(false) };
        };

        AbstractEditor.prototype._setLine = function _setLine(text, line, originalTextLength) {
            this.codeMirror.replaceRange(text, { line: line, ch: 0 }, { line: line, ch: originalTextLength });
        };

        AbstractEditor.prototype._handleFolding = function _handleFolding(action) {
            var cm = this.codeMirror;
            for (var i = cm.firstLine(), e = cm.lastLine(); i <= e; i++) {
                cm.foldCode(_codemirror2.default.Pos(i, 0), null, action);
            }
        };

        AbstractEditor.prototype._getUserPreferences = function _getUserPreferences() {
            return this.userService.getUserPersistentValue(_userService.UserSessionInfoKeys.USER_PREFERENCES);
        };

        AbstractEditor.prototype._initEditorTheme = function _initEditorTheme(userPreferences) {
            this.theme = _lodash2.default.get(userPreferences, _userService.UserPreferenceKeys.SERVICE_EDITOR_THEME, 'twx-editor-light');

            _loaderHelper.LoaderHelper.importCss('/resources/styles/editor-themes/' + this.theme + '.css', true);
        };

        AbstractEditor.prototype._preferenceChanged = function _preferenceChanged(data) {
            if (data.name === _userService.UserSessionInfoKeys.USER_PREFERENCES) {
                var compKey = 'value.' + _userService.UserPreferenceKeys.SERVICE_EDITOR_THEME;
                var prefTheme = _lodash2.default.get(data, compKey);
                if (prefTheme) {
                    this._themeChanged(prefTheme, this.theme);
                }
            }
        };

        AbstractEditor.prototype._themeChanged = function _themeChanged(newVal, oldVal) {
            if (!newVal || newVal === oldVal) {
                return;
            }
            this._initCodeMirrorDebounced();
        };

        AbstractEditor.prototype._setCursor = function _setCursor() {
            if (_commonUtil.CommonUtil.isEmpty(this.cursor) || _commonUtil.CommonUtil.isEmpty(this.codeMirror)) {
                return;
            }

            if (this.cursor === this.codeMirror.getCursor(true)) {
                return;
            }

            this.codeMirror.setCursor(this.cursor);
            this.codeMirror.focus();
        };

        return AbstractEditor;
    }();
});