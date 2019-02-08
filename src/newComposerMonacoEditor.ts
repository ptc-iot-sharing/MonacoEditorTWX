import { DEFAULT_EDITOR_SETTINGS } from "./constants";
import { MonacoCodeEditor } from "./editors/basicCodeEditor";
import { TypescriptCodeEditor } from "./editors/typescript/typescriptCodeEditor";
var t = window["define"];
t(
  "thingworx-ui-platform/features/details/editor/abstract-editor",
  [
    "exports",
    "aurelia-i18n",
    "aurelia-dependency-injection",
    "lodash",
    "jquery",
    "codemirror",
    "./codemirror-gutter-message-manager",
    "thingworx-ui-platform/util/common-util",
    "thingworx-ui-platform/util/object-util",
    "thingworx-ui-platform/helpers/loader-helper",
    "thingworx-ui-platform/events/channel-events",
    "thingworx-ui-platform/events/event-helper",
    "thingworx-ui-platform/services/user-service",
    "thingworx-ui-platform/services/entity-service-base",
    "codemirror/mode/css/css",
    "codemirror/mode/javascript/javascript",
    "codemirror/mode/xml/xml",
    "codemirror/mode/sql/sql",
    "codemirror/addon/selection/mark-selection",
    "codemirror/addon/search/search",
    "codemirror/addon/search/searchcursor",
    "codemirror/addon/dialog/dialog",
    "codemirror/addon/edit/matchbrackets",
    "codemirror/addon/search/match-highlighter",
    "codemirror/addon/hint/show-hint",
    "codemirror/addon/hint/javascript-hint",
    "codemirror/addon/fold/foldcode",
    "codemirror/addon/fold/foldgutter",
    "codemirror/addon/fold/brace-fold",
    "codemirror/addon/fold/comment-fold",
    "codemirror/addon/fold/indent-fold"
  ],
  function(exports, I18N, Container, _, $, CodeMirror, CodemirrorGutterMessageManager, CommonUtil, ObjectUtil, LoaderHelper, ChannelNames, EventHelper, u, EntityServiceBase) {
    var {UserSessionInfoKeys, UserPreferenceKeys} = u;
    I18N= I18N["I18N"];
    Container= Container["Container"];
    CodemirrorGutterMessageManager= CodemirrorGutterMessageManager["CodemirrorGutterMessageManager"];
    CommonUtil= CommonUtil["CommonUtil"];
    ObjectUtil= ObjectUtil["ObjectUtil"];
    LoaderHelper= LoaderHelper["LoaderHelper"];
    ChannelNames= ChannelNames["ChannelNames"];
    EventHelper= EventHelper["EventHelper"];
    EntityServiceBase=EntityServiceBase["EntityServiceBase"];

    LoaderHelper.importPlatformCss('/features/details/editor/codemirror-gutter-message.css');

    const SUPPORTED_LANG_MODES = [
        'javascript',
        'text/x-sql',
        'xml', // not available yet
        'json', // not available yet
        'css'
    ];

    const DEFAULT_EDITOR_OPTIONS = {
        lineNumbers:               true,
        indentUnit:                4,
        matchBrackets:             true,
        highlightSelectionMatches: true,
        styleSelectedText:         true,
        foldGutter:                true,
        messageGutter:             true
    };
    /**
     * An abstract class implementation for code editing.
     * ---
     * __Usage:__
     *   When you create a new code editor, i.e. javascript or json, you have to extends this class.
     *   It provides most of the necessary editing functions out of the box.
     *
     *   ViewModel:
     *     Just extends the class and call the super() with optional options
     *
     *       export class SimpleEditor extends AbstractEditor {
     *         @bindable readOnly = true;
     *         @bindable value;
     *
     *         constructor() {
     *             super();
     *         }
     *         attached() {
     *             super.attached();
     *         }
     *       }
     *   Template:
     *     In your template, you have to provide a textarea for CodeMirror
     *
     *       <textarea ref="cmTextarea" value.two-way="value"></textarea>
     *
     * @example
     *   More details please see DefaultEditor or ScriptEditor
     *
     * @note
     *   Because of the limitation of current version of Aurelia, we are not able to provide an inheritance way by using
     *   Aruelia component(or custom element).
     *
     * @class AbstractEditor
     */
    class AbstractEditor {
        TWX_MSG_GUTTER_ID = 'CodeMirror-twxmsg-markers';
    
        cursor = {
            line: 0,
            col:  0
        };
    
        action = '';
        element: any;
        userService: any;
        eventHelper: any;
        langMode: any;
        valueField: string;
        $fontSizePopover: any;
        readOnly: any;
        codeMirror: any;
        entityModel: any;
        searchCursor: any;
        gutterMsgManager: any;
        entityService: any;
        i18n: any;
        userPreferences: any;
        cmTextarea: any;
        theme: any;
    
        constructor(element, userService, {eventHelperGroupName=undefined, langMode=undefined, editorOptions=undefined, valueField = 'value'} = {}) {
            this.element = element;
            this.userService = userService;
            this.eventHelper = new EventHelper(eventHelperGroupName || 'AbstractCodeEditor');
            this.langMode = _.defaults(langMode, {name: 'javascript', globalVars: true});
            this.valueField = valueField;
            if (SUPPORTED_LANG_MODES.indexOf(this.langMode.name) === -1) {
                throw new Error(`Not supported language mode: ${this.langMode.name || 'unknown'}`);
            }
            this.$fontSizePopover = undefined;
            this._init(editorOptions);
    
        }
    
        //=======================================================================================================
        // == flowing can be used as protected methods in your subclasses =======================================
        attached() {
            $(this.element).find('.form-group').append($('<div class="editor-loading"></div>'));
            this.eventHelper.subscribe(ChannelNames.CODE_SYNTAX_CHECK, this.checkSyntax.bind(this));
            this.eventHelper.subscribe(ChannelNames.PREFERENCE_CHANGED, this._preferenceChanged.bind(this));
            this._initCodeMirrorDebounced();
            this._initFontSizePopoverDebounced();
        }
        _initCodeMirrorDebounced(): any {
            throw new Error("Method not implemented.");
        }
        _initFontSizePopoverDebounced(): any {
            throw new Error("Method not implemented.");
        }
    
        detached() {
            this.eventHelper.destroyAll();
            this.destroy();
        }
    
        readOnlyChanged(newVal, oldVal) {
            if (_.isUndefined(oldVal)) {
                return;
            }
            this.readOnly = ObjectUtil.asBoolean(newVal) || false;
            this._initCodeMirrorDebounced();
        }
    
        cursorChanged() {
            this._setCursor();
        }
    
        valueChanged() {
            this.refreshDisplay();
        }
    
        /**
         * Because the editor can initially be rendered inside a hidden div, this flag allows the editor to react when it becomes visible and
         * re-align all styles.
         *
         * @param newval {boolean}
         */
        visibleChanged(newval) {
            if (newval) {
                this._initCodeMirrorDebounced();
            }
        }
    
        /**
         * Sometimes when setting the value programatically - codeMirror needs special processing
         * in order to refresh the display. There is a refresh method but it doesn't seem to be functioning.
         */
        refreshDisplay() {
            if (_.isNil(this._getValue())) {
                return;
            }
    
            if (!this.codeMirror) {
                this._initCodeMirrorDebounced();
                return;
            }
    
            if (this.codeMirror.getValue() !== this._getValue()) {
                this.codeMirror.setValue(this._getValue());
            }
        }
    
        actionHandler = this.editAction.bind(this);
    
        editAction(newVal) {
            if (!newVal) {
                return;
            }
    
            let action = _.isString(newVal) ? newVal : newVal.action;
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
                    //this.find(newVal.findString);
                    this.find();
                    break;
    
                case 'REPLACE':
                    //this.replace(newVal.replaceString);
                    this.replace();
                    break;
    
                //no longer called directly
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
                    this.checkSyntax({closeEditorOnValid: false});
                    break;
    
                case 'FONT-RESIZE':
                    this.showFontSizePopover();
                    break;
    
                case 'LINT':
                    this.setLinting(true);
                    this.lint(this.editorOptions);
                    break;
    
                case 'NOLINT':
                    this.setLinting(false);
                    this.lint(this.editorOptions);
                    break;
    
                default :
                    alert(action);
                    break;
            }
        }
        editorOptions(editorOptions: any): any {
            throw new Error("Method not implemented.");
        }
    
        initialized() {
            // override if you want this functionality;
        }
    
        destroy() {
            // override if you want this functionality;
        }
    
        undo() {
            this.codeMirror.undo();
        }
    
        redo() {
            this.codeMirror.redo();
        }
    
        commentSelection() {
            console.assert(false, 'commentSelection invoked by not implemented!');
        }
    
        unCommentSelection() {
            console.assert(false, 'unCommentSelection invoked by not implemented!');
        }
    
        checkSyntax(opts = {}) {
            console.assert(false, 'checkSyntax invoked by not implemented!');
        }
    
        lint(opts = {}) {
            // override if you want this functionality;
        };
    
        setLinting(lint) {
            // override if you want this functionality;
        }
    
        getLinting() {
            return false;
        }
    
        cursorActivity(cm, event) {
            // override if you want this functionality;
        }
    
        keydown(cm, event) {
            // override if you want this functionality;
            if (_.has(this, 'entityModel.servicesModel.editModel.name')) {
                this.eventHelper.publish(ChannelNames.ENTITY_DETAIL_CHANGE, {
                    action:      'code updated',
                    category:    'services',
                    entityModel: this.entityModel,
                    objectName:  this.entityModel.servicesModel.editModel.name
                });
            }
        }
    
        blur(cm, event) {
            // override if you want this functionality;
        }
    
        indentSelection(dir) {
            let range = this._getSelectedRange();
            let scrollInfo = this.codeMirror.getScrollInfo();
            let lines = this.codeMirror.getValue().split('\n');
            let spacer = _.get(this.codeMirror, 'options.indentWithTabs', false) ? '\t'
                : new Array(_.get(this.codeMirror, 'options.indentUnit', 4) + 1).join(' ');
            let from = _.get(range, 'from');
            let to = _.get(range, 'to');
            let modified = [];
    
            _.forEach(lines, (line, index) => {
                if (index >= from.line && index <= to.line) {
                    if (!dir) {
                        modified.push(line.replace(new RegExp('^' + spacer), ''));
                    } else {
                        modified.push(spacer + line);
                    }
                } else {
                    modified.push(line);
                }
            });
    
            this._setValue(modified.join('\n'));
            this.refreshDisplay();
            to.ch += (dir) ? spacer.length : Math.max(0, -1 * spacer.length);
            this.codeMirror.extendSelection(from, to);
            this.codeMirror.scrollTo(0, scrollInfo.top);
    
        }
    
        autoFormatSelection() {
            // override if you want this functionality;
        }
    
        find() {
            this.codeMirror.execCommand('find');
        }
    
        replace() {
            this.codeMirror.execCommand('replace');
        }
    
        replaceAll(findString, replaceString) {
            if (findString.length === 0) {
                alert('must enter some text to search for...');
                return;
            }
            this.searchCursor = this.codeMirror.getSearchCursor(findString.toLowerCase(), false/*searchAll*/, true/*caseFold*/);
    
            let nReplaced = 0;
            while (this.searchCursor.findNext()) {
                this.searchCursor.doc.cm.setSelection(this.searchCursor.pos.from, this.searchCursor.pos.to, 'CodeMirror-searching');
                this.codeMirror.replaceSelection(replaceString);
                nReplaced++;
            }
            this.codeMirror.focus();
        }
    
        insertTextIntoEditor({text, keepSelected = true}) {
            // Keep track of cursor position to highlight input parameter after inserting it
            let cursorPositionBefore = this.codeMirror.getCursor(true);
            this.codeMirror.replaceSelection(text);
            let cursorPositionAfter = this.codeMirror.getCursor(true);
    
            // Highlight input parameter after inserting it
            if (keepSelected) {
                this.codeMirror.doc.setSelection(
                    {line: cursorPositionBefore.line, ch: cursorPositionBefore.ch},
                    {line: cursorPositionAfter.line, ch: cursorPositionAfter.ch}
                );
            }
    
            this.codeMirror.focus();
        }
    
        showFontSizePopover() {
            this.$fontSizePopover.popover('show');
            this.$fontSizePopover.on('shown.bs.popover', () => {
                this._initFontSizePopoverEvent();
            });
            this.$fontSizePopover.on('hide.bs.popover', () => {
                this._clearFontSizePopoverEvent();
            });
        }
    
        //================================================================================================================
        //== following should be treated as private methods and subject to change without notifiying =====================
        _init(opts) {
            let container = Container.instance || new Container();
            this.gutterMsgManager = container.get(CodemirrorGutterMessageManager);
            this.entityService = container.get(EntityServiceBase);
            this.i18n = container.get(I18N);
    
            this.editorOptions = _.defaults(opts, DEFAULT_EDITOR_OPTIONS);
            this._setGuttersOption();
            this._initCodeMirrorDebounced = _.debounce(this._initCodeMirror.bind(this), 150);
            this._initFontSizePopoverDebounced = _.debounce(this._initFontSizePopover.bind(this), 150);
        }
    
        /**
         * This utility uses popovers and this routine initializes the popover for usage. It uses a custom template to
         * provide it's own set of classes for styling.
         *
         * @private
         */
    
        _initFontSizePopover() {
            this.$fontSizePopover = $(this.element).find('.font-resize-btn');
            let template = '<div class="popover font-size-list-popover" role="tooltip">' +
                           '    <div class="arrow"></div>' +
                           '    <div class="popover-body"></div>' +
                           '</div>';
    
            let smallText = this.i18n.tr('tw.font-size.small');
            let normalText = this.i18n.tr('tw.font-size.normal');
            let largeText = this.i18n.tr('tw.font-size.large');
    
            let content = '<ul class="font-size-list">' +
                          '    <li class="editor-font-size-small">' + smallText + '</li>' +
                          '    <li class="editor-font-size-normal">' + normalText + '</li>' +
                          '    <li class="editor-font-size-large">' + largeText + '</li>' +
                          '</ul>';
    
            let opts = {
                content:   content,
                html:      true,
                placement: 'bottom',
                template:  template,
                trigger:   'manual'
            };
            this.$fontSizePopover.popover(opts);
        }
    
        _captureFontClass(targetElement) {
            let className = $(targetElement.target).attr('class');
            this._setEditorFont(className);
            this.userPreferences[UserPreferenceKeys.SERVICE_EDITOR_FONT_SIZE] = className;
            this.userService.setUserPersistentValue(UserSessionInfoKeys.USER_PREFERENCES, this.userPreferences);
            this._closeFontSizePopover();
        }
    
        _getUserFontClassName(userPreferences) {
            return _.get(userPreferences, UserPreferenceKeys.SERVICE_EDITOR_FONT_SIZE, 'editor-font-size-normal');
        }
    
        _setEditorFont(fontClassName) {
            let element = this.codeMirror.getWrapperElement();
            _.forEach($(element).attr('class').split(' '), (className) => {
                if (_.startsWith(className, 'editor-font-size')) {
                    $(element).removeClass(className);
                }
            });
            $(element).addClass(fontClassName);
            this.codeMirror.refresh();
        }
    
        _closeFontSizePopover() {
            this.$fontSizePopover.popover('hide');
            this.$fontSizePopover.off('shown.bs.popover');
            this.$fontSizePopover.off('hide.bs.popover');
        }
    
        _initFontSizePopoverEvent() {
            $('.font-size-list li').on('click', this._captureFontClass.bind(this));
            $('body').on('click', this._closeFontSizePopover.bind(this));
            let element = this.codeMirror.getWrapperElement();
            let currentFontSize = 'editor-font-size-normal';
            _.forEach($(element).attr('class').split(' '), (className) => {
                let retValue = true;
                if (_.startsWith(className, 'editor-font-size')) {
                    currentFontSize = className;
                    retValue = false;
                }
                return retValue;
            });
            $('.font-size-list li').each((index, ele) => {
                if ($(ele).attr('class').indexOf(currentFontSize) >= 0) {
                    $(ele).addClass('editor-font-selected');
                }
            });
        }
    
        _clearFontSizePopoverEvent() {
            $('.font-size-list li').off('click');
            $('.font-size-list li span').off('click');
            $('body').off('click');
        }
    
        _setGuttersOption() {
            let gutters = this.editorOptions.gutters = this.editorOptions.gutters || [];
    
            if (this.editorOptions.lineNumbers) {
                gutters.push('CodeMirror-linenumbers');
            }
    
            if (this.editorOptions.foldGutter) {
                gutters.push('CodeMirror-foldgutter');
            }
    
            if (this.editorOptions.messageGutter) {
                let gutterId = this.TWX_MSG_GUTTER_ID;
                gutters.push(gutterId);
                this.editorOptions.twxMsgGutterId = gutterId;
            }
        }
    
        _initCodeMirror() {
            $(this.element).find('.editor-loading').css('display', 'block');
            this._cleanupCodeMirror();
    
            let opts = {
                readOnly: this.readOnly,
                mode:     this.langMode
            };
    
            let cmOptions = Object.assign({}, this.editorOptions, opts);
    
            if (window.TWX.debug) {
                console.log('CodeMirror initialization options', cmOptions);
            }
    
            _.defer(() => { // need to defer the composition in order for the script to show up without a click
                if (!this.cmTextarea) {
                    return;
                }
                this._getUserPreferences().then(prefs => {
                    this.userPreferences = prefs;
                    this._initEditorTheme(this.userPreferences);
                    cmOptions.theme = this.theme;
                    this.codeMirror = CodeMirror.fromTextArea(this.cmTextarea, cmOptions);
                    this.initialized();
    
                    if (this.element) {
                        let onChangeActionFn = (cm) => {
                            const newValue = cm.getValue();
                            if (newValue !== this._getValue()) {
                                this._setValue(newValue);
                                this._lintIfConfigured();
                                CommonUtil.fireChangeEvent(this.element, newValue);
                            }
                        };
                        let onChangeActionDebounced = _.debounce(onChangeActionFn.bind(this), 25);
                        this.codeMirror.on('changes', onChangeActionDebounced);
    
                        this.codeMirror.on('cursorActivity', (cm, event) => {
                            this.cursorActivity(cm, event);
                        });
    
                        this.codeMirror.on('keydown', (cm, event) => {
                            this.keydown(cm, event);
                        });
    
                        this.codeMirror.on('blur', (cm, event) => {
                            this.blur(cm, event);
                        });
    
                        this._setEditorFont(this._getUserFontClassName(this.userPreferences));
                    }
    
                    if (cmOptions.twxMsgGutterId) {
                        this.gutterMsgManager.initMessageGutter(this.codeMirror, cmOptions.twxMsgGutterId);
                        this._lintIfConfigured();
                    }
    
                    this._setCursor();
                    $(this.element).find('.editor-loading').css('display', 'none');
                });
    
            });
        }
    
        _getValue() {
            return _.get(this, this.valueField);
        }
    
        _setValue(newVal) {
            _.set(this, this.valueField, newVal);
        }
    
        _lintIfConfigured() {
            if (this.getLinting()) {
                this.lint(this.editorOptions);
            }
        }
    
        _cleanupCodeMirror() {
            if (!this.codeMirror) {
                return;
            }
            this.codeMirror.toTextArea();
    
        }
    
        _getSelectedRange() {
            return {from: this.codeMirror.getCursor(true), to: this.codeMirror.getCursor(false)};
        }
    
        _setLine(text, line, originalTextLength) {
            this.codeMirror.replaceRange(text, {line: line, ch: 0}, {line: line, ch: originalTextLength});
        }
    
        _handleFolding(action) {
            let cm = this.codeMirror;
            for (let i = cm.firstLine(), e = cm.lastLine(); i <= e; i++) {
                cm.foldCode(CodeMirror.Pos(i, 0), null, action);
            }
        }
    
        /**
         * Retrieve user preferences.
         *
         * @returns {Promise}
         * @private
         */
        _getUserPreferences() {
            return this.userService.getUserPersistentValue(UserSessionInfoKeys.USER_PREFERENCES);
        }
    
        /**
         * Retrieve the editor theme.  Will lazily load the CSS if it is not yet loaded.
         *
         * @returns {Promise}
         * @private
         */
        _initEditorTheme(userPreferences) {
            this.theme = _.get(userPreferences, UserPreferenceKeys.SERVICE_EDITOR_THEME, 'twx-editor-light');
            // load the theme in case it is not loaded yet
            LoaderHelper.importCss('/resources/styles/editor-themes/' + this.theme + '.css', true);
        }
    
        _preferenceChanged(data) {
            if (data.name === UserSessionInfoKeys.USER_PREFERENCES) {
                let compKey = 'value.' + UserPreferenceKeys.SERVICE_EDITOR_THEME;
                let prefTheme = _.get(data, compKey);
                if (prefTheme) {
                    this._themeChanged(prefTheme, this.theme);
                }
            }
        }
    
        /**
         * Called when the editor detects a preference change for theming
         *
         * @param newVal
         * @param oldVal
         * @private
         */
        _themeChanged(newVal, oldVal) {
            if (!newVal || newVal === oldVal) {
                return;
            }
            this._initCodeMirrorDebounced();
        }
    
        _setCursor() {
            if (CommonUtil.isEmpty(this.cursor) || CommonUtil.isEmpty(this.codeMirror)) {
                return;
            }
    
            if (this.cursor === this.codeMirror.getCursor(true)) {
                return;
            }
    
            this.codeMirror.setCursor(this.cursor);
            this.codeMirror.focus();
        }
    
    }
    exports.AbstractEditor = AbstractEditor;
  }
);
