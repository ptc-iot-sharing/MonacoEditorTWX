/**
 * Entity names recognized my monaco can only be valid javascript variable names
 */
export const DISALLOWED_ENTITY_CHARS = /^[^a-zA-Z_]+|[^a-zA-Z_0-9]+/g;

/**
 * The default editor settings with monaco.
 * The full reference is available here: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditoroptions.html
 */
export const DEFAULT_EDITOR_SETTINGS  = {
    editor: {
        showFoldingControls: "mouseover",
        folding: true,
        fontSize: 12,
        fontFamily: "Fira Code,Monaco,monospace",
        fontLigatures: true,
        mouseWheelZoom: true,
        formatOnPaste: true,
        scrollBeyondLastLine: true,
        theme: "vs",
        disableLayerHinting: true // fixes bug in FF
    },
    diffEditor: {},
    thingworx: {
        showGenericServices: false
    }
};