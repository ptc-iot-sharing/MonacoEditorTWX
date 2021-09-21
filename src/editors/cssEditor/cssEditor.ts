import { MonacoCodeEditor } from "../basicCodeEditor";
import { emmetCSS } from "emmet-monaco-es";

export class CssEditor extends MonacoCodeEditor {
    emmetDispose: ()=>void;

    constructor(container, initialSettings, actionCallbacks, instanceSettings) {
        super(container, initialSettings, actionCallbacks, instanceSettings);
        this.emmetDispose = emmetCSS();
    }

    /**
     * Dispose of the given editor, and emmet
     */
    public dispose() {
        super.dispose();
        this.emmetDispose();
    }

}