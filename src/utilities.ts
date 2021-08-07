import * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { DISALLOWED_ENTITY_CHARS } from './constants';
import { DataShape } from './types';

const MIME_APPLICATION_JSON = "application/json";

/**
 *  Converts a nested json into a flat json. This is used for utilities reasons in order to present the configuration dialogue
 */
export function flattenJson(data) {
    var result = {};
    function recurse(cur, prop) {
        if (Object(cur) !== cur) {
            result[prop] = cur;
        } else if (Array.isArray(cur)) {
            for (var i = 0, l = cur.length; i < l; i++)
                recurse(cur[i], prop + "[" + i + "]");
            if (l == 0)
                result[prop] = [];
        } else {
            var isEmpty = true;
            for (var p in cur) {
                isEmpty = false;
                recurse(cur[p], prop ? prop + "." + p : p);
            }
            if (isEmpty && prop)
                result[prop] = {};
        }
    }
    recurse(data, "");
    return result;
};

/**
 *  Converts a flat json into a nested json. This is used for utilities reasons in order to present the configuration dialogue
 */
export function unflattenJson(data) {
    "use strict";
    if (Object(data) !== data || Array.isArray(data))
        return data;
    var regex = /\.?([^.\[\]]+)|\[(\d+)\]/g,
        resultholder = {};
    for (var p in data) {
        var cur = resultholder,
            prop = "",
            m;
        while (m = regex.exec(p)) {
            cur = cur[prop] || (cur[prop] = (m[2] ? [] : {}));
            prop = m[2] || m[1];
        }
        cur[prop] = data[p];
    }
    return resultholder[""] || resultholder;
};

/**
 * Gets the metadata of all the datashapes in the system. Uses an imported service on the MonacoEditorHelper thing
 */
export async function getDataShapeDefinitions(): Promise<DataShape[]> {
    const response = await fetch(`/Thingworx/Things/MonacoEditorHelper/Services/GetAllDataShapes`, {
        method: 'POST',
        headers: {
            'Content-Type': MIME_APPLICATION_JSON,
            'Accept': MIME_APPLICATION_JSON
        }
    });
    const data = await response.json();

    return data.rows.map(e => {
        return {
            name: e.name,
            description: e.description,
            fieldDefinitions: e.fieldDefinitions.rows
        }
    })
};

/**
 * Searches for entities in the platform using the spotlight search an returns a new promise with the metadata
 * @param  {string} entityType Thingworx Entity Type. 
 * @param  {string} searchTerm The entity to search for. Only the prefix can be specified.
 */
export async function spotlightSearch(entityType, searchTerm): Promise<any> {
    const response = await fetch(`/Thingworx/Resources/SearchFunctions/Services/SpotlightSearch`, {
        method: 'POST',
        body: JSON.stringify({
            searchExpression: searchTerm + "*",
            withPermissions: false,
            isAscending: false,
            maxItems: 500,
            types: {
                // todo: proper fix for MediaEntities -> MediaEntity
                items: [entityType == "MediaEntities" ? "MediaEntity" : entityType.slice(0, -1)]
            },
            sortBy: "lastModifiedDate",
            searchDescriptions: true
        }),
        headers: {
            'Content-Type': MIME_APPLICATION_JSON,
            'Accept': MIME_APPLICATION_JSON
        }
    });
    return response.json();
};

/**
 * Loads a json monaco snippet file and returns a the Completion list
 *
 * @param  {string} snippets to load
 */
export function loadSnippets(snippets, range: monaco.Range): monaco.languages.CompletionList {
    let result: monaco.languages.CompletionList = {
        suggestions: []
    };
    for (let key in snippets) {
        if (snippets.hasOwnProperty(key)) {
            result.suggestions.push({
                kind: monaco.languages.CompletionItemKind.Snippet,
                insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                label: snippets[key].prefix,
                documentation: snippets[key].description,
                insertText: snippets[key].body.join("\n"),
                range: range
            });
        }
    }
    return result;
};

/**
 * Sanitizes an entity name to be a valid javascript declaration
 */
export function sanitizeEntityName(entityName: string): string {
    return entityName.replace(DISALLOWED_ENTITY_CHARS, "");
}

export async function getScriptFunctionLibraries(): Promise<any[]> {
    const response = await fetch(`/Thingworx/ScriptFunctionLibraries`, {
        headers: {
            'Accept': MIME_APPLICATION_JSON
        }
    });
    const libraries = await response.json();
    const result = [];
    for (const scriptFunction of libraries.rows) {
        const scriptResponse = await fetch(`/Thingworx/ScriptFunctionLibraries/${scriptFunction.name}/FunctionDefinitions`, {
            headers: {
                'Accept': MIME_APPLICATION_JSON
            }
        });
        result.push(await scriptResponse.json());
    }
    return result;
}
export async function getResourcesMetadata(): Promise<any> {
    const response = await fetch(`/Thingworx/Things/MonacoEditorHelper/Services/GetMetadataOfEntities`, {
        method: 'POST',
        body: JSON.stringify({
            entityType: 'Resource'
        }),
        headers: {
            'Content-Type': MIME_APPLICATION_JSON,
            'Accept': MIME_APPLICATION_JSON
        }
    });
    return response.json();
}

export function isGenericService(serviceDefinition: { sourceName: string, sourceType: string }): boolean {
    return serviceDefinition.sourceName == "ConfiguredThing" && serviceDefinition.sourceType == "ThingPackage";
}

export async function getEntityMetadata(entityType: string, entityName: string): Promise<any> {
    const response = await fetch(`/Thingworx/${entityType}/${encodeURIComponent(entityName)}/Metadata`, {
        headers: {
            'Accept': MIME_APPLICATION_JSON
        }
    });
    return response.json();
}

export async function getEntityInstancesMetadata(entityType: string, entityName: string): Promise<any> {
    const response = await fetch(`/Thingworx/${entityType}/${encodeURIComponent(entityName)}/InstanceMetadata`, {
        headers: {
            'Accept': MIME_APPLICATION_JSON
        }
    });
    return response.json();
}

export async function getThingPropertyValues(entityName: string): Promise<any> {
    const response = await fetch(`/Thingworx/Things/${encodeURIComponent(entityName)}/Properties`, {
        headers: {
            'Accept': MIME_APPLICATION_JSON
        }
    });
    const data = await response.json();
    return data.rows[0];
}