// @ts-nocheck
/* global TW:false, ThingworxInvoker: false, monaco:false, $:false*/
if (!TW.monacoEditor) {
    TW.monacoEditor = {};
}
if (!TW.monacoEditor.utilities) {
    TW.monacoEditor.utilities = {};
}
// converts a nested json into a flat json. This is used for utilities reasons in order to present the configuration dialogue
TW.monacoEditor.utilities.flatten = function (data) {
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

// converts a flat json into a nested json. This is used for utilities reasons in order to present the configuration dialogue
TW.monacoEditor.utilities.unflatten = function (data) {
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
TW.monacoEditor.utilities.getDataShapeDefinitions = function () {
    var invokerSpec = {
        entityType: "Things",
        entityName: "MonacoEditorHelper",
        characteristic: "Services",
        target: "GetAllDataShapes",
        apiMethod: "post"
    };
    var invoker = new ThingworxInvoker(invokerSpec);
    return new monaco.Promise(function (c, e, p) {
        invoker.invokeService(
            function (invoker) {
                c(invoker.result.rows);
            },
            function (invoker, xhr) {
                e(invoker.result.rows);
            }
        );
    });
};

/**
 * Searches for entities in the platform using the spotlight search an returns a new promise with the metadata
 * @param  {string} entityType Thingworx Entity Type. 
 * @param  {string} searchTerm The entity to search for. Only the prefix can be specified.
 */
TW.monacoEditor.utilities.spotlightSearch = function (entityType, searchTerm) {
    var invokerSpec = {
        entityType: "Resources",
        entityName: "SearchFunctions",
        characteristic: "Services",
        target: "SpotlightSearch",
        apiMethod: "post",
        parameters: {
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
        }
    };
    var invoker = new ThingworxInvoker(invokerSpec);
    return new monaco.Promise(function (c, e, p) {
        invoker.invokeService(
            function (invoker) {
                c(invoker.result.rows);
            },
            function (invoker, xhr) {
                e("failed to search" + invoker.result.rows);
            }
        );
    });
};

/**
 * Loads a json monaco snippet file and returns a promise
 *
 * @param  {string} filePath File to load
 */
TW.monacoEditor.utilities.loadSnippets = function (filePath) {
    return new monaco.Promise(function (c, e, p) {
        $.get(filePath, {}, c, "json").fail(e);
    }).then(function (data) {
        var result = [];
        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                result.push({
                    kind: monaco.languages.CompletionItemKind.Snippet,
                    label: data[key].prefix,
                    documentation: data[key].description,
                    insertText: {
                        value: data[key].body.join("\n")
                    }
                });
            }
        }
        return result;
    });
};