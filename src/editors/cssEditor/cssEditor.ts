import * as monaco from '../../monaco-editor/esm/vs/editor/editor.api';
import { MonacoCodeEditor, ActionCallbacks } from "../basicCodeEditor";
import { emmetCSS } from "emmet-monaco-es";

export class CssEditor extends MonacoCodeEditor {
    emmetDispose: ()=>void;

    constructor(container, initialSettings, actionCallbacks, intanceSettings) {
        super(container, initialSettings, actionCallbacks, intanceSettings);
        this.emmetDispose = emmetCSS(monaco);
    }

    /**
     * Dispose of the given editor, and emmet
     */
    public dispose() {
        super.dispose();
        this.emmetDispose();
    }

}