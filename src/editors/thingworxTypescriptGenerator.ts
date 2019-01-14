import { WorkerScriptManager } from "./workerScriptManager";
import { sanitizeEntityName, getDataShapeDefinitions } from "../utilities";


export class ThingworxToTypescriptGenerator {
    private scriptManager: WorkerScriptManager;

    constructor(scriptManager: WorkerScriptManager) {
        this.scriptManager = scriptManager;
    }

    public async  generateDataShapeCode() {
        try {
            let dataShapes = await getDataShapeDefinitions();
            this.addDataShapesAsInterfaces(dataShapes);
            this.addDataShapesCollection(dataShapes);
        } catch (reason) {
            console.error("Monaco: Failed to generate typescript definitions from dataShapes " + reason);
        }
    }

    /**
    * Generate a typescript lib with all the datashapes as interfaces
    */
    private addDataShapesAsInterfaces(dataShapes) {
        // declare the namespace
        var dataShapeTs = "export as namespace twx.ds;\n";
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