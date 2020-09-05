import { ServiceEditor } from "../serviceEditor/serviceEditor";
import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { WorkerScriptManager } from "../workerScriptManager";
import { loadSnippets, spotlightSearch, sanitizeEntityName, getEntityMetadata, getThingPropertyValues } from '../../utilities';
import { DISALLOWED_ENTITY_CHARS, ENTITY_TYPES, Languages } from "../../constants";
import { ThingworxToTypescriptGenerator } from "./thingworxTypescriptGenerator";


export class TypescriptCodeEditor extends ServiceEditor {
    public static workerManager: WorkerScriptManager;
    public static codeTranslator: ThingworxToTypescriptGenerator;

    private languageSwitchAction: monaco.IDisposable;

    javascriptCode: string;
    oldTypescriptCode: string;
    private onTranspileFinished?: (javascriptCode: string) => void;
    private onLanguageChangedCallback?: (language: string) => void;

    constructor(container, initialSettings, actinoCallbacks, intanceSettings) {
        super(container, initialSettings, actinoCallbacks, intanceSettings);

        this.monacoEditor.onDidChangeModelContent((e) => {
            if (this._instanceSettings.language === Languages.TwxTypescript) {
                this.transpileTypeScript();
            }
            if (this._instanceSettings.language == Languages.TwxTypescript || this._instanceSettings.language == Languages.TwxJavascript) {
                // whenever the new char inserted is a "." or a "]", find the related metadata
                // TODO: find a better way of doing this, that is more precise
                if (e.changes && e.changes[0] && (e.changes[0].text == "." || e.changes[0].text == "]")) {
                    this.addMetadataForReferencedEntities();
                }
            }
        });
        this.addMetadataForReferencedEntities();
        if (this._instanceSettings.language === Languages.TwxTypescript) {
            this.transpileTypeScript();
        }

        this.addEditorSwitchLanguageAction();
    }

    private addEditorSwitchLanguageAction() {
        if(this._instanceSettings.language == Languages.TwxJavascript) {
            this.languageSwitchAction = this.monacoEditor.addAction({
                id: "toggleTypescript",
                label: "Switch to TypeScript",
                run: () => {
                    this.languageSwitchAction.dispose();
                    this.changeLanguage(Languages.TwxTypescript, this.oldTypescriptCode ? this.oldTypescriptCode : this.monacoEditor.getModel().getValue());
                    this.addEditorSwitchLanguageAction();
                }
            });
        } else if(this._instanceSettings.language == Languages.TwxTypescript) {
            this.languageSwitchAction = this.monacoEditor.addAction({
                id: "toggleJavascript",
                label: "Switch to JavaScript",
                run: async () => {
                    await this.transpileTypeScript();
                    this.languageSwitchAction.dispose();
                    this.changeLanguage(Languages.TwxJavascript, this.javascriptCode);
                    this.addEditorSwitchLanguageAction();
                }
            });
        }
        if(this.onLanguageChangedCallback) {
            this.onLanguageChangedCallback(this._instanceSettings.language);
        }
    }

    private async transpileTypeScript() {
        if (this.monacoEditor.getModel() == undefined) return;
        this.oldTypescriptCode = this.monacoEditor.getModel().getValue(monaco.editor.EndOfLinePreference.LF);
        const worker = await monaco.languages.typescript.getLanguageWorker(Languages.TwxTypescript)
        // if there is an uri available
        if(!this.monacoEditor.getModel().uri) {
            return;
        }
        const client = await worker(this.monacoEditor.getModel().uri);
        const emitOutput = await client.getEmitOutput(this.monacoEditor.getModel().uri.toString());
        this.javascriptCode = emitOutput.outputFiles[0].text;
        if(this.onTranspileFinished) {
            this.onTranspileFinished(this.javascriptCode);
        }
    };

    /**
     * getValue - Get the latest value. This is either the written code or the transpiled one
     */
    public getValue(): string {
        if(this._instanceSettings.language == Languages.TwxTypescript) {
            return this.javascriptCode;
        } else {
            return super.getValue();
        }
    }

    public static performGlobalInitialization() {
        try {
            // create a new language called twxJavascript
            monaco.languages.typescript.setupNamedLanguage({ id: Languages.TwxJavascript }, false, true);
            // create a new language called twxTypescript
            monaco.languages.typescript.setupNamedLanguage({ id: Languages.TwxTypescript }, true, true);
        } catch (e) {
            alert("There was an error initializing monaco. Please clean the browser cache.");
            throw e;
        }
        TypescriptCodeEditor.workerManager = new WorkerScriptManager(monaco.languages.typescript.getLanguageDefaults(Languages.TwxTypescript),
            monaco.languages.typescript.getLanguageDefaults(Languages.TwxJavascript));
        // set the compiler options
        TypescriptCodeEditor.workerManager.setCompilerOptions({
            target: monaco.languages.typescript.ScriptTarget.ES5,
            allowNonTsExtensions: true,
            noLib: true,
            newLine: monaco.languages.typescript.NewLineKind.LineFeed
        });
        // generate the completion for language snippets
        monaco.languages.registerCompletionItemProvider(Languages.TwxJavascript, {
            provideCompletionItems: function (model, position) {
                const wordUntil = model.getWordUntilPosition(position);
                const defaultRange = new monaco.Range(position.lineNumber, wordUntil.startColumn, position.lineNumber, wordUntil.endColumn);
                return loadSnippets(require("../../configs/javascriptSnippets.json"), defaultRange);
            }
        });

        monaco.languages.registerCompletionItemProvider(Languages.TwxTypescript, {
            provideCompletionItems: function (model, position) {
                const wordUntil = model.getWordUntilPosition(position);
                const defaultRange = new monaco.Range(position.lineNumber, wordUntil.startColumn, position.lineNumber, wordUntil.endColumn);
                return loadSnippets(require("../../configs/typescriptSnippets.json"), defaultRange);
            }
        });

        // generate the completion for twx snippets
        monaco.languages.registerCompletionItemProvider(Languages.TwxJavascript, {
            provideCompletionItems: function (model, position) {
                const wordUntil = model.getWordUntilPosition(position);
                const defaultRange = new monaco.Range(position.lineNumber, wordUntil.startColumn, position.lineNumber, wordUntil.endColumn);
                return loadSnippets(require("../../configs/thingworxJavascriptSnippets.json"), defaultRange);
            }
        });
        monaco.languages.registerCompletionItemProvider(Languages.TwxTypescript, {
            provideCompletionItems: function (model, position) {
                const wordUntil = model.getWordUntilPosition(position);
                const defaultRange = new monaco.Range(position.lineNumber, wordUntil.startColumn, position.lineNumber, wordUntil.endColumn);
                return loadSnippets(require("../../configs/thingworxTypescriptSnippets.json"), defaultRange);
            }
        });
        // generate the regex that matches the autocomplete for the entity collection for element access
        // for example Things["test
        let entityElementAccessRegex = new RegExp("(" + ENTITY_TYPES.join("|") + ")\\[['\"]([^'\"\\]]*)$");
        // generate the regex that matches the autocomplete for the entity collection for property access
        // for example Things.test
        let entityPropertyAccessRegex = new RegExp("(" + ENTITY_TYPES.join("|") + ")\\.([^\\.]*)$");
        // this handles on demand code completion for Thingworx entity names
        const completionProvider = {
            triggerCharacters: ["[", "[\"", "."],
            provideCompletionItems: (model, position) => {
                const wordUntil = model.getWordUntilPosition(position);
                const defaultRange = new monaco.Range(position.lineNumber, wordUntil.startColumn, position.lineNumber, wordUntil.endColumn);

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
                    return spotlightSearch(entityType, entitySearch).then((infotable) => {
                        let result: monaco.languages.CompletionItem[] = [];
                        for (let row of infotable.rows) {
                            // look in the entity collection libs and skip the elements already in there
                            let entityName = entityType + sanitizeEntityName(row.name);
                            if (this.workerManager.containsLib("thingworx/" + entityName + ".d.ts")) {
                                continue;
                            }
                            // also filter out the entities with dots or are not valid if auto-completing
                            // using property completion
                            if (isPropertyCompletion && row.name.match(DISALLOWED_ENTITY_CHARS)) {
                                continue;
                            }
                            // add to the result list
                            result.push({
                                label: row.name,
                                kind: monaco.languages.CompletionItemKind.Field,
                                documentation: row.description,
                                detail: "Entity type: " + row.type,
                                insertText: row.name,
                                range: defaultRange
                            });
                        }
                        return { suggestions: result };
                    });
                }
                return { suggestions: [] };
            }
        };
        monaco.languages.registerCompletionItemProvider(Languages.TwxJavascript, completionProvider);
        monaco.languages.registerCompletionItemProvider(Languages.TwxTypescript, completionProvider);
        // register the rhino es5 library
        TypescriptCodeEditor.workerManager.addExtraLib(require("!raw-loader!../../configs/lib.rhino.es5.d.ts").default, "lib.rhino.es5.d.ts");
        // register the thingworx base types and the logger class
        TypescriptCodeEditor.workerManager.addExtraLib(require("!raw-loader!../../configs/declarations/ThingworxBaseTypes.d.ts").default, "ThingworxBaseTypes.d.ts");
        // register the thingworx datashape library
        TypescriptCodeEditor.workerManager.addExtraLib(require("!raw-loader!../../configs/declarations/ThingworxDataShape.d.ts").default, "ThingworxDataShape.d.ts");
        // register the thingworx generic thing
        TypescriptCodeEditor.workerManager.addExtraLib(require("!raw-loader!../../configs/declarations/ThingworxGenericThing.d.ts").default, "ThingworxGenericThing.d.ts");

        this.codeTranslator = new ThingworxToTypescriptGenerator(this.workerManager);
        // we regenerate all the datashape definitions when a new editor loads
        this.codeTranslator.generateDataShapeCode();
        this.codeTranslator.generateScriptFunctionLibraries();
        this.codeTranslator.registeEntityCollectionDefs();
        this.codeTranslator.generateResourceFunctions();
    }

    /**
     * Listen to results of transpilation of typescript to javascript
     * @param callback Action to execute when the transpilation is finished
     */
    public onLanguageChanged(callback: (javascriptCode: string) => void) {
        this.onLanguageChangedCallback = callback;
    }

    /**
     * Listen to results of transpilation of typescript to javascript
     * @param callback Action to execute when the transpilation is finished
     */
    public onEditorTranspileFinished(callback: (javascriptCode: string) => void) {
        this.onTranspileFinished = callback;
    }

    public async addMetadataForReferencedEntities() {
        let referencedEntities = await this.getEntitiesInCode(this._instanceSettings.language);
        for (let collection in referencedEntities) {
            for (let entity in referencedEntities[collection]) {
                let entityName = collection + sanitizeEntityName(entity);
                if (!TypescriptCodeEditor.workerManager.containsLib("thingworx/" + entityName + ".d.ts")) {
                    // add the metadata only if it does not exist
                    let metadata = await getEntityMetadata(collection, entity);
                    let propertyData = {rows: [{}]};
                    if(collection == "Things") {
                        propertyData = await getThingPropertyValues(entity);
                    }
                    if (metadata) {
                        // generate the typescript definition
                        let entityTypescriptDef = TypescriptCodeEditor.codeTranslator.generateTypeScriptDefinitions(metadata, propertyData, entityName, true, true);
                        // add the typescript definition for this entity
                        this.registerEntityDefinitionLibrary(entityTypescriptDef, collection, entity);
                    } else {
                        console.warn(`Monaco: Failed getting metadata for entity ${collection}[${entity}]. Maybe it does not exist?`);
                    }
                }
            }
        }
    }

    /**
     * Registers a typescript definition in the extra serviceLibs
     * If it already exists, updates it
     */
    public registerEntityDefinitionLibrary(typescriptMetadata, entityType, entityId) {
        let entityName = entityType + sanitizeEntityName(entityId);
        // declare the entity under its collection
        typescriptMetadata += "\ndeclare namespace twx {\n";
        typescriptMetadata += `\texport interface ${entityType}Interface {\n`;
        typescriptMetadata += `\t'${entityId}': twx.${entityName};\n`;
        if(entityType == "Things") {
            typescriptMetadata += `\t [entityName: string]: twx.GenericThing;\n`;
        }
        // close the class declaration
        typescriptMetadata += "}\n";
        // close the namespace declaration
        typescriptMetadata += "}\n";

        TypescriptCodeEditor.workerManager.addExtraLib(typescriptMetadata, "thingworx/" + entityName + ".d.ts");
    }


    /**
     * Refreshes the definitions related to the me context
     * @param serviceModel the thingworx service model
     */
    public refreshMeDefinitions(meThingModel: {id: string, entityType: string, effectiveShape: any, propertyData: any, serviceDefinition: any}) {
        // if we have a valid entity name and the effectiveShape is set
        if (meThingModel.id && meThingModel.effectiveShape) {
            var entityName = meThingModel.entityType + "" + sanitizeEntityName(meThingModel.id);
            // we append an me in here, just in case the definition is already added by the autocomplete in another service
            var fileName = "thingworx/" + entityName + "Me.d.ts";
            TypescriptCodeEditor.workerManager.addExtraLib(TypescriptCodeEditor.codeTranslator.generateTypeScriptDefinitions(
                meThingModel.effectiveShape, meThingModel.propertyData, entityName, false, true), fileName);
            // in the current globals we have me declarations as well as input parameters
            TypescriptCodeEditor.workerManager.addExtraLib(TypescriptCodeEditor.codeTranslator.generateServiceGlobals(
                meThingModel.serviceDefinition, entityName), "thingworx/currentGlobals.d.ts");
        }
    }

      /**
     * Uses the typescript compiler API to generate a list of all the entities referenced in a
     * file and their types
     * @param {*} code Javascript/Typescript code to analyze
     */
    private async getEntitiesInCode(mode) {
        if (this.monacoEditor.getModel()) {
            let worker = await monaco.languages.typescript.getLanguageWorker(mode);
            let client = await worker(this.monacoEditor.getModel().uri);
            return await client.getPropertiesOrAttributesOf(this.monacoEditor.getModel().uri.toString(), ENTITY_TYPES);
        } else {
            return {};
        }
    }

}

TypescriptCodeEditor.performGlobalInitialization();
