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
            'xml',
            'json',
            'css'
        ];

        // This class is presented as a ES5 class since it has to be extended by other ES5 classes
        // This is done because typescript does not support setting the compiler target for each individual file
        var AbstractEditor = /** @class */ (function () {
            function AbstractEditor(element, userService, _a) {
                var _this = this;
                var _b = _a === void 0 ? {} : _a, _c = _b.eventHelperGroupName, eventHelperGroupName = _c === void 0 ? undefined : _c, _d = _b.langMode, langMode = _d === void 0 ? undefined : _d, _e = _b.editorOptions, editorOptions = _e === void 0 ? undefined : _e, _f = _b.valueField, valueField = _f === void 0 ? 'value' : _f;
                this.TWX_MSG_GUTTER_ID = 'CodeMirror-twxmsg-markers';
                this.cursor = {
                    line: 0,
                    col: 0
                };
                this.action = '';
                this.actionHandler = this.editAction.bind(this);
                this._saveEditorViewState = (function () {
                    try {
                        var currentEditedModel = void 0;
                        if (_this.editorType == EditorType.SUBSCRIPTION_EDITOR) {
                            currentEditedModel = _this.entityModel.subscriptionsModel.edit;
                        }
                        else if (_this.editorType == EditorType.SERVICE_EDITOR) {
                            currentEditedModel = _this.entityModel.servicesModel.editModel;
                        }
                        if (currentEditedModel) {
                            localStorage.setItem(`${this.entityModel.entityType}_${this.entityModel.name}_${currentEditedModel.serviceImplementation.name}_ViewState`,  
                                JSON.stringify(_this.codeMirror.getViewState()));
                        }
                    }
                    catch (ex) {
                        console.error("Error occurred while cleaning up monaco.", ex);
                    }
                });
                this.element = element;
                this.userService = userService;
                this.eventHelper = new EventHelper(eventHelperGroupName || 'AbstractCodeEditor');
                this.langMode = _.defaults(langMode, { name: 'javascript', globalVars: true });
                this.valueField = valueField;
                if (SUPPORTED_LANG_MODES.indexOf(this.langMode.name) === -1) {
                    throw new Error("Not supported language mode: ".concat(this.langMode.name || 'unknown'));
                }
                this._init(editorOptions);
            }

            //=======================================================================================================
            // == flowing can be used as protected methods in your subclasses =======================================
            AbstractEditor.prototype.attached = function() {
                $(this.element).find('.form-group').append($('<div class="editor-loading"></div>'));
                this.eventHelper.subscribe(ChannelNames.CODE_SYNTAX_CHECK, this.checkSyntax.bind(this));
                // when the JS_SYNTAX_CHECKED event is fired, it means we are close to saving
                this.eventHelper.subscribe(ChannelNames.JS_SYNTAX_CHECKED, this._saveEditorViewState.bind(this));
                this.eventHelper.subscribe(ChannelNames.PREFERENCE_CHANGED, this._preferenceChanged.bind(this));
                this._initCodeMirrorDebounced();
            }

            AbstractEditor.prototype._initCodeMirrorDebounced = function () {
                throw new Error("Method not implemented.");
            }

            AbstractEditor.prototype.detached = function() {
                this._cleanupCodeMirror();
                this.eventHelper.destroyAll();
                this.destroy();
            }

            AbstractEditor.prototype.readOnlyChanged = function(newVal, oldVal) {
                if (_.isUndefined(oldVal)) {
                    return;
                }
                this.readOnly = ObjectUtil.asBoolean(newVal) || false;
                this._initCodeMirrorDebounced();
            }

            AbstractEditor.prototype.cursorChanged = function() {
                this._setCursor();
            }

            AbstractEditor.prototype.valueChanged = function() {
                this.refreshDisplay();
            }

            /**
             * Because the editor can initially be rendered inside a hidden div, this flag allows the editor to react when it becomes visible and
             * re-align all styles.
             *
             * @param newval {boolean}
             */
             AbstractEditor.prototype.visibleChanged = function(newval) {
                if (newval) {
                    this._initCodeMirrorDebounced();
                }
            }

            /**
             * Sometimes when setting the value programatically - codeMirror needs special processing
             * in order to refresh the display. There is a refresh method but it doesn't seem to be functioning.
             */
             AbstractEditor.prototype.refreshDisplay = function() {
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

            AbstractEditor.prototype.actionHandler = AbstractEditor.prototype.editAction = function (newVal) {
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

            AbstractEditor.prototype.showEditorConfiguration = function(): any {
                if(this.codeMirror) {
                    this.codeMirror.openConfiguration();
                }
            }

            AbstractEditor.prototype.editorOptions = function(editorOptions: any): any {
                throw new Error("Method not implemented.");
            }

            AbstractEditor.prototype.initialized = function() {
                // override if you want this functionality;
            }

            AbstractEditor.prototype.destroy = function() {
                // override if you want this functionality;
            }

            AbstractEditor.prototype.undo = function() {
                this.codeMirror.undo();
            }

            AbstractEditor.prototype.redo = function() {
                this.codeMirror.redo();
            }

            AbstractEditor.prototype.commentSelection = function() {
                this.codeMirror.commentSelection();
            }

            AbstractEditor.prototype.unCommentSelection = function() {
                this.codeMirror.uncommentSelection();
            }

            AbstractEditor.prototype.checkSyntax = function(opts = {}) {
                console.assert(false, 'checkSyntax invoked by not implemented!');
            }

            AbstractEditor.prototype.lint = function(opts = {}) {
                // override if you want this functionality;
            };

            AbstractEditor.prototype.setLinting = function(lint) {
                // override if you want this functionality;
            }

            AbstractEditor.prototype.getLinting = function() {
                return false;
            }

            AbstractEditor.prototype.cursorActivity = function(cm, event) {
                // override if you want this functionality;
            }

            AbstractEditor.prototype.keydown = function(cm, event) {
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

            AbstractEditor.prototype.blur = function(cm, event) {
                // override if you want this functionality;
            }

            AbstractEditor.prototype.indentSelection = function(dir) {
                if(dir) {
                    this.codeMirror.indentSelection();
                } else {
                    this.codeMirror.outdentSelection();
                }
            }

            AbstractEditor.prototype.autoFormatSelection = function() {
                this.codeMirror.autoFormatSelection();
            }

            AbstractEditor.prototype.find = function() {
                alert("Use the editor shortcut! CTRL+F");
            }

            AbstractEditor.prototype.replace = function() {
                alert("Use the editor shortcut! CTRL+R");
            }

            AbstractEditor.prototype.replaceAll = function(findString, replaceString) {
                alert("Use the editor shortcut!");
            }

            AbstractEditor.prototype.insertTextIntoEditor = function({text, keepSelected = true}) {
                this.codeMirror.insertText(text, keepSelected);
                this.codeMirror.focus();
            }

            //================================================================================================================
            //== following should be treated as private methods and subject to change without notifiying =====================
            AbstractEditor.prototype._init = function(opts) {
                let container = Container.instance || new Container();
                this.gutterMsgManager = container.get(CodemirrorGutterMessageManager);
                this.entityService = container.get(EntityServiceBase);
                this.i18n = container.get(I18N);
                this._setGuttersOption();
                this._initCodeMirrorDebounced = _.debounce(this._initCodeMirror.bind(this), 150);
            }

            AbstractEditor.prototype._setGuttersOption = function() {
            }

            AbstractEditor.prototype.convertHandlerToMonacoLanguage = function(language: string): string {
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

            AbstractEditor.prototype.getEntityInformationForMeDefinitions = async function(currentEditedModel) {
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

            AbstractEditor.prototype._initCodeMirror = async function() {
                $(this.element).find('.editor-loading').css('display', 'block');
                this._cleanupCodeMirror();
                if (window['TWX'].debug) {
                    console.log('Monaco is starting initialization with options...', );
                }

                if (!this.cmTextarea || !this.element) {
                    return;
                }

                this.userPreferences = await this._getUserPreferences();

                try {
                    const editorPreferences = await this.userService.getUserPersistentValue(MONACO_EDITOR_SETTINGS_KEY);
                    if(Object.keys(editorPreferences).length == 0) {
                        throw "No saved preferences exist";
                    }
                    this.savedEditorPreferences = {
                        ...DEFAULT_EDITOR_SETTINGS,
                        ...editorPreferences,
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
                } else if (this.entityModel && this.entityModel.current3rdNav.startsWith("subscriptions")) {
                    this.editorType = EditorType.SUBSCRIPTION_EDITOR;
                    currentEditedModel = this.entityModel.subscriptionsModel.edit;
                } else if (this.entityModel && this.entityModel.current3rdNav.startsWith("services")) {
                    this.editorType = EditorType.SERVICE_EDITOR;
                    currentEditedModel = this.entityModel.servicesModel.editModel;
                } else {
                    this.editorType = EditorType.GENERIC_EDITOR;
                }
                // decide on the editor class to use based on the language
                let editorClass;
                if (this.editorType == EditorType.SERVICE_EDITOR || this.editorType == EditorType.SUBSCRIPTION_EDITOR) {
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
                // Hide the existing text area. Don't completely wipe it because it gets reused in the subscription editor
                this.cmTextarea.style.display = 'none';
                // Create a new editor, using the class inferred from the language id
                this.codeMirror = new editorClass(
                    container,
                    {
                        ...this.savedEditorPreferences,
                    },
                    {
                        onClose: () => {
                            HotkeyManager._subscribers["SERVICE_CANCEL"].callback.call();
                        },
                        onSave: () => {
                            HotkeyManager._subscribers["SERVICE_SAVE"].callback.call();
                        },
                        onDone: () => {
                            HotkeyManager._subscribers["SERVICE_DONE"].callback.call();
                        },
                        onTest: () => {
                            HotkeyManager._subscribers["SERVICE_EXECUTE"].callback.call();
                        },
                        onPreferencesChanged: (preferences) => {
                            this.userService.setUserPersistentValue(MONACO_EDITOR_SETTINGS_KEY, preferences);
                        },
                    },
                    {
                        code: this._getValue(),
                        language: this.convertHandlerToMonacoLanguage(this.langMode.name),
                        modelName: modelName,
                        readonly: this.readOnly,
                    }
                );

                if (this.codeMirror instanceof TypescriptCodeEditor) {
                    const typescriptCodeEditor = this.codeMirror as TypescriptCodeEditor;
                    typescriptCodeEditor.refreshMeDefinitions(await this.getEntityInformationForMeDefinitions(currentEditedModel));
                    this.codeMirror.onEditorFocused(async () => {
                        typescriptCodeEditor.refreshMeDefinitions(await this.getEntityInformationForMeDefinitions(currentEditedModel));
                        typescriptCodeEditor.codeTranslator.generateDataShapeCode();
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
                // restore view state on startup
                if(this.editorType == EditorType.SERVICE_EDITOR || this.editorType == EditorType.SUBSCRIPTION_EDITOR) {
                    let _state = localStorage.getItem(`${this.entityModel.entityType}_${this.entityModel.name}_${currentEditedModel.serviceImplementation.name}_ViewState`);
                    this.codeMirror.setViewState(JSON.parse(_state));
                }

                this.initialized();
                CommonUtil.fireCustomEvent(this.element, "initialized", {});
                $(this.element).find('.editor-loading').css('display', 'none');
            }

            AbstractEditor.prototype._getValue = function() {
                return _.get(this, this.valueField);
            }

            AbstractEditor.prototype._setValue = function(newVal) {
                _.set(this, this.valueField, newVal);
            }

            AbstractEditor.prototype._lintIfConfigured = function() {
                if (this.getLinting()) {
                    this.lint(this.editorOptions);
                }
            }

            AbstractEditor.prototype._cleanupCodeMirror = function() {
                if (!this.codeMirror) {
                    return;
                }
                this.codeMirror.dispose();

            }

            AbstractEditor.prototype._getSelectedRange = function() {
                // not being used internally
                return {from: 0, to: 0};
            }

            AbstractEditor.prototype._setLine = function(text, line, originalTextLength) {
                // not being used internally
            }

            AbstractEditor.prototype._handleFolding = function(action) {
                if(action == 'fold') {
                    this.codeMirror.foldAll();
                } else if(action = 'unfold') {
                    this.codeMirror.unfoldAll();
                }
            }

            AbstractEditor.prototype._saveEditorViewState = (()  => {
                // wrapped in a try catch because if anything fails, the editor still needs to proceed
                try {
                    let currentEditedModel;
                    if (this.editorType == EditorType.SUBSCRIPTION_EDITOR) {
                        currentEditedModel = this.entityModel.subscriptionsModel.edit;
                    }
                    else if (this.editorType == EditorType.SERVICE_EDITOR) {
                        currentEditedModel = this.entityModel.servicesModel.editModel
                    }
                    if (currentEditedModel) {
                        localStorage.setItem(`${this.entityModel.entityType}_${this.entityModel.name}_${currentEditedModel.serviceImplementation.name}_ViewState`, 
                            JSON.stringify(this.codeMirror.getViewState()));
                    }

                } catch (ex) {
                    console.error("Error occurred while cleaning up monaco.", ex)
                }
            });

            /**
             * Retrieve user preferences.
             *
             * @returns {Promise}
             * @private
             */
             AbstractEditor.prototype._getUserPreferences = function() {
                return this.userService.getUserPersistentValue(UserSessionInfoKeys.USER_PREFERENCES);
            }

            AbstractEditor.prototype._preferenceChanged = function _preferenceChanged(data) {
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
             AbstractEditor.prototype._themeChanged = function(newVal, oldVal) {
                if (!newVal || newVal === oldVal) {
                    return;
                }
                this._initCodeMirrorDebounced();
            }

            AbstractEditor.prototype._setCursor = function() {

            }

            AbstractEditor.prototype.hasFocus = function() {

            }

            return AbstractEditor;
        }());
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
