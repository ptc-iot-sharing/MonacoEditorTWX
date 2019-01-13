import * as monaco from './monaco-editor/esm/vs/editor/editor.api';
import tingle from 'tingle.js';
require("tingle.js/src/tingle.css");
import { flattenJson, unflattenJson } from './utilities';

export interface ActionCallbacks {
    onSave: () => void;
    onDone: () => void;
    onTest: () => void;
    onClose: () => void;
    onPreferencesChanged: (newPreferences: any) => void;
}

export class MonacoCodeEditor {
    private monacoEditor: monaco.editor.IStandaloneCodeEditor;
    private _currentEditorSettings: any;

    /**
     * Creates a new monaco editor in the given container
     * @param container HTMLElement where to initialize the new editor
     * @param initalSettings The inital options that the editor should be initialized with
     */
    constructor(container: HTMLElement, initalSettings: any, actionCallbacks: ActionCallbacks) {
        // clone the settings and store them
        this._currentEditorSettings = JSON.parse(JSON.stringify(initalSettings));
        this.monacoEditor = monaco.editor.create(container, initalSettings);
        this.setupActionListeners(actionCallbacks);
        this.initializePreferenceEditor(actionCallbacks.onPreferencesChanged);
        this.monacoEditor.layout();
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
     * Called whenever the contents of the code editor have been changed.
     */
    public onEditorContentChange(callback: (code: string) => void) {
        this.monacoEditor.getModel().onDidChangeContent(() => {
            callback(this.monacoEditor.getModel().getValue())
        });
    }

    private initializePreferenceEditor(onPreferencesChanged: (newPreferences: any) => void) {
        // initialize the json worker with the give schema
        let confSchema = require("./configs/confSchema.json");

        // text formatting
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            schemas: [{
                uri: "http://monaco-editor/schema.json",
                schema: confSchema,
                fileMatch: ["*"]
            }],
            validate: true
        });

        const self = this;
        // action triggered by CTRL+~
        // shows a popup with a json configuration for the editor
        this.monacoEditor.addAction({
            id: "viewConfAction",
            label: "View Configuration",
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.US_BACKTICK],
            run: () => {
                let confEditor: monaco.editor.IStandaloneCodeEditor;
                let modal = new tingle.modal({
                    onOpen: function() {
                        // clone the editor settings to be used for the config editor
                        let editorSettings = JSON.parse(JSON.stringify(self._currentEditorSettings));
                        // set the intial text to be the current config
                        editorSettings.value = JSON.stringify(flattenJson(editorSettings), null, "\t");
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
                                // propagate the preference changed to the parent for storage, etc
                                onPreferencesChanged(expandedOptions);
                            } catch (e) {
                                return false;
                            }
                            return true;
                        });
                    },
                    onClose: () => {
                        confEditor.dispose();
                    }
                });
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
}