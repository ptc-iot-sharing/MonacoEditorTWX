import { WorkerScriptManager } from "./workerScriptManager";
import { sanitizeEntityName, getDataShapeDefinitions, getScriptFunctionLibraries, isGenericService, getResourcesMetadata } from "../utilities";
import { ENTITY_TYPES } from "../constants";


export class ThingworxToTypescriptGenerator {
    private scriptManager: WorkerScriptManager;

    constructor(scriptManager: WorkerScriptManager) {
        this.scriptManager = scriptManager;
    }

    public async generateDataShapeCode() {
        try {
            let dataShapes = await getDataShapeDefinitions();
            this.addDataShapesAsInterfaces(dataShapes);
            this.addDataShapesCollection(dataShapes);
        } catch (reason) {
            console.error("Monaco: Failed to generate typescript definitions from dataShapes " + reason);
        }
    }

    public async generateScriptFunctionLibraries() {
        let scriptFunctions = await getScriptFunctionLibraries();
        let result = "";
        // iterate through all the script functions libraries
        for (let key in scriptFunctions) {
            if (!scriptFunctions.hasOwnProperty(key)) continue;
            // iterate through all the function definitions
            let scriptLibrary = scriptFunctions[key].details.functionDefinitions;
            for (let def in scriptLibrary) {
                if (!scriptLibrary.hasOwnProperty(def)) continue;
                let functionDef = scriptLibrary[def];
                // generate at the same time both the jsdoc as well as the function declaration
                let jsDoc = `/**\n * ${functionDef.description}`;
                let declaration = `declare function ${functionDef.name}(`;
                for (let i = 0; i < functionDef.parameterDefinitions.length; i++) {
                    let functionDefParam = functionDef.parameterDefinitions[i];
                    jsDoc += `\n * @param ${functionDefParam.name} ${functionDefParam.description}`;
                    declaration += `${functionDefParam.name}: ${this.getTypescriptBaseType(functionDefParam)}`;
                    // add a comma between the parameters
                    if (i < functionDef.parameterDefinitions.length - 1) {
                        declaration += ", ";
                    }
                }
                // add the return info
                jsDoc += `\n * @return ${functionDef.resultType.description}\n **/`;
                declaration += `): ${this.getTypescriptBaseType(functionDef.resultType)}`;
                result += `\n ${jsDoc}\n${declaration};`;
            }
        }
        this.scriptManager.addExtraLib(result, "thingworx/scriptFunctions.d.ts");
    }


    /**
    * Generate a typescript lib with all the datashapes as interfaces
    */
    private addDataShapesAsInterfaces(dataShapes) {
        // declare the namespace
        let dataShapeTs = "export as namespace twx.ds;\n";
        dataShapeTs += "declare namespace twx.ds { \n";
        for (const datashape of dataShapes) {
            // description as jsdoc
            dataShapeTs += `\t/**\n\t *${datashape.description}\n\t*/\n`;
            dataShapeTs += `export interface ${sanitizeEntityName(datashape.name)} {\n`;
            for (const fieldDef of datashape.fieldDefinitions.rows) {
                if (fieldDef.description) {
                    // description as jsdoc
                    dataShapeTs += `\t/**\n\t *${fieldDef.description}\n\t*/`;
                }
                // generate the definition of this field
                dataShapeTs += `\n\t'${fieldDef.name}'?:` + this.getTypescriptBaseType({
                    baseType: fieldDef.baseType,
                    aspects: {
                        dataShape: fieldDef.dataShape
                    }
                });
                dataShapeTs += ";\n";
            }
            dataShapeTs += "}\n\n";
        }
        dataShapeTs += "}\n";
        this.scriptManager.addExtraLib(dataShapeTs, "thingworx/DataShapeDefinitions.d.ts");
    }

    private addDataShapesCollection(dataShapes) {
        let datashapesDef = "declare namespace twx {\n";
        datashapesDef += "interface DataShapes {\n";
        // iterate through all the datashapes
        for (const datashape of dataShapes) {
            // generate the metadata for this resource
            let validEntityName = sanitizeEntityName(datashape.name);
            if (datashape.description) {
                datashapesDef += `/**\n * ${datashape.description}\n**/\n`;
            }
            datashapesDef += `\t'${datashape.name}': twx.ds<twx.ds.${validEntityName}>;\n`;
        }
        datashapesDef += "}\n}\n const DataShapes: twx.DataShapes;";
        this.scriptManager.addExtraLib(datashapesDef, "thingworx/DataShapes.d.ts");
    }

    public registeEntityCollectionDefs() {
        let entityCollectionsDefs = "";
        // now add all the entity collections
        for (const entityType of ENTITY_TYPES) {
            entityCollectionsDefs += "const " + entityType + ": twx." + entityType + "Interface;\n";
        }

        this.scriptManager.addExtraLib(entityCollectionsDefs, "thingworx/entityCollections.d.ts");
    }

    /**
    * Generates a typescript class and namespace for a metadata.
    * @param  {} effectiveShapeMetadata The enity metadata as a standard object with info about the properties. This is what thingworx responds for a object metadata request
    * @param  {String} entityName The name of the entity that has this metadata
    * @param  {Boolean} isGenericMetadata Specifies where to take the services definitios for. This differes if we are on the "me" metadata, or on a generic metadata
    * @param  {Boolean} showGenericServices Include the generic services in the results
    * @return The typescript definitions generated using this metadata
    */
    public generateTypeScriptDefinitions(effectiveShapeMetadata, propertyData, entityName: string, isGenericMetadata: boolean, showGenericServices: boolean): string {
        // based on a module class declaration
        // https://www.typescriptlang.org/docs/handbook/declaration-files/templates/module-class-d-ts.html
        let namespaceDefinition = "declare namespace twx." + entityName + " {\n";
        let classDefinition: string;
        if(showGenericServices) {
            classDefinition = `export class ${entityName} extends twx.GenericThing {\n constructor();\n`;
        } else {
            classDefinition = `export class ${entityName} {\n constructor();\n`;
        }

        // generate info retated to services
        let serviceDefs = effectiveShapeMetadata.serviceDefinitions;
        for (let key in serviceDefs) {
            if (!serviceDefs.hasOwnProperty(key)) continue;
            if (isGenericService(key)) continue;
            // first create an interface for service params
            let service = serviceDefs[key];
            // metadata for the service parameters
            let serviceParamDefinition = "";
            let serviceParameterMetadata;
            if (isGenericMetadata) {
                serviceParameterMetadata = service.Inputs.fieldDefinitions;
            } else {
                serviceParameterMetadata = service.parameterDefinitions;
            }
            if (serviceParameterMetadata && Object.keys(serviceParameterMetadata).length > 0) {
                namespaceDefinition += `export interface ${service.name}Params {\n`;
                for (let parameterDef in serviceParameterMetadata) {
                    if (!serviceParameterMetadata.hasOwnProperty(parameterDef)) continue;
                    let inputDef = serviceParameterMetadata[parameterDef];

                    const dataShapeInfo = (inputDef.aspects.dataShape ? (`\n * Datashape: ${inputDef.aspects.dataShape}`) : "");
                    namespaceDefinition += `/**\n * ${inputDef.description} ${dataShapeInfo} \n */\n ${inputDef.name}${(inputDef.aspects.isRequired ? "" : "?")}:${this.getTypescriptBaseType(inputDef)};\n`;
                    // generate a nice description of the service params
                    const dataShapeDescription = inputDef.aspects.dataShape ? (` with datashape ${inputDef.aspects.dataShape}`) : "";
                    serviceParamDefinition += `*\t${inputDef.name}: ${this.getTypescriptBaseType(inputDef)} ${dataShapeDescription} - ${inputDef.description}\n`;
                }
                namespaceDefinition += "}\n";
            }
            let outputMetadata;
            if (isGenericMetadata) {
                outputMetadata = service.Outputs;
            } else {
                outputMetadata = service.resultType;
            }
            // now generate the service definition, as well as jsdocs
            if(serviceParamDefinition) {
                classDefinition += `/**\n * Category: ${service.category} \n * ${service.description}\n * Params:\n ${serviceParamDefinition}**/\n${service.name} (params: ${entityName}.${service.name}Params): ${this.getTypescriptBaseType(outputMetadata)};\n`;
            } else {
                classDefinition += `/**\n * Category: ${service.category} \n * ${service.description}\n * \n **/\n${service.name}(): ${this.getTypescriptBaseType(outputMetadata)};\n`;
            }
        }

        // we handle property definitions here
        let propertyDefs = effectiveShapeMetadata.propertyDefinitions;
        for (let def in propertyDefs) {
            if (!propertyDefs.hasOwnProperty(def)) continue;

            let property = propertyDefs[def];
            // generate an export for each property
            if(typeof propertyData[property.name] == "string") {
                classDefinition += `/**\n * ${property.description}\n */\n readonly ${property.name} = "${propertyData[property.name]}";\n`;
            } else {
                classDefinition += `/**\n * ${property.description}\n */\n ${property.name}: ${this.getTypescriptBaseType(property)};\n`;
            }
        }
        classDefinition = classDefinition + "}\n";

        namespaceDefinition = namespaceDefinition + classDefinition + "}\n";

        return `export as namespace twx.${entityName};\n${namespaceDefinition}`;
    }

    public async generateResourceFunctions() {
        let resourceLibraries = await getResourcesMetadata()
        let resourcesDef = "declare namespace twx {\n";
        resourcesDef += "export interface ResourcesInterface {\n";
        // iterate through all the resources
        for (let key in resourceLibraries) {
            if (!resourceLibraries.hasOwnProperty(key)) continue;
            // generate the metadata for this resource
            let resourceLibrary = resourceLibraries[key].details;
            let validEntityName = sanitizeEntityName(key);
            let libraryName = "Resource" + validEntityName;
            let resourceDefinition = this.generateTypeScriptDefinitions(resourceLibrary, {}, libraryName, true, false);
            this.scriptManager.addExtraLib(resourceDefinition, "thingworx/" + libraryName + ".d.ts");
            resourcesDef += `/**\n * ${resourceLibraries[key].description}\n**/\n`;
            resourcesDef += `\t'${key}': twx.${libraryName}.${libraryName};\n`;
        }
        resourcesDef += "}\n}\n let Resources: twx.ResourcesInterface;";
        this.scriptManager.addExtraLib(resourcesDef, "thingworx/Resources.d.ts");
    }

    /**
    * Declares the me object and the inputs of the service
    */
    public generateServiceGlobals(serviceMetadata, entityName) {
    var definition = `const me = new twx.${entityName}.${entityName}();`;
    for (var key in serviceMetadata.parameterDefinitions) {
        if (!serviceMetadata.parameterDefinitions.hasOwnProperty(key)) continue;
        var inputDef = serviceMetadata.parameterDefinitions[key];
        definition += `let ${key}: ${this.getTypescriptBaseType(inputDef)};`;
    }
    return definition;
}

    /**
     * Gets the typescript interface type from a thingworx baseType
     */
    private getTypescriptBaseType(definition: { baseType: string, aspects?: { dataShape?: string } }) {
        let result = `twx.${definition.baseType}`;
        if (definition.baseType == "INFOTABLE" && definition.aspects && definition.aspects.dataShape) {
            result += `${`<twx.ds.${sanitizeEntityName(definition.aspects.dataShape)}>`}`;
        }
        return result;
    }
}