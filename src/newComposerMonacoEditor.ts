import { DEFAULT_EDITOR_SETTINGS, Languages, MONACO_EDITOR_SETTINGS_KEY } from "./constants";
import { MonacoCodeEditor } from "./editors/basicCodeEditor";
import { ServiceEditor } from "./editors/serviceEditor/serviceEditor";
import { CssEditor } from "./editors/cssEditor/cssEditor";
import { TypescriptCodeEditor } from "./editors/typescript/typescriptCodeEditor";
import { getThingPropertyValues } from "./utilities";

enum EditorType {
    SERVICE_EDITOR = "service-editor",
    SUBSCRIPTION_EDITOR = "subscription-editor",
    EXPRESSION_EDITOR = "expression-editor",
    CSS_EDITOR = "css-editor",
    GENERIC_EDITOR = "generic-editor"
}

function load() {
    window["define"](
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
            editorType: EditorType;
            savedEditorPreferences: any;
    
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
                        this.codeMirror.commentSelection();
                        break;
    
                    case 'UNCOMMENT':
                        this.codeMirror.uncommentSelection();
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
                alert("Use the editor shortcut! CTRL+F");
            }
    
            replace() {
                alert("Use the editor shortcut! CTRL+R");
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
                this._setGuttersOption();
                this._initCodeMirrorDebounced = _.debounce(this._initCodeMirror.bind(this), 150);
            }
    
            _setGuttersOption() {
            }
    
            convertHandlerToMonacoLanguage(language: string): string {
                let mapping = {
                    "text/x-sql": 'sql',
                    'javascript': Languages.TwxJavascript,
                    'twxTypescript': Languages.TwxTypescript,
                    'xml': 'xml',
                    'css': 'css',
                    'expressionJs': 'javascript',
                    'json': 'json'
                }
                return mapping[language];
            }
    
            async getEntityInformationForMeDefinitions(currentEditedModel) {
                let serviceDefinition;
                if (this.editorType == EditorType.SERVICE_EDITOR) {
                    serviceDefinition = currentEditedModel.service;
                } else if (this.editorType == EditorType.SUBSCRIPTION_EDITOR) {
                    let subscriptionFields: any[] = currentEditedModel.fieldsModel.all;
                    serviceDefinition = {
                        parameterDefinitions: subscriptionFields.reduce(function (map, obj) {
                            map[obj.name] = obj;
                            return map;
                        }, {})
                    };
                    // now also fill out the datashape for the eventData param.
                    if(serviceDefinition.parameterDefinitions["eventData"]) {
                        const eventName = currentEditedModel.eventName;
                        // iterate through the event definitions
                        for(const event of currentEditedModel.eventsModel.all) {
                            if(event.name == eventName) {
                                serviceDefinition.parameterDefinitions["eventData"].aspects = {
                                    dataShape: event.event.dataShape
                                };
                            }
                        }
                    }
                }
                return {
                    serviceDefinition: serviceDefinition,
                    effectiveShape: this.entityModel.entity.effectiveShape,
                    id: this.entityModel.name,
                    entityType: this.entityModel.entityType,
                    propertyData: this.entityModel.entityType == "Thing" && !currentEditedModel.isNew ? await getThingPropertyValues(this.entityModel.name) : {}
                }
            }
    
            async _initCodeMirror() {
                $(this.element).find('.editor-loading').css('display', 'block');
                this._cleanupCodeMirror();
                if (window['TWX'].debug) {
                    console.log('Monaco is starting initialization with options...', );
                }
    
                if (!this.cmTextarea || !this.element) {
                    return;
                }
    
                let extraSettings: any = {};
    
                this.userPreferences = await this._getUserPreferences();
    
                try {
                    this.savedEditorPreferences = await this.userService.getUserPersistentValue(MONACO_EDITOR_SETTINGS_KEY);
                    if(Object.keys(this.savedEditorPreferences).length == 0) {
                        throw "No saved preferences exist";
                    }
                } catch (e) {
                    console.warn("Monaco: Failed to load settings from preferences. Using defaults...", e);
                    this.savedEditorPreferences = DEFAULT_EDITOR_SETTINGS;
                }
    
                // depending on the context, we might need to change the language mode and decide on the editor type
                let currentEditedModel;
                if (this.langMode.name == 'css') {
                    this.editorType = EditorType.CSS_EDITOR;
                } else if (this.entityModel && this.entityModel.Area == "UI") {
                    this.langMode.name = "expressionJs";
                    this.editorType = EditorType.EXPRESSION_EDITOR;
                } else if (this.langMode.name == "javascript" && this.langMode.json) {
                    this.langMode.name = "json";
                    this.editorType = EditorType.GENERIC_EDITOR;
                } else if (this.entityModel && this.entityModel.current3rdNav == "subscriptions") {
                    this.editorType = EditorType.SUBSCRIPTION_EDITOR;
                    currentEditedModel = this.entityModel.subscriptionsModel.edit;
                } else if (this.entityModel && this.entityModel.current3rdNav == "services") {
                    this.editorType = EditorType.SERVICE_EDITOR;
                    currentEditedModel = this.entityModel.servicesModel.editModel;
                } else {
                    this.editorType = EditorType.GENERIC_EDITOR;
                }
                // decide on the editor class to use based on the language
                let editorClass;
                if (this.editorType == EditorType.SERVICE_EDITOR || this.editorType == EditorType.SUBSCRIPTION_EDITOR) {
                    extraSettings.glyphMargin = true;
                    if (this.langMode.name == 'javascript') {
                        editorClass = TypescriptCodeEditor;
                        if (currentEditedModel.serviceImplementation.configurationTables.Script.rows.length == 2) {
                            this.langMode.name = Languages.TwxTypescript;
                            this._setValue(currentEditedModel.serviceImplementation.configurationTables.Script.rows[1].code);
                        }
                    } else {
                        editorClass = ServiceEditor;
                    }
                } else {
                    if(this.editorType == EditorType.CSS_EDITOR) {
                        editorClass = CssEditor;
                    } else {
                        editorClass = MonacoCodeEditor;
                    }
                }
    
                let container = this.cmTextarea.parentElement;
                let modelName;
                if (this.editorType == EditorType.SERVICE_EDITOR || this.editorType == EditorType.SUBSCRIPTION_EDITOR) {
                    if(currentEditedModel) {
                        modelName = `${this.entityModel.entityType}/${this.entityModel.name}/${currentEditedModel.isNew ? Math.random().toString(36).substring(7) : currentEditedModel.name}`;
                    } else {
                        modelName =  Math.random().toString(36).substring(7);
                    }
                } else {
                    modelName =  Math.random().toString(36).substring(7);
                }
                // empty out the existing DOM stuff
                container.innerHTML = "";
                // create a new editor
                this.codeMirror = new editorClass(container,
                    {
                        editor: Object.assign({}, this.savedEditorPreferences.editor, { automaticLayout: true }, extraSettings)
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
                            this.userService.setUserPersistentValue(MONACO_EDITOR_SETTINGS_KEY, preferences);
                        }
                    }, {
                        code: this._getValue(),
                        language: this.convertHandlerToMonacoLanguage(this.langMode.name),
                        modelName: modelName,
                        readonly: this.readOnly
                    });
    
                if (this.codeMirror instanceof TypescriptCodeEditor) {
                    const typescriptCodeEditor = this.codeMirror as TypescriptCodeEditor;
                    typescriptCodeEditor.refreshMeDefinitions(await this.getEntityInformationForMeDefinitions(currentEditedModel));
                    this.codeMirror.onEditorFocused(async () => {
                        typescriptCodeEditor.refreshMeDefinitions(await this.getEntityInformationForMeDefinitions(currentEditedModel));
                        TypescriptCodeEditor.codeTranslator.generateDataShapeCode();
                    });
    
                    typescriptCodeEditor.onEditorTranspileFinished((code) => {
                        if (code !== this._getValue()) {
                            this._setValue(code);
                            //this._lintIfConfigured();
                            CommonUtil.fireChangeEvent(this.element, code);
                        }
                    });
                    this.codeMirror.onLanguageChanged((newLanguage) => {
                        this.langMode.name = newLanguage;
                        if(newLanguage == Languages.TwxJavascript && currentEditedModel && currentEditedModel.serviceImplementation.configurationTables.Script.rows.length == 2) {
                            currentEditedModel.serviceImplementation.configurationTables.Script.rows.pop();
                        }
                    });
                }
    
                this.codeMirror.onEditorContentChange((code) => {
                    if(this.convertHandlerToMonacoLanguage(this.langMode.name) != Languages.TwxTypescript) {
                        if (code !== this._getValue()) {
                            this._setValue(code);
                            this._lintIfConfigured();
                            CommonUtil.fireChangeEvent(this.element, code);
                        }
                    } else {
                        currentEditedModel.serviceImplementation.configurationTables.Script.rows[1] = {
                            code: code
                        }
                    }
                });
                this._lintIfConfigured();
                this.codeMirror.focus();
                this.initialized();
                $(this.element).find('.editor-loading').css('display', 'none');
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
}
function waitForDefine() {
    if(typeof window["define"] == "undefined"){
      window.setTimeout(waitForDefine,10);
    }
    else{
      load();
    }
}
waitForDefine();