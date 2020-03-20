import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { MonacoCodeEditor, ActionCallbacks } from "../basicCodeEditor";

export interface ScriptActionCallbacks extends ActionCallbacks{
    onSave: () => void;
    onDone: () => void;
    onTest: () => void;
    onClose: () => void;
}

export class ServiceEditor extends MonacoCodeEditor {
    constructor(container, initialSettings, actionCallbacks: ScriptActionCallbacks, intanceSettings) {
        super(container, initialSettings, actionCallbacks, intanceSettings);
        this.setupActionListeners(actionCallbacks);
    }

    private setupActionListeners(callbacks: ScriptActionCallbacks) {
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