import * as monaco from "monaco-editor";
import { FormattingConflicts } from "monaco-editor/esm/vs/editor/contrib/format/browser/format";
import tingle from "tingle.js";
import { Options as PrettierOptions } from "prettier";
import { MonacoPrettier } from "./prettier";
import { MONACO_EDITOR_CONFIGURATION_MODEL } from "../constants";

require("tingle.js/src/tingle.css");
require("../styles/editorStyle.css");

export interface ActionCallbacks {
    onPreferencesChanged: (newPreferences: any) => void;
}

export interface MonacoEditorSettings {
    editor: monaco.editor.IStandaloneEditorConstructionOptions;
    diffEditor: monaco.editor.IDiffEditorConstructionOptions;
    thingworx: any;
    prettier: {
        enabled: boolean;
        options: PrettierOptions;
    };
}

export interface MonacoInstanceSettings {
    code: string;
    language: string;
    readonly: boolean;
    modelName: string;
}

export interface EditorPosition {
    line: number;
    ch: number;
}

export class MonacoCodeEditor {
    private modals = [];
    disposables: monaco.IDisposable[] = [];
    monacoEditor: monaco.editor.IStandaloneCodeEditor;
    _currentEditorSettings: MonacoEditorSettings;
    _instanceSettings: MonacoInstanceSettings;

    public state = {
        msg: {
            gutterId: "",
            hasGutter: true,
            marked: [],
            messages: [],
        },
    };

    /**
     * Creates a new monaco editor in the given container
     * @param container HTMLElement where to initialize the new editor
     * @param initialSettings The initial options that the editor should be initialized with
     */
    constructor(
        container: HTMLElement,
        initialSettings: MonacoEditorSettings,
        actionCallbacks: ActionCallbacks,
        instanceSettings: MonacoInstanceSettings
    ) {
        this._currentEditorSettings = initialSettings;
        this._instanceSettings = instanceSettings;
        // clone the settings and store them
        const editorSettings: MonacoEditorSettings = JSON.parse(JSON.stringify(initialSettings));
        editorSettings.editor.automaticLayout = true;
        editorSettings.editor.value = instanceSettings.code;
        editorSettings.editor.readOnly = instanceSettings.readonly;
        editorSettings.editor.language = instanceSettings.language;
        editorSettings.editor.model = monaco.editor.createModel(
            instanceSettings.code,
            instanceSettings.language,
            monaco.Uri.parse("twx://privateModel/" + instanceSettings.modelName)
        );
        this.monacoEditor = monaco.editor.create(container, editorSettings.editor);
        this.initializePreferenceEditor(actionCallbacks.onPreferencesChanged);
        this.initializeDiffEditor();
        this.monacoEditor.layout();
        this.monacoEditor.focus();

        if (this._currentEditorSettings.prettier.enabled) {
            const monacoPrettier = new MonacoPrettier(() => this._currentEditorSettings.prettier.options);
            this.disposables.push(
                monaco.languages.registerDocumentFormattingEditProvider(this._instanceSettings.language, monacoPrettier)
            );
            this.disposables.push(
                monaco.languages.registerDocumentRangeFormattingEditProvider(
                    this._instanceSettings.language,
                    monacoPrettier
                )
            );
            // Because of https://github.com/microsoft/vscode/blob/main/src/vs/editor/editor.api.ts#L19-L21
            // The first formatter is selected, which is the builtin worker one
            // We must always select the "prettier" formatter, so overwrite it here
            FormattingConflicts.setFormatterSelector((formatters) => {
                const prettierFormatter = formatters.find((f) => f instanceof MonacoPrettier);
                if (prettierFormatter) {
                    return Promise.resolve(prettierFormatter);
                }
                // otherwise just select the first one
                return Promise.resolve(formatters[0]);
            });
        }
    }

    /**
     * Inserts the given text at the current cursor position.
     */
    public insertText(code: string, keepSelection = false) {
        // Keep track of cursor position to highlight the code after inserting it
        const currentSelection = this.monacoEditor.getSelection();
        const op = {
            range: currentSelection,
            text: code,
            forceMoveMarkers: true,
        };
        this.monacoEditor.pushUndoStop();
        this.monacoEditor.executeEdits("insertSnippet", [op]);
        if (keepSelection) {
            // Highlight the code after inserting it
            this.monacoEditor.setSelection(
                monaco.Selection.fromPositions(currentSelection.getStartPosition(), this.monacoEditor.getPosition())
            );
        }
        this.monacoEditor.pushUndoStop();
    }

    /**
     * Bring focus onto the text editor
     */
    public focus() {
        this.monacoEditor.focus();
    }

    public undo() {
        this.monacoEditor.trigger("external", "undo", undefined);
    }

    public redo() {
        this.monacoEditor.trigger("external", "redo", undefined);
    }

    /**
     * Indents the current selection by 1 tab
     */
    public indentSelection() {
        this.monacoEditor.trigger("external", "editor.action.indentLines", undefined);
    }

    /**
     * Outdent the current selection by 1 tab
     */
    public outdentSelection() {
        this.monacoEditor.trigger("external", "editor.action.outdentLines", undefined);
    }

    /**
     * Comment the current selection
     */
    public commentSelection() {
        this.monacoEditor.trigger("external", "editor.action.addCommentLine", undefined);
    }

    /**
     * Uncomment the current selection
     */
    public uncommentSelection() {
        this.monacoEditor.trigger("external", "editor.action.removeCommentLine", undefined);
    }

    /**
     * Format the current selected code
     */
    public autoFormatSelection() {
        this.monacoEditor.trigger("external", "editor.action.formatSelection", undefined);
    }

    /**
     * Format the current selected code
     */
    public autoFormatDocument() {
        this.monacoEditor.trigger("external", "editor.action.formatDocument", undefined);
    }

    /**
     * Fold all the current folding indicators
     */
    public foldAll() {
        this.monacoEditor.trigger("external", "editor.foldAll", undefined);
    }

    /**
     * Unfold all the folding indicators
     */
    public unfoldAll() {
        this.monacoEditor.trigger("external", "editor.unfoldAll", undefined);
    }

    /**
     * Set the editor as read-only or not
     */
    public setReadOnlyStatus(readOnly: boolean) {
        this.monacoEditor.updateOptions({
            readOnly: readOnly,
        });
    }

    /**
     * Set the editor settings externally
     */
    public setEditorSettings(settings: monaco.editor.IEditorConstructionOptions) {
        this.monacoEditor.updateOptions(settings);
    }

    /**
     * Dispose of the given editor, and release all models and used resources
     */
    public dispose() {
        if (this.monacoEditor.getModel()) {
            this.monacoEditor.getModel().dispose();
        }
        for (const disposable of this.disposables) {
            disposable.dispose();
        }
        for (const modal of this.modals) {
            modal.destroy();
        }
        this.monacoEditor.dispose();
    }

    /**
     * Opens the editor configuration panel
     */
    public openConfiguration() {
        this.monacoEditor.trigger("external", "viewConfAction", undefined);
    }

    /**
     * Instructs the editor to remeasure its container. This method should
     * be called when the container of the editor gets resized.
     */
    public containerWasResized() {
        this.monacoEditor.layout();
    }

    /**
     * Scroll vertically or horizontally as necessary and reveal a position centered vertically.
     */
    public scrollCodeTo(lineNumber: number, column: number) {
        const position = {
            lineNumber: lineNumber || 0,
            column: column || 0,
        };
        this.monacoEditor.revealPositionInCenter(position);
        this.monacoEditor.setPosition(position);
    }

    public setViewState(viewState: monaco.editor.ICodeEditorViewState) {
        this.monacoEditor.restoreViewState(viewState);
    }

    /**
     * Get the monaco editor view state as a serialized JSON
     */
    public getViewState() {
        return this.monacoEditor.saveViewState();
    }

    /**
     * Changes the language of the editor to the given language.
     * @param language Language to set
     */
    public changeLanguage(language: string, code: string) {
        if (this._instanceSettings.language != language) {
            this.monacoEditor.getModel().dispose();
            let model = monaco.editor.createModel(
                code,
                language,
                monaco.Uri.parse("twx://privateModel/" + this._instanceSettings.modelName)
            );
            this.monacoEditor.setModel(model);
            this._instanceSettings.language = language;
        }
    }

    /**
     * Called whenever the contents of the code editor have been changed.
     */
    public onEditorContentChange(callback: (code: string) => void) {
        this.monacoEditor.onDidChangeModelContent(() => {
            callback(this.monacoEditor.getModel().getValue(monaco.editor.EndOfLinePreference.LF));
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
        // This may get called when no model is initialized. In that case, return an empty string
        return this.monacoEditor.getModel()?.getValue(monaco.editor.EndOfLinePreference.LF) || "";
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
        const workerPaths = {
            json: "json.worker.bundle.js",
            css: "./css.worker.bundle.js",
            typescript: "ts.worker.bundle.js",
            javascript: "ts.worker.bundle.js",
            editorWorkerService: "editor.worker.bundle.js",
        };

        function stripTrailingSlash(str) {
            return str.replace(/\/$/, "");
        }

        (window as any).MonacoEnvironment = {
            globalAPI: true,
            getWorkerUrl: function (moduleId, label) {
                const pathPrefix = typeof __webpack_public_path__ === "string" ? __webpack_public_path__ : "";
                const result = (pathPrefix ? stripTrailingSlash(pathPrefix) + "/" : "") + workerPaths[label];
                if (/^((http:)|(https:)|(file:)|(\/\/))/.test(result)) {
                    const currentUrl = String(window.location);
                    const currentOrigin = currentUrl.substr(
                        0,
                        currentUrl.length -
                            window.location.hash.length -
                            window.location.search.length -
                            window.location.pathname.length
                    );
                    if (result.substring(0, currentOrigin.length) !== currentOrigin) {
                        const js = "/*" + label + '*/importScripts("' + result + '");';
                        const blob = new Blob([js], { type: "application/javascript" });
                        return URL.createObjectURL(blob);
                    }
                }
                return result;
            },
        };

        // Apply the editor configuration json schema
        monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
            schemas: [
                {
                    uri: "http://monaco-editor/schema.json",
                    schema: require("../configs/confSchema.json"),
                    fileMatch: [MONACO_EDITOR_CONFIGURATION_MODEL],
                },
            ],
            allowComments: false,
            validate: true,
        });

        // Customize the typescript worker to add the methods needed by the script editor as well as CodeHost
        monaco.languages.typescript.typescriptDefaults.setWorkerOptions({
            customWorkerPath: __webpack_public_path__ + "tsCustomWorker.bundle.js",
        });
        monaco.languages.typescript.javascriptDefaults.setWorkerOptions({
            customWorkerPath: __webpack_public_path__ + "tsCustomWorker.bundle.js",
        });
    }

    /**
     * markText - creates an text decoration at the given position
     */
    public markText(
        from: EditorPosition,
        to: EditorPosition,
        options: {
            className: string;
            __annotation: { severity: string; message: any };
        }
    ) {
        if (from.ch + to.ch + from.line + to.line == 0) {
            from.line = from.ch = to.line = 1;
            to.ch = 1000;
        } else {
            // just increment everything
            from.line++;
            from.ch++;
            to.line++;
            to.ch++;
        }
        const decorations = this.monacoEditor.deltaDecorations(
            [],
            [
                {
                    range: new monaco.Range(from.line, from.ch, to.line, to.ch),
                    options: {
                        className: options.className,
                        isWholeLine: from.line == to.line && to.ch == 1000,
                        glyphMarginClassName: "CodeMirror-twxmsg-marker-" + options.__annotation.severity,
                        overviewRuler: <any>{
                            color: "red",
                        },
                        hoverMessage: [
                            {
                                value: options.__annotation.message,
                            },
                        ],
                        glyphMarginHoverMessage: {
                            value: options.__annotation.message,
                        },
                    },
                },
            ]
        );
        return {
            clear: () => this.monacoEditor.deltaDecorations(decorations, []),
        };
    }

    public clearGutter() {}

    public setGutterMarker() {}

    public hasFocus() {
        this.monacoEditor.hasTextFocus();
    }

    public setCursor() {
        // ignored since it would trigger bad artifacts when editing css
    }

    private initializePreferenceEditor(onPreferencesChanged: (newPreferences: any) => void) {
        const self = this;

        let confEditor: monaco.editor.IStandaloneCodeEditor;
        let settingsModel: monaco.editor.ITextModel;
        let modal = new tingle.modal({
            cssClass: ["tingle-popup-container"],
            onOpen: function () {
                settingsModel = monaco.editor.createModel(
                    JSON.stringify(self._currentEditorSettings, undefined, 4),
                    "json",
                    monaco.Uri.parse(MONACO_EDITOR_CONFIGURATION_MODEL)
                );

                const contentElement = this.modalBoxContent.getElementsByClassName("content")[0];
                // The settings of the configuration editor are inherited from the current editor
                confEditor = monaco.editor.create(contentElement, {
                    ...self._currentEditorSettings.editor,
                    model: settingsModel,
                });
                contentElement.onkeydown =
                    contentElement.onkeypress =
                    contentElement.onkeyup =
                        (e) => e.stopPropagation();
                confEditor.focus();
                // whenever the model changes, we need to also update the current editor, as well as other editors
                confEditor.onDidChangeModelContent((e) => {
                    try {
                        // if the json is valid, then set it on this editor as well as the editor behind
                        const expandedOptions = JSON.parse(confEditor.getModel().getValue());
                        confEditor.updateOptions(expandedOptions.editor);
                        // theme has to be updated separately
                        if (
                            expandedOptions.editor &&
                            self._currentEditorSettings.editor.theme != expandedOptions.editor.theme
                        ) {
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
                settingsModel.dispose();
            },
        });
        this.modals.push(modal);
        // action triggered by CTRL+~
        // shows a popup with a json configuration for the editor
        this.monacoEditor.addAction({
            id: "viewConfAction",
            label: "View Configuration",
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.Shift | monaco.KeyCode.Backquote],
            run: () => {
                modal.setContent(`<h2>Config Editor. Use Intellisense or check
                                    <a href='https://code.visualstudio.com/docs/getstarted/settings#_default-settings'>here</a> for available options.</h2>
                                <div class="content" style="height: 30vw"/>`);
                modal.open();
            },
        });
    }

    /**
     * Initialize the diff editor triggered by ctrl+k
     */
    private initializeDiffEditor(): void {
        let self = this;

        let diffEditor: monaco.editor.IStandaloneDiffEditor;

        let modal = new tingle.modal({
            cssClass: ["tingle-popup-container"],
            onOpen: function () {
                let originalModel = monaco.editor.createModel(
                    self._instanceSettings.code,
                    self._instanceSettings.language
                );
                let modifiedModel = self.monacoEditor.getModel();

                const editorSettings = Object.assign(
                    {},
                    self._currentEditorSettings.editor,
                    self._currentEditorSettings.diffEditor
                );
                // create the diff editor
                const contentElement = this.modalBoxContent.getElementsByClassName("content")[0];
                diffEditor = monaco.editor.createDiffEditor(contentElement, editorSettings);
                contentElement.onkeydown =
                    contentElement.onkeypress =
                    contentElement.onkeyup =
                        (e) => e.stopPropagation();

                diffEditor.setModel({
                    original: originalModel,
                    modified: modifiedModel,
                });
                diffEditor.focus();
            },
            onClose: function () {
                diffEditor.dispose();
            },
        });
        this.modals.push(modal);
        // action triggered by CTRL+K
        // shows a popup with a diff editor with the initial state of the editor
        // reuse the current model, so changes can be made directly in the diff editor
        this.monacoEditor.addAction({
            id: "viewDiffAction",
            label: "View Diff",
            contextMenuGroupId: "service",
            contextMenuOrder: 1.4,
            keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyK],
            keybindingContext: null,
            run: (ed) => {
                modal.setContent(`<h2>Diff Editor</h2>
                            <div class="content" style="height: 30vw"/>`);
                modal.open();
            },
        });
    }
}

// perform the global initialization
MonacoCodeEditor.performGlobalInitialization();
