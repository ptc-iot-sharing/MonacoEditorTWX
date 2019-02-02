import * as monaco from '../monaco-editor/esm/vs/editor/editor.api';
import tingle from 'tingle.js';

require("tingle.js/src/tingle.css");
require("../styles/editorStyle.css");

import { flattenJson, unflattenJson } from '../utilities';

export interface ActionCallbacks {
    onSave: () => void;
    onDone: () => void;
    onTest: () => void;
    onClose: () => void;
    onPreferencesChanged: (newPreferences: any) => void;
}

export interface MonacoEditorSettings {
    editor: monaco.editor.IEditorConstructionOptions,
    diffEditor: monaco.editor.IDiffEditorConstructionOptions,
    thingworx: any
}

export interface MonacoInstanceSettings {
    code: string,
    language: string,
    readonly: boolean,
    modelName: string
}

export class MonacoCodeEditor {
    monacoEditor: monaco.editor.IStandaloneCodeEditor;
    _currentEditorSettings: MonacoEditorSettings;
    _instanceSettings: MonacoInstanceSettings;

    /**
     * Creates a new monaco editor in the given container
     * @param container HTMLElement where to initialize the new editor
     * @param initialSettings The inital options that the editor should be initialized with
     */
    constructor(container: HTMLElement, initialSettings: MonacoEditorSettings, actionCallbacks: ActionCallbacks, instanceSettings: MonacoInstanceSettings) {
        this._currentEditorSettings = initialSettings;
        this._instanceSettings = instanceSettings;
        // clone the settings and store them
        const editorSettings: MonacoEditorSettings = JSON.parse(JSON.stringify(initialSettings));
        editorSettings.editor.value = instanceSettings.code;
        editorSettings.editor.readOnly = instanceSettings.readonly;
        editorSettings.editor.language = instanceSettings.language;
        editorSettings.editor.model = monaco.editor.createModel(instanceSettings.code, instanceSettings.language,
            monaco.Uri.parse("twx://privateModel/" + instanceSettings.modelName));
        // create the editor
        this.monacoEditor = monaco.editor.create(container, editorSettings.editor);
        this.setupActionListeners(actionCallbacks);
        this.initializePreferenceEditor(actionCallbacks.onPreferencesChanged);
        this.initializeDiffEditor();
        this.monacoEditor.layout();
        this.monacoEditor.focus();
    }

    /**
     * Inserts the given text at the current cursor position.
     */
    public insertText(code: string) {
        var op = {
            range: this.monacoEditor.getSelection(),
            text: code,
            forceMoveMarkers: true
        };
        this.monacoEditor.executeEdits("insertSnippet", [op]);
    }

    /**
     * Bring focus onto the text editor
     */
    public focus() {
        this.monacoEditor.focus();
    }

    /**
     * Dispose of the given editor, and release all models and used resources
     */
    public dispose() {
        if (this.monacoEditor.getModel()) {
            this.monacoEditor.getModel().dispose();
        }
        this.monacoEditor.dispose();
    }

    /**
     * Instructs the editor to remeasure its container. This method should
     * be called when the container of the editor gets resized.
     */
    public continerWasResized() {
        this.monacoEditor.layout();
    }

    /**
     * Scroll vertically or horizontally as necessary and reveal a position centered vertically.
     */
    public scrollCodeTo(x: number, y: number) {
        this.monacoEditor.revealPositionInCenter({
            lineNumber: (x || 0),
            column: (y || 0)
        });
    }

    /**
     * Changes the language of the editor to the given language.
     * @param language Language to set
     */
    public changeLanguage(language: string, code: string) {
        if (this._instanceSettings.language != language) {
            this.monacoEditor.getModel().dispose();
            let model = monaco.editor.createModel(code, language, monaco.Uri.parse("twx://privateModel/" + this._instanceSettings.modelName));
            this.monacoEditor.setModel(model);
            this._instanceSettings.language = language;
        }
    }

    /**
     * Called whenever the contents of the code editor have been changed.
     */
    public onEditorContentChange(callback: (code: string) => void) {
        this.monacoEditor.onDidChangeModelContent(() => {
            callback(this.monacoEditor.getModel().getValue())
        });
    }

    /**
     * Called whenever the editor is focused
     */
    public onEditorFocused(callback: () => void) {
        this.monacoEditor.onDidFocusEditorText(() => {
            callback();
        });
    }

    /**
     * Gets the current text in the monaco editor
     */
    public getValue(): string {
        return this.monacoEditor.getValue();
    }

    /**
     * Sets some code in the editor
     * @param code Code to set in the editor
     */
    public setValue(code: string): void {
        this.monacoEditor.setValue(code);
    }

    /**
     * Perform global initialization of the monaco json
     */
    public static performGlobalInitialization() {
        // initialize the json worker with the give schema
        let confSchema = require("../configs/confSchema.json");

        // text formatting
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            schemas: [{
                uri: "http://monaco-editor/schema.json",
                schema: confSchema,
                fileMatch: ["*"]
            }],
            validate: true
        });
    }

    private initializePreferenceEditor(onPreferencesChanged: (newPreferences: any) => void) {
        const self = this;

        let confEditor: monaco.editor.IStandaloneCodeEditor;
        let modal = new tingle.modal({
            cssClass: ['tingle-popup-container'],
            onOpen: function () {
                // clone the editor settings to be used for the config editor
                let editorSettings = JSON.parse(JSON.stringify(self._currentEditorSettings.editor));
                // set the intial text to be the current config
                editorSettings.value = JSON.stringify(flattenJson(self._currentEditorSettings), null, "\t");
                // set the language as json
                editorSettings.language = "json";
                confEditor = monaco.editor.create(this.modalBoxContent.getElementsByClassName("content")[0], editorSettings);
                confEditor.focus();
                // whenever the model changes, we need to also update the current editor, as well as other editors
                confEditor.onDidChangeModelContent((e) => {
                    try {
                        // if the json is valid, then set it on this editor as well as the editor behind
                        const expandedOptions = unflattenJson(JSON.parse(confEditor.getModel().getValue()));
                        confEditor.updateOptions(expandedOptions.editor);
                        // theme has to be updated separately
                        if (self._currentEditorSettings.editor.theme != expandedOptions.editor.theme) {
                            monaco.editor.setTheme(expandedOptions.editor.theme);
                        }
                        self.monacoEditor.updateOptions(expandedOptions.editor);
                        self._currentEditorSettings = expandedOptions;
                    } catch (e) {
                        return false;
                    }
                    return true;
                });
            },
            onClose: function () {
                // propagate the preference changed to the parent for storage, etc
                onPreferencesChanged(self._currentEditorSettings);
                confEditor.dispose();
            }
        });
        // action triggered by CTRL+~
        // shows a popup with a json configuration for the editor
        this.monacoEditor.addAction({
            id: "viewConfAction",
            label: "View Configuration",
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.US_BACKTICK],
            run: () => {
                modal.setContent(`<h2>Config Editor. Use Intellisense or check <a href='https://code.visualstudio.com/docs/getstarted/settings#_default-settings'>here</a> for available options.</h2>
                                <div class="content" style="height: 30vw"/>`);
                modal.open();
            }
        });
    }

    private setupActionListeners(callbacks: ActionCallbacks) {
        // Action triggered by CTRL+S
        this.monacoEditor.addAction({
            id: "saveCodeAction",
            label: "Save Service",
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S],
            contextMenuGroupId: "service",
            contextMenuOrder: 1.5,
            run: callbacks.onSave
        });
        // action triggered by ctrl+enter
        this.monacoEditor.addAction({
            id: "doneCodeAction",
            label: "Save and Close",
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter],
            contextMenuGroupId: "service",
            contextMenuOrder: 1.6,
            run: callbacks.onDone
        });
        // action triggered by ctrl+y
        this.monacoEditor.addAction({
            id: "testCodeAction",
            label: "Test Service",
            contextMenuGroupId: "service",
            contextMenuOrder: 1.7,
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_Y],
            run: callbacks.onTest
        });
        // action triggered by ctrl+q
        this.monacoEditor.addAction({
            id: "closeCodeAction",
            label: "Close Service",
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_Q],
            contextMenuOrder: 1.8,
            contextMenuGroupId: "service",
            run: callbacks.onClose
        });
    }

    /**
     * Initialize the diff editor triggered by ctrl+k
     */
    private initializeDiffEditor(): void {
        let self = this;

        let diffEditor: monaco.editor.IStandaloneDiffEditor;

        let modal = new tingle.modal({
            cssClass: ['tingle-popup-container'],
            onOpen: function () {
                let originalModel = monaco.editor.createModel(self._instanceSettings.code, self._instanceSettings.language);
                let modifiedModel = self.monacoEditor.getModel();

                const editorSettings = Object.assign({}, self._currentEditorSettings.editor, self._currentEditorSettings.diffEditor);
                // create the diff editor
                diffEditor = monaco.editor.createDiffEditor(this.modalBoxContent.getElementsByClassName("content")[0], editorSettings);
                diffEditor.setModel({
                    original: originalModel,
                    modified: modifiedModel
                });
                diffEditor.focus();
            },
            onClose: function () {
                diffEditor.dispose();
            }
        });
        // action triggered by CTRL+K
        // shows a popup with a diff editor with the initial state of the editor
        // reuse the current model, so changes can be made directly in the diff editor
        this.monacoEditor.addAction({
            id: "viewDiffAction",
            label: "View Diff",
            contextMenuGroupId: "service",
            contextMenuOrder: 1.4,
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_K],
            keybindingContext: null,
            run: (ed) => {
                modal.setContent(`<h2>Diff Editor</h2>
                            <div class="content" style="height: 30vw"/>`);
                modal.open();
            }
        });
    }
}

// perform the global init
MonacoCodeEditor.performGlobalInitialization();