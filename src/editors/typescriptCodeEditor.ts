import { MonacoCodeEditor } from "./basicCodeEditor";
import * as monaco from '../monaco-editor/esm/vs/editor/editor.api';
import { WorkerScriptManager } from "./workerScriptManager";
import { loadSnippets, spotlightSearch, sanitizeEntityName } from '../utilities';
import { DISALLOWED_ENTITY_CHARS } from "../constants";
import { ThingworxToTypescriptGenerator } from "./thingworxTypescriptGenerator";


const ENTITY_TYPES = ["ApplicationKeys", "Authenticators", "Bindings", "Blogs", "Dashboards",
    "DataAnalysisDefinitions", "DataTags", "ModelTags", "DirectoryServices", "Groups", "LocalizationTables",
    "Logs", "Mashups", "MediaEntities", "Menus", "Networks", "Organizations", "Permissions", "Projects", "StateDefinitions",
    "StyleDefinitions", "Subsystems", "Things", "ThingTemplates", "ThingShapes", "Users", "Wikis"
];

export class TypescriptCodeEditor extends MonacoCodeEditor {
    public static workerManager: WorkerScriptManager;
    public static codeTranslator: ThingworxToTypescriptGenerator;

    public static performGlobalInitialization() {
        try {
            // create a new language called twxJavascript
            monaco.languages.typescript.setupNamedLanguage({ id: "twxJavascript" }, false, true);
            // create a new language called twxTypescript
            monaco.languages.typescript.setupNamedLanguage({ id: "twxTypescript" }, true, true);
        } catch (e) {
            alert("There was an error initializing monaco. Please clean the browser cache.");
            throw e;
        }
        TypescriptCodeEditor.workerManager = new WorkerScriptManager(monaco.languages.typescript.getLanguageDefaults("twxTypescript"),
            monaco.languages.typescript.getLanguageDefaults("twxJavascript"));
        // set the compiler options
        TypescriptCodeEditor.workerManager.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ES5,
            allowNonTsExtensions: true,
            noLib: true
        });
        // generate the completion for language snippets
        monaco.languages.registerCompletionItemProvider("twxJavascript", {
            provideCompletionItems: function (model, position) {
                return loadSnippets(require("../configs/javascriptSnippets.json"));
            }
        });

        monaco.languages.registerCompletionItemProvider("twxTypescript", {
            provideCompletionItems: function (model, position) {
                return loadSnippets(require("../configs/typescriptSnippets.json"));
            }
        });

        // generate the completion for twx snippets
        monaco.languages.registerCompletionItemProvider("twxJavascript", {
            provideCompletionItems: function (model, position) {
                return loadSnippets(require("../configs/thingworxJavascriptSnippets.json"));
            }
        });
        monaco.languages.registerCompletionItemProvider("twxTypescript", {
            provideCompletionItems: function (model, position) {
                return loadSnippets(require("../configs/thingworxTypescriptSnippets.json"));
            }
        });
        // generate the regex that matches the autocomplete for the entity collection for element access
        // for example Things["test
        let entityElementAccessRegex = new RegExp("(" + ENTITY_TYPES.join("|") + ")\\[['\"]([^'\"\\]]*)$");
        // generate the regex that matches the autocomplete for the entity collection for property access
        // for example Things.test
        let entityPropertyAccessRegex = new RegExp("(" + ENTITY_TYPES.join("|") + ")\\.([^\\.]*)$");
        // this handles on demand code completion for Thingworx entity names
        monaco.languages.registerCompletionItemProvider(["twxJavascript", "twxTypescript"], {
            triggerCharacters: ["[", "[\"", "."],
            provideCompletionItems:  (model, position) => {
                // find out if we are completing on a entity collection. Get the line until the current position
                let textUntilPosition = model.getValueInRange(new monaco.Range(position.lineNumber, 1, position.lineNumber, position.column));
                let isPropertyCompletion = false;
                // matches if we have at the end of our line an entity definition. example: Things["gg"]
                let match = textUntilPosition.match(entityElementAccessRegex);
                // if that did not match, then test if it's property access. example: Things.gg
                if (!match) {
                    match = textUntilPosition.match(entityPropertyAccessRegex);
                    isPropertyCompletion = true;
                }
                if (match) {
                    // get metadata for this
                    let entityType = match[1];
                    let entitySearch = match[2];
                    // returns a  promise to the search
                    return spotlightSearch(entityType, entitySearch).then( (rows) => {
                        let result = [];
                        for (let i = 0; i < rows.length; i++) {
                            // look in the entity collection libs and skip the elements already in there
                            let entityName = entityType + "" + sanitizeEntityName(rows[i].name);
                            if (this.workerManager.containsLib(entityName)) {
                                continue;
                            }
                            // also filter out the entities with dots or are not valid if auto-completing
                            // using property completion
                            if (isPropertyCompletion && rows[i].name.match(DISALLOWED_ENTITY_CHARS)) {
                                continue;
                            }
                            // add to the result list
                            result.push({
                                label: rows[i].name,
                                kind: monaco.languages.CompletionItemKind.Field,
                                documentation: rows[i].description,
                                detail: "Entity type: " + rows[i].type,
                                insertText: rows[i].name
                            });
                        }
                        return { suggestions: result };
                    });
                }
                return { suggestions: [] };
            }
        });
        // register the rhino es5 library
        TypescriptCodeEditor.workerManager.addExtraLib(require("!raw-loader!../configs/lib.rhino.es5.d.ts"), "lib.rhino.es5.d.ts");
        // register the thingworx base types and the logger class
        TypescriptCodeEditor.workerManager.addExtraLib(require("!raw-loader!../configs/declarations/ThingworxBaseTypes.d.ts"), "ThingworxBaseTypes.d.ts");
        // register the thingworx datashape library
        TypescriptCodeEditor.workerManager.addExtraLib(require("!raw-loader!../configs/declarations/ThingworxDataShape.d.ts"), "ThingworxDataShape.d.ts");

        this.codeTranslator = new ThingworxToTypescriptGenerator(this.workerManager);
        // we regenerate all the datashape definitions when a new editor loads
        this.codeTranslator.generateDataShapeCode();
        this.codeTranslator.generateScriptFunctionLibraries();
        // also refresh the me definitions
       /* refreshMeDefinitions(serviceModel);

        generateScriptFunctions();
        generateResourceFunctions();
        registerEntityCollectionDefs();*/
        TypescriptCodeEditor.workerManager.syncExtraLibs();
    }
}



TypescriptCodeEditor.performGlobalInitialization();
