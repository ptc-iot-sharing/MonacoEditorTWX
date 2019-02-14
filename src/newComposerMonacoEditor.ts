import { DEFAULT_EDITOR_SETTINGS } from "./constants";
import { MonacoCodeEditor } from "./editors/basicCodeEditor";
import { ServiceEditor } from "./editors/serviceEditor/serviceEditor";
import { TypescriptCodeEditor } from "./editors/typescript/typescriptCodeEditor";
import { getThingPropertyValues } from "./utilities";
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
    "thingworx-ui-platform/helpers/hotkeys/hotkey-manager",
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
function(exports, I18N, Container, _, $, CodeMirror, CodemirrorGutterMessageManager, CommonUtil, ObjectUtil, LoaderHelper, ChannelNames, EventHelper, u, EntityServiceBase, HotkeyManager) {
    var {UserSessionInfoKeys, UserPreferenceKeys} = u;
    I18N = I18N["I18N"];
    Container = Container["Container"];
    CodemirrorGutterMessageManager = CodemirrorGutterMessageManager["CodemirrorGutterMessageManager"];
    CommonUtil = CommonUtil["CommonUtil"];
    ObjectUtil = ObjectUtil["ObjectUtil"];
    LoaderHelper = LoaderHelper["LoaderHelper"];
    ChannelNames = ChannelNames["ChannelNames"];
    EventHelper = EventHelper["EventHelper"];
    EntityServiceBase = EntityServiceBase["EntityServiceBase"];
    HotkeyManager = Container.instance.get(HotkeyManager["HotkeyManager"]);

    LoaderHelper.importPlatformCss('/features/details/editor/codemirror-gutter-message.css');

    const SUPPORTED_LANG_MODES = [
        'javascript',
        'text/x-sql',
        'xml', // not available yet
        'json', // not available yet
        'css'
    ];

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
            this._init(editorOptions);

        }

        //=======================================================================================================
        // == flowing can be used as protected methods in your subclasses =======================================
        attached() {
            $(this.element).find('.form-group').append($('<div class="editor-loading"></div>'));
            this.eventHelper.subscribe(ChannelNames.CODE_SYNTAX_CHECK, this.checkSyntax.bind(this));
            this.eventHelper.subscribe(ChannelNames.PREFERENCE_CHANGED, this._preferenceChanged.bind(this));
            this._initCodeMirrorDebounced();
        }

        _initCodeMirrorDebounced(): any {
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
                    this.showEditorConfiguration();
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

        showEditorConfiguration(): any {
            if(this.codeMirror) {
                this.codeMirror.openConfiguration();
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

        //================================================================================================================
        //== following should be treated as private methods and subject to change without notifiying =====================
        _init(opts) {
            let container = Container.instance || new Container();
            this.gutterMsgManager = container.get(CodemirrorGutterMessageManager);
            this.entityService = container.get(EntityServiceBase);
            this.i18n = container.get(I18N);

            this.editorOptions = _.defaults(opts, DEFAULT_EDITOR_SETTINGS);
            this._setGuttersOption();
            this._initCodeMirrorDebounced = _.debounce(this._initCodeMirror.bind(this), 150);
        }

        _setGuttersOption() {

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
                    'expressionJs': 'javascript',
                    'json': 'json'

                }
                return mapping[language];
            }

            _.defer(() => { // need to defer the composition in order for the script to show up without a click
                if (!this.cmTextarea) {
                    return;
                }
                this._getUserPreferences().then(async (prefs) => {
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

                    if(cmOptions.mode.name == "javascript" && cmOptions.mode.json) {
                        cmOptions.mode.name = "json";
                    }

                    let container = this.cmTextarea.parentElement;
                    let modelName;
                    if (this.entityModel && this.entityModel.Area != "UI") {
                        let editedModel;
                        if(this.entityModel.subscriptionsModel) {
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
                    this.codeMirror = new editorClass(container,
                        {
                            editor: Object.assign(DEFAULT_EDITOR_SETTINGS.editor, { automaticLayout: true })
                        }, {
                            onClose: () => {
                                HotkeyManager._subscribers["SERVICE_CANCEL"].callback.call();
                            },
                            onSave: () => {
                                HotkeyManager._subscribers["SERVICE_SAVE"].callback.call();
                            }, onDone: () => {
                                HotkeyManager._subscribers["SERVICE_DONE"].callback.call();
                            }, onTest: () => {
                                HotkeyManager._subscribers["SERVICE_EXECUTE"].callback.call();
                            }, onPreferencesChanged: (preferences) => {
                                console.log("preferences action " + preferences)
                            }
                        }, {
                            code: this.cmTextarea.value,
                            language: convertHandlerToMonacoLanguage(cmOptions.mode.name),
                            modelName: modelName,
                            readonly: cmOptions.readOnly
                        });

                    if (this.codeMirror instanceof TypescriptCodeEditor) {
                        const typescriptCodeEditor = this.codeMirror as TypescriptCodeEditor;
                        typescriptCodeEditor.refreshMeDefinitions({
                            serviceDefinition:  this.entityModel.servicesModel.editModel.service,
                            effectiveShape: this.entityModel.entity.effectiveShape,
                            id: this.entityModel.name,
                            entityType: this.entityModel.entityType,
                            propertyData: await getThingPropertyValues(this.entityModel.name)
                        });
                        this.codeMirror.onEditorFocused(async () => {
                            typescriptCodeEditor.refreshMeDefinitions({
                                serviceDefinition:  this.entityModel.servicesModel.editModel.service,
                                effectiveShape: this.entityModel.entity.effectiveShape,
                                id: this.entityModel.name,
                                entityType: this.entityModel.entityType,
                                propertyData: await getThingPropertyValues(this.entityModel.name)
                            });
                            TypescriptCodeEditor.codeTranslator.generateDataShapeCode();
                            TypescriptCodeEditor.workerManager.syncExtraLibs();
                        });

                        if (convertHandlerToMonacoLanguage(cmOptions.mode.name) == 'twxTypescript') {
                            typescriptCodeEditor.onEditorTranspileFinised((code) => {
                                // TODO: figure this out
                                // this.javascriptCode = code;
                            });
                        }
                    }
                    this.initialized();

                    if (this.element) {
                        this.codeMirror.onEditorContentChange((code) => {
                            if (code !== this._getValue()) {
                                this._setValue(code);
                                //this._lintIfConfigured();
                                CommonUtil.fireChangeEvent(this.element, code);
                            }
                        });

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

        }

    }
    exports.AbstractEditor = AbstractEditor;
}
);
