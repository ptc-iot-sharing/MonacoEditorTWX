import { DEFAULT_EDITOR_SETTINGS } from "./constants";
import { MonacoCodeEditor } from "./editors/basicCodeEditor";
import { ServiceEditor } from "./editors/serviceEditor/serviceEditor";
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
        codeMirror: MonacoCodeEditor;
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
            this._cleanupCodeMirror();
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
           this.codeMirror.commentSelection();
        }
    
        unCommentSelection() {
            this.codeMirror.uncommentSelection();
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
            if(dir) {
                this.codeMirror.indentSelection();
            } else {
                this.codeMirror.outdentSelection();
            }
        }

        autoFormatSelection() {
            this.codeMirror.autoFormatSelection();
        }

        find() {
            alert("Use the editor shortcut!");
        }

        replace() {
            alert("Use the editor shortcut!");
        }

        replaceAll(findString, replaceString) {
            alert("Use the editor shortcut!");
        }

        insertTextIntoEditor({text, keepSelected = true}) {
            this.codeMirror.insertText(text, keepSelected);
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

            function convertHandlerToMonacoLanguage(language: string): string {
                let mapping = {
                    "text/x-sql": 'sql',
                    'javascript': 'twxJavascript',
                    'xml': 'xml',
                    'css': 'css',
                    'expressionJs': 'javascript'

                }
                return mapping[language];
            }
    
            _.defer(() => { // need to defer the composition in order for the script to show up without a click
                if (!this.cmTextarea) {
                    return;
                }
                this._getUserPreferences().then(prefs => {
                    this.userPreferences = prefs;
                    this._initEditorTheme(this.userPreferences);
                    cmOptions.theme = this.theme;
                    let editorClass;
                    if(this.entityModel && this.entityModel.Area != "UI") {
                        if (cmOptions.mode.name == 'twxTypescript' || cmOptions.mode.name == 'javascript') {
                            editorClass = TypescriptCodeEditor;
                        } else {
                            editorClass = ServiceEditor;
                        }
                    } else {
                        editorClass = MonacoCodeEditor;
                    }

                    if(this.entityModel && this.entityModel.Area == "UI") {
                        cmOptions.mode.name = "expressionJs";
                    }

                    let container = this.cmTextarea.parentElement;
                    let modelName;
                    if (this.entityModel && this.entityModel.Area != "UI") {
                        let editedModel;
                        if(this.entityModel.subscriptionsModel.edit.subscription.name) {
                            editedModel = this.entityModel.subscriptionsModel.edit;
                        } else if (this.entityModel.servicesModel){
                            editedModel = this.entityModel.servicesModel.editModel;
                        }
                        if(editedModel) {
                            modelName = `${this.entityModel.entityType}/${this.entityModel.name}/${editedModel.isNew ? Math.random().toString(36).substring(7) : editedModel.name}`;
                        } else {
                            modelName =  Math.random().toString(36).substring(7);
                        }
                    } else {
                        modelName =  Math.random().toString(36).substring(7);
                    }

                    container.innerHTML = "";
                    // else create a new one
                    this.codeMirror = new editorClass(container, { editor: DEFAULT_EDITOR_OPTIONS }, {
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
                            code: this.cmTextarea.value,
                            language: convertHandlerToMonacoLanguage(cmOptions.mode.name),
                            modelName: modelName,
                            readonly: cmOptions.readOnly
                        });
                    this.initialized();
    
                    if (this.element) {
                        this.codeMirror.onEditorContentChange((code) => {
                            if (code !== this._getValue()) {
                                this._setValue(code);
                                //this._lintIfConfigured();
                                CommonUtil.fireChangeEvent(this.element, code);
                            }
                        });
    
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
            this.codeMirror.dispose();

        }

        _getSelectedRange() {
            // not being used internally
            return {from: 0, to: 0};
        }

        _setLine(text, line, originalTextLength) {
            // not being used internally
        }

        _handleFolding(action) {
            if(action == 'fold') {
                this.codeMirror.foldAll();
            } else if(action = 'unfold') {
                this.codeMirror.unfoldAll();
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
