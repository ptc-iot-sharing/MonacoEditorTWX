import { stripIndents, oneLine } from 'common-tags'
import { WorkerScriptManager } from "../workerScriptManager";
import { sanitizeEntityName, getDataShapeDefinitions, getScriptFunctionLibraries, isGenericService, getResourcesMetadata } from "../../utilities";
import { ENTITY_TYPES } from "../../constants";
import { EntityMetadataInformtion } from "../../types";

export class ThingworxToTypescriptGenerator {
    private scriptManager: WorkerScriptManager;

    constructor(scriptManager: WorkerScriptManager) {
        this.scriptManager = scriptManager;
    }

    public async generateDataShapeCode() {
        try {
            let dataShapes = await getDataShapeDefinitions();
            this.addDataShapesAsInterfaces(dataShapes.rows);
            this.addDataShapesCollection(dataShapes.rows);
        } catch (reason) {
            console.error("Monaco: Failed to generate typescript definitions from dataShapes " + reason);
        }
    }

    public async generateScriptFunctionLibraries() {
        let scriptFunctions = await getScriptFunctionLibraries();
        let result = "";
        // iterate through all the script functions libraries
        for (let scriptDetails of scriptFunctions) {
            // iterate through all the function definitions
            let scriptLibrary = scriptDetails.functionDefinitions;
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
    * @param  {} effectiveShapeMetadata The entity metadata as a standard object with info about the properties. This is what thingworx responds for a object metadata request
    * @param  propertyData Map with the property values of this entity
    * @param  {String} entityName The name of the entity that has this metadata
    * @param  {Boolean} isGenericMetadata Specifies where to take the services definitions for. This differs if we are on the "me" metadata, or on a generic metadata
    * @param  {Boolean} showGenericServices Include the generic services in the results
    * @return The typescript definitions generated using this metadata
    */
    public generateTypeScriptDefinitions(effectiveShapeMetadata: EntityMetadataInformtion, propertyData: { [name: string]: any }, entityName: string, isGenericMetadata: boolean, showGenericServices: boolean): string {
        let namespaceDefinition = "declare namespace twx." + entityName + " {\n";
        let classDefinition = `declare namespace twx {
                                export class ${entityName} ${showGenericServices ? "extends twx.GenericThing" : ""} {
                                    constructor();
                                `;

        // generate definitions for the services. This includes parameter definitions and service definitions
        for (const service of Object.values(effectiveShapeMetadata.serviceDefinitions)) {
            if (isGenericService(service)) continue; // skip over generic services
            // generate the metadata for the service parameters
            let serviceParamList = [];
            // tracks number of parameters that are required for this service
            let requiredParamCount = 0;
            // input definitions can come from one of two places
            const serviceParameterMetadata = isGenericMetadata ? service.Inputs.fieldDefinitions : service.parameterDefinitions;
            // iterate over inputs
            if (serviceParameterMetadata && Object.keys(serviceParameterMetadata).length > 0) {
                namespaceDefinition += `export interface ${service.name}Params {`;
                for (const parameterDef of Object.values(serviceParameterMetadata)) {
                    const jsonDocInfoElements = [];
                    if (parameterDef.description) {
                        jsonDocInfoElements.push(parameterDef.description);
                    }
                    if (parameterDef.aspects.dataShape) {
                        jsonDocInfoElements.push(`DataShape: ${parameterDef.aspects.dataShape}`);
                    }
                    namespaceDefinition += this.generateJDocWithContent(jsonDocInfoElements.join(" - "));
                    namespaceDefinition += `${parameterDef.name}${(parameterDef.aspects.isRequired ? "" : "?")}:${this.getTypescriptBaseType(parameterDef)};\n`;
                    // generate a nice description of the service params. This includes the name, if it's required, basetype and description
                    serviceParamList.push(oneLine`  * _${parameterDef.name}${(parameterDef.aspects.isRequired ? "" : "?")}_: ${this.getTypescriptBaseType(parameterDef)}
                                                        ${parameterDef.description ? " - " + parameterDef.description : ""}`);

                    if(parameterDef.aspects.isRequired) {
                        requiredParamCount++;
                    }
                }
                namespaceDefinition += "}\n";
            }
            let outputMetadata = isGenericMetadata ? service.Outputs : service.resultType;
            const serviceJsDocElements = [];
            if (service.category) {
                serviceJsDocElements.push("**Category**: " + oneLine(service.category) + "\n");
            }
            if (service.description) {
                serviceJsDocElements.push("**Description**: " + this.handleMultilineJDocContent(service.description) + "\n");
            }
            if (serviceParamList.length > 0) {
                serviceJsDocElements.push("**Params**:\n" + serviceParamList.join("\n"));
            }
            // now generate the service definition, as well as jsdocs
            classDefinition += this.generateJDocWithContent(serviceJsDocElements.join("\n"))
            if(serviceParamList.length > 0) {
                // if the service is defined as having parameters, but no of them are required than it can be called without providing an object
                const paramDefinition = `params${requiredParamCount == 0 ? '?' : ''} : ${entityName}.${service.name}Params`
                // build out the service definition with the function name, params, and return basetype
                classDefinition += `${service.name}(${paramDefinition}): ${this.getTypescriptBaseType(outputMetadata)};\n`;
            } else {
                // If the service has no parameters, it can either be called by providing no parameters, or an empty object
                classDefinition += `${service.name}(params?: Record<any, never>): ${this.getTypescriptBaseType(outputMetadata)};\n`;
            }
        }

        // we handle property definitions here
        for (const property of Object.values(effectiveShapeMetadata.propertyDefinitions)) {
            // generate an export for each property
            if (typeof propertyData[property.name] == "string") {
                classDefinition += this.generateJDocWithContent(property.description);
                classDefinition += `readonly ${property.name} = "${oneLine(propertyData[property.name].replace(/"/g, '\\"').substring(0, 100))}";\n`;
            } else {
                classDefinition += this.generateJDocWithContent(property.description);
                classDefinition += `${property.name}: ${this.getTypescriptBaseType(property)};\n`;
            }
        }
        namespaceDefinition = `export as namespace twx.${entityName};\n${namespaceDefinition}}`;
        classDefinition += `}\n}\n`;

        return stripIndents(namespaceDefinition + "\n" + classDefinition);
    }

    public async generateResourceFunctions() {
        let resourceLibraries = await getResourcesMetadata()
        let resourcesDef = "declare namespace twx {\n";
        resourcesDef += "export interface ResourcesInterface {\n";
        // iterate through all the resources
        for (let resource of resourceLibraries.rows) {
            // generate the metadata for this resource
            let resourceLibrary = resource.metadata;
            let validEntityName = sanitizeEntityName(resource.name);
            let libraryName = "Resource" + validEntityName;
            let resourceDefinition = this.generateTypeScriptDefinitions(resourceLibrary, {}, libraryName, true, false);
            this.scriptManager.addExtraLib(resourceDefinition, "thingworx/" + libraryName + ".d.ts");
            resourcesDef += `/**\n * ${resource.description}\n**/\n`;
            resourcesDef += `\t'${resource.name}': twx.${libraryName};\n`;
        }
        resourcesDef += "}\n}\n let Resources: twx.ResourcesInterface;";
        this.scriptManager.addExtraLib(resourcesDef, "thingworx/Resources.d.ts");
    }

    /**
    * Declares the me object and the inputs of the service
    */
    public generateServiceGlobals(serviceMetadata: { parameterDefinitions: { [name: string]: any } }, entityName: string) {
        var definition = `const me = new twx.${entityName}();`;
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
    /**
     * Wraps a string into jdoc comments
     * @param content Content to be wrapped in jdoc comments
     */
    private generateJDocWithContent(content: string) {
        if (content) {
            const list = content.split(/\r?\n/).map((val) => `* ${val}`).join("\n");
            return `\n/**\n${list}\n*/\n`;
        } else {
            return "";
        }
    }

    /**
     * Handles a multiline content that needs to exists as a jdoc comment
     * @param content Multiline content that needs to be wrapped across a long jdoc
     */
    private handleMultilineJDocContent(content) {
        return content ? content.split(/\r?\n/).map((val, idx) => `${idx != 0 ? "*" : ""} ${val}`).join("\n") : "";
    }
}