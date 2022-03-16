import type { MonacoEditorSettings } from './editors/basicCodeEditor';

/**
 * Entity names recognized my monaco can only be valid javascript variable names
 */
export const DISALLOWED_ENTITY_CHARS = /^[^a-zA-Z_]+|[^a-zA-Z_0-9]+/g;

export const MONACO_EDITOR_SETTINGS_KEY = "MONACO_EDITOR_SETTINGS";
export const MONACO_EDITOR_CONFIGURATION_MODEL = "twx://configuration_model.json"
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
export const DEFAULT_EDITOR_SETTINGS: MonacoEditorSettings = {
    editor: {
        showFoldingControls: "mouseover",
        folding: true,
        fontSize: 12,
        fontFamily: "Fira Code,Monaco,monospace",
        fontLigatures: true,
        mouseWheelZoom: true,
        formatOnPaste: true,
        fixedOverflowWidgets: true,
        scrollBeyondLastLine: true,
        theme: "vs",
        disableLayerHinting: true, // fixes bug in FF
        snippetSuggestions: "bottom",
        inlayHints: {
            enabled: true
        },
        "bracketPairColorization.enabled": true
    } as any,
    diffEditor: {},
    thingworx: {
        showGenericServices: false
    },
    prettier: {
        enabled: true,
        options: {
            printWidth: 100,
        }
    }
}

export enum Languages {
    TwxTypescript = 'typescript',
    TwxJavascript = 'javascript'
}
