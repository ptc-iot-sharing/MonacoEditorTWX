import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';

/**
 * Entity names recognized my monaco can only be valid javascript variable names
 */
export const DISALLOWED_ENTITY_CHARS = /^[^a-zA-Z_]+|[^a-zA-Z_0-9]+/g;

export const MONACO_EDITOR_SETTINGS_KEY = "MONACO_EDITOR_SETTINGS";

/**
 * List of all the collections in thingworx
 */
export const ENTITY_TYPES = ["ApplicationKeys", "Authenticators", "Bindings", "Blogs", "Dashboards",
    "DataAnalysisDefinitions", "DataTags", "ModelTags", "DirectoryServices", "Groups", "LocalizationTables",
    "Logs", "Mashups", "MediaEntities", "Menus", "Networks", "Organizations", "Permissions", "Projects", "Resources", "StateDefinitions",
    "StyleDefinitions", "Subsystems", "Things", "ThingTemplates", "ThingShapes", "Users", "Wikis"
];

/**
 * The default editor settings with monaco.
 * The full reference is available here: https://microsoft.github.io/monaco-editor/api/interfaces/monaco.editor.ieditoroptions.html
 */
export const DEFAULT_EDITOR_SETTINGS: {
    editor: monaco.editor.IStandaloneEditorConstructionOptions,
    diffEditor: monaco.editor.IDiffEditorConstructionOptions,
    thingworx: any
} = {
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
        fixedOverflowWidgets: true,
        disableLayerHinting: true, // fixes bug in FF
        snippetSuggestions: "bottom",
        inlayHints: {
            enabled: true
        },
        "bracketPairColorization.enabled": "false"
    } as any,
    diffEditor: {},
    thingworx: {
        showGenericServices: false
    }
}

export enum Languages {
    TwxTypescript = 'typescript',
    TwxJavascript = 'javascript'
}