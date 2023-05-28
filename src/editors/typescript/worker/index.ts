// only import the types from typescript since the object is provided to the worker at runtime either way
import type ts from "typescript";

const worker: import("./types").CustomTSWebWorkerFactory = (TypeScriptWorker, tsc, libFileMap) => {
    const ts = tsc.typescript;
    /**
     * An enum containing constants that describe the kind of each class member.
     */
    enum ThingworxTypescriptWidgetClassMemberKind {
        /**
         * Indicates that this member represents a widget property.
         */
        Property = "property",

        /**
         * Indicates that this member represents a widget event.
         */
        Event = "event",

        /**
         * Indicates that this member represents a widget service.
         */
        Service = "service",
    }

    /**
     * An interface describing a widget class member aspect.
     */
    interface ThingworxTypescriptWidgetAspect {
        /**
         * The name of the aspect.
         */
        name: string;

        /**
         * An optional argument that the aspect has been invoked with, if this aspect is callable.
         */
        value?: unknown;
    }

    /**
     * An interface describing a widget class member.
     */
    interface ThingworxTypescriptWidgetClassMember {
        /**
         * The name of this class member.
         */
        name: string;

        /**
         * An optional list of aspects that may be associated with this member.
         */
        aspects?: ThingworxTypescriptWidgetAspect[];

        /**
         * An optional description to display for this member in the composer.
         */
        description?: string;

        /**
         * The kind of widget member represented by this class member.
         */
        kind: ThingworxTypescriptWidgetClassMemberKind;
    }

    interface ThingworxTypescriptWidgetProperty extends ThingworxTypescriptWidgetClassMember {
        /**
         * The property's base type.
         */
        baseType: string;

        kind: ThingworxTypescriptWidgetClassMemberKind.Property;
    }

    /**
     * An interface that represents the definition of a widget class.
     */
    interface ThingworxTypescriptWidgetClass {
        /**
         * The name of the widget class.
         */
        name: string;

        /**
         * The class members with widget decorators.
         */
        members: ThingworxTypescriptWidgetClassMember[];
    }
    /**
     * The primitive type keywords that can be used anywhere.
     */
    const TypeScriptPrimitiveTypes = [
        ts.SyntaxKind.StringKeyword,
        ts.SyntaxKind.NumberKeyword,
        ts.SyntaxKind.BooleanKeyword,
        ts.SyntaxKind.AnyKeyword,
        ts.SyntaxKind.UnknownKeyword,
    ];

    /**
     * A mapping between typescript type names and valid thingworx base types.
     */
    const ThingworxBaseTypes: { [key: string]: string } = {
        NOTHING: "NOTHING",
        void: "NOTHING",
        nothing: "NOTHING",

        unknown: "ANYSCALAR",
        any: "ANYSCALAR",
        ANYSCALAR: "ANYSCALAR",

        FIELDNAME: "FIELDNAME",

        RENDERERWITHFORMAT: "RENDERERWITHFORMAT",
        RENDERERWITHSTATE: "RENDERERWITHSTATE",

        STRING: "STRING",
        string: "STRING",

        NUMBER: "NUMBER",
        number: "NUMBER",

        BOOLEAN: "BOOLEAN",
        boolean: "BOOLEAN",

        DATETIME: "DATETIME",
        Date: "DATETIME",
        datetime: "DATETIME",

        TIMESPAN: "TIMESPAN",
        timespan: "TIMESPAN",

        INFOTABLE: "INFOTABLE",
        infotable: "INFOTABLE",
        InfoTableReference: "INFOTABLE",
        InfoTable: "INFOTABLE",

        LOCATION: "LOCATION",
        location: "LOCATION",

        XML: "XML",
        xml: "XML",

        Object: "JSON",
        JSON: "JSON",
        TWJSON: "JSON",
        json: "JSON",

        QUERY: "QUERY",
        query: "QUERY",

        IMAGE: "IMAGE",
        image: "IMAGE",

        HYPERLINK: "HYPERLINK",
        hyperlink: "HYPERLINK",

        IMAGELINK: "IMAGELINK",
        imagelink: "IMAGELINK",

        PASSWORD: "PASSWORD",
        password: "PASSWORD",

        HTML: "HTML",
        html: "HTML",

        TEXT: "TEXT",
        text: "TEXT",

        TAGS: "TAGS",
        tags: "TAGS",

        SCHEDULE: "SCHEDULE",
        schedule: "SCHEDULE",

        VARIANT: "VARIANT",
        variant: "variant",

        GUID: "GUID",
        guid: "GUILD",

        BLOB: "BLOB",
        blob: "BLOB",

        INTEGER: "INTEGER",
        integer: "INTEGER",

        LONG: "LONG",
        long: "LONG",

        PROPERTYNAME: "PROPERTYNAME",
        SERVICENAME: "SERVICENAME",
        EVENTNAME: "EVENTNAME",
        THINGNAME: "THINGNAME",
        THINGSHAPENAME: "THINGSHAPENAME",
        THINGTEMPLATENAME: "THINGTEMPLATENAME",
        DATASHAPENAME: "DATASHAPENAME",
        MASHUPNAME: "MASHUPNAME",
        MENUNAME: "MENUNAME",
        BASETYPENAME: "BASETYPENAME",
        USERNAME: "USERNAME",
        GROUPNAME: "GROUPNAME",
        CATEGORYNAME: "CATEGORYNAME",
        STATEDEFINITIONNAME: "STATEDEFINITIONNAME",
        STYLEDEFINITIONNAME: "STYLEDEFINITIONNAME",
        MODELTAGVOCABULARYNAME: "MODELTAGVOCABULARYNAME",
        DATATAGVOCABULARYNAME: "DATATAGVOCABULARYNAME",
        NETWORKNAME: "NETWORKNAME",
        MEDIAENTITYNAME: "MEDIAENTITYNAME",
        APPLICATIONKEYNAME: "APPLICATIONKEYNAME",
        LOCALIZATIONTABLENAME: "LOCALIZATIONTABLENAME",
        ORGANIZATIONNAME: "ORGANIZATIONNAME",
        DASHBOARDNAME: "DASHBOARDNAME",
        PERSISTENCEPROVIDERPACKAGENAME: "PERSISTENCEPROVIDERPACKAGENAME",
        PERSISTENCEPROVIDERNAME: "PERSISTENCEPROVIDERNAME",
        PROJECTNAME: "PROJECTNAME",

        propertyName: "PROPERTYNAME",
        serviceName: "SERVICENAME",
        eventName: "EVENTNAME",
        thingName: "THINGNAME",
        thingShapeName: "THINGSHAPENAME",
        thingTemplateName: "THINGTEMPLATENAME",
        dataShapeName: "DATASHAPENAME",
        mashupName: "MASHUPNAME",
        menuName: "MENUNAME",
        baseTypeName: "BASETYPENAME",
        userName: "USERNAME",
        groupName: "GROUPNAME",
        categoryName: "CATEGORYNAME",
        stateDefinitionName: "STATEDEFINITIONNAME",
        styleDefinitionName: "STYLEDEFINITIONNAME",
        modelTagVocabularyName: "MODELTAGVOCABULARYNAME",
        dataTagVocabularyName: "DATATAGVOCABULARYNAME",
        networkName: "NETWORKNAME",
        mediaEntityName: "MEDIAENTITYNAME",
        applicationKeyName: "APPLICATIONKEYNAME",
        localizationTableName: "LOCALIZATIONTABLENAME",
        organizationName: "ORGANIZATIONNAME",
        dashboardName: "DASHBOARDNAME",
        presistenceProviderPackageName: "PERSISTENCEPROVIDERPACKAGENAME",
        persistenceProviderName: "PERSISTENCEPROVIDERNAME",
        projectName: "PROJECTNAME",

        VEC2: "VEC2",
        VEC3: "VEC3",
        VEC4: "VEC4",

        THINGCODE: "THINGCODE",
        thingcode: "THINGCODE",
    };

    interface CodeOutlineToken {
        name: string;
        kind: CodeOutlineTokenKind;
        ordinal: number;
        line: number;
        indentAmount: number;
    }

    enum CodeOutlineTokenKind {
        Class = "Class",
        ObjectLiteral = "ObjectLiteral",
        Method = "Method",
        Constructor = "Constructor",
        Function = "Function",
        Get = "Get",
        Set = "Set",
    }

    return class MonacoTSWorker extends TypeScriptWorker {
        // Useful for grabbing a TypeScript program or
        getLanguageService(): import("typescript").LanguageService {
            // @ts-ignore
            return this._languageService;
        }
        getPropertiesOrAttributesOf(
            fileName: string,
            parentObjects: string[]
        ): { [name: string]: { [name: string]: boolean } } {
            let referencedEntities: { [name: string]: { [name: string]: boolean } } = {};
            parentObjects.forEach(function (key) {
                referencedEntities[key] = {};
            });
            let program = this.getLanguageService().getProgram();
            if (program) {
                let currentFile = program.getSourceFile(fileName);
                if (currentFile) {
                    let typeChecker = program.getTypeChecker();

                    ts.forEachChild(currentFile, function visitNodes(node: ts.Node) {
                        if (ts.isPropertyAccessExpression(node) && referencedEntities[node.expression.getText()]) {
                            // Matches Things.test
                            if (!(node.name.text in referencedEntities[node.expression.getText()])) {
                                referencedEntities[node.expression.getText()][node.name.text] = true;
                            }
                        } else if (
                            ts.isElementAccessExpression(node) &&
                            referencedEntities[node.expression.getText()] &&
                            node.argumentExpression
                        ) {
                            if (node.argumentExpression.kind == ts.SyntaxKind.Identifier) {
                                if (
                                    node.expression.getText() == "Users" &&
                                    node.argumentExpression.getText() == "principal"
                                ) {
                                    // a special case for Users[principal] => replace principal with "Administrator",
                                    // since all users have the same properties and functions
                                    referencedEntities["Users"]["System"] = true;
                                }
                            }
                            if (node.argumentExpression.kind == ts.SyntaxKind.PropertyAccessExpression) {
                                // matches Things[me.property]
                                let type = typeChecker.getTypeAtLocation(node.argumentExpression);
                                if ("value" in type) {
                                    referencedEntities[node.expression.getText()][(type as any)["value"]] = true;
                                }
                            } else if (ts.isStringLiteral(node.argumentExpression)) {
                                // matches Things["test"]
                                referencedEntities[node.expression.getText()][
                                    node.argumentExpression.getText().slice(1, -1)
                                ] = true;
                            }
                        }
                        ts.forEachChild(node, visitNodes);
                    });
                }
            }
            return referencedEntities;
        }

        getOutline(fileName: string, parentObjects: string[]): CodeOutlineToken[] {
            let tokens: CodeOutlineToken[] = [];
            let program = this.getLanguageService().getProgram();
            if (program) {
                let currentFile = program.getSourceFile(fileName);
                if (currentFile) {
                    let ordinal = 0;
                    let indentation = 0;

                    const getEscapedTextOfIdentifierOrLiteral = function (node?: {
                        kind: ts.SyntaxKind;
                        escapedText?: ts.__String;
                        text?: string;
                    }): string | undefined {
                        if (node) {
                            return node.kind === ts.SyntaxKind.Identifier ? (node.escapedText as string) : node.text;
                        }
                    };

                    const extractLiteral = (liternalNode: ts.ObjectLiteralExpression) => {
                        let didExtractLiteral = false;

                        // Object literals should only be extracted if they have at least a method or any getter/setter
                        let methodCount = 0;
                        liternalNode.properties.forEach((property) => {
                            switch (property.kind) {
                                case ts.SyntaxKind.MethodDeclaration:
                                    methodCount++;
                                    break;
                                case ts.SyntaxKind.GetAccessor:
                                case ts.SyntaxKind.SetAccessor:
                                    didExtractLiteral = true;
                                    break;
                                case ts.SyntaxKind.PropertyAssignment:
                                    if (
                                        property.initializer &&
                                        (property.initializer.kind == ts.SyntaxKind.FunctionDeclaration ||
                                            property.initializer.kind == ts.SyntaxKind.FunctionExpression)
                                    ) {
                                        methodCount++;
                                    }
                            }
                        });

                        if (methodCount > 0) {
                            didExtractLiteral = true;
                        }

                        if (didExtractLiteral) {
                            ordinal++;
                            let parentNode = liternalNode.parent;

                            // Compute the name for assignments, call expressions and others
                            let name = "";
                            if (
                                parentNode.kind == ts.SyntaxKind.VariableDeclaration ||
                                parentNode.kind == ts.SyntaxKind.PropertyAssignment
                            ) {
                                let parentNodeAsVariableDeclaration = parentNode as ts.Node & {
                                    name: ts.PropertyName;
                                };
                                name = getEscapedTextOfIdentifierOrLiteral(parentNodeAsVariableDeclaration.name) || "";
                            } else if (parentNode.kind == ts.SyntaxKind.CallExpression) {
                                let parentNodeAsCallExpression = parentNode as ts.CallExpression;
                                name =
                                    (parentNodeAsCallExpression.expression &&
                                        parentNodeAsCallExpression.expression.getFullText().trim()) ||
                                    "";
                                if (name) {
                                    let nameTokens = name.split("\n");
                                    name = nameTokens[nameTokens.length - 1];
                                    name = name + "()";
                                }
                            } else if (parentNode.kind == ts.SyntaxKind.BinaryExpression) {
                                let parentNodeAsBinaryExpression = parentNode as ts.BinaryExpression;
                                // Only handle these for assignments
                                let sign: ts.BinaryOperatorToken = parentNodeAsBinaryExpression.operatorToken;
                                if (ts.tokenToString(sign.kind) == "=") {
                                    let left = parentNodeAsBinaryExpression.left;
                                    let nameTokens;
                                    switch (left.kind) {
                                        case ts.SyntaxKind.VariableDeclaration:
                                            let leftVariableDeclaration = left as unknown as ts.VariableDeclaration;
                                            name =
                                                getEscapedTextOfIdentifierOrLiteral(leftVariableDeclaration.name) || "";
                                            break;
                                        case ts.SyntaxKind.PropertyAccessExpression:
                                            name = left.getFullText().trim();
                                            nameTokens = name.split("\n");
                                            name = nameTokens[nameTokens.length - 1];
                                            break;
                                    }
                                }
                            }

                            tokens.push({
                                name: name || "{}",
                                kind: CodeOutlineTokenKind.ObjectLiteral,
                                ordinal: ordinal,
                                line: currentFile?.getLineAndCharacterOfPosition(liternalNode.getStart()).line || 0,
                                indentAmount: indentation,
                            });
                        }

                        return didExtractLiteral;
                    };

                    const extractClass = function (classNode: ts.ClassDeclaration) {
                        ordinal++;
                        if (classNode.name) {
                            tokens.push({
                                name: getEscapedTextOfIdentifierOrLiteral(classNode.name) || "",
                                kind: CodeOutlineTokenKind.Class,
                                ordinal: ordinal,
                                line: currentFile?.getLineAndCharacterOfPosition(classNode.getStart()).line || 0,
                                indentAmount: indentation,
                            });
                        } else {
                            tokens.push({
                                name: "{}",
                                kind: CodeOutlineTokenKind.Class,
                                ordinal: ordinal,
                                line: currentFile?.getLineAndCharacterOfPosition(classNode.getStart()).line || 0,
                                indentAmount: indentation,
                            });
                        }
                    };

                    const extractMethod = function (methodNode: ts.FunctionLikeDeclaration) {
                        ordinal++;
                        let node = methodNode;
                        let line = currentFile?.getLineAndCharacterOfPosition(methodNode.getStart()).line || 0;

                        let parentNode = methodNode.parent;
                        // isMethodKind is set to YES for function declarations whose parent is a property assignment
                        let isMethodKind = false;

                        // Compute the name for assignments
                        let name = "";
                        if (parentNode.kind == ts.SyntaxKind.PropertyAssignment) {
                            let parentNodeAsPropertyAssignment = parentNode as ts.PropertyAssignment;
                            name = getEscapedTextOfIdentifierOrLiteral(parentNodeAsPropertyAssignment.name) || "";
                            isMethodKind = true;
                        } else if (parentNode.kind == ts.SyntaxKind.VariableDeclaration) {
                            let parentNodeAsVariableDeclaration = parentNode as ts.VariableDeclaration;
                            name = getEscapedTextOfIdentifierOrLiteral(parentNodeAsVariableDeclaration.name) || "";
                        } else if (parentNode.kind == ts.SyntaxKind.CallExpression) {
                            let parentNodeAsCallExpression = parentNode as ts.CallExpression;
                            name =
                                (parentNodeAsCallExpression.expression &&
                                    parentNodeAsCallExpression.expression.getFullText().trim()) ||
                                "";
                            if (name) {
                                let nameTokens = name.split("\n");
                                name = nameTokens[nameTokens.length - 1].trim();
                                name = name + "()";
                            }
                        } else if (parentNode.kind == ts.SyntaxKind.BinaryExpression) {
                            // Only handle these for assignments
                            let parentNodeAsBinaryExpression = parentNode as ts.BinaryExpression;
                            let sign = parentNodeAsBinaryExpression.operatorToken;
                            if (ts.tokenToString(sign.kind) == "=") {
                                let left = parentNodeAsBinaryExpression.left;
                                let nameTokens;
                                switch (left.kind) {
                                    case ts.SyntaxKind.VariableDeclaration:
                                        let leftAsVariableDeclaration = left as unknown as ts.VariableDeclaration;
                                        name =
                                            getEscapedTextOfIdentifierOrLiteral(leftAsVariableDeclaration.name) || "";
                                        break;
                                    case ts.SyntaxKind.PropertyAccessExpression:
                                        name = left.getFullText().trim();
                                        nameTokens = name.split("\n");
                                        name = nameTokens[nameTokens.length - 1].trim();
                                        break;
                                }
                            }
                        }

                        switch (methodNode.kind) {
                            case ts.SyntaxKind.Constructor:
                                tokens.push({
                                    name: "constructor ()",
                                    kind: CodeOutlineTokenKind.Constructor,
                                    ordinal: ordinal,
                                    line: line,
                                    indentAmount: indentation,
                                });
                                break;
                            case ts.SyntaxKind.MethodDeclaration:
                                let nodeAsMethodDeclaration = node as ts.MethodDeclaration;
                                tokens.push({
                                    name: getEscapedTextOfIdentifierOrLiteral(nodeAsMethodDeclaration.name) || "{}",
                                    kind: CodeOutlineTokenKind.Method,
                                    ordinal: ordinal,
                                    line: line,
                                    indentAmount: indentation,
                                });
                                break;
                            case ts.SyntaxKind.FunctionExpression:
                            case ts.SyntaxKind.FunctionDeclaration:
                                let nodeAsFunctionDeclaration = node as ts.FunctionExpression;
                                tokens.push({
                                    name:
                                        getEscapedTextOfIdentifierOrLiteral(nodeAsFunctionDeclaration.name) ||
                                        name ||
                                        "{}",
                                    kind: isMethodKind ? CodeOutlineTokenKind.Method : CodeOutlineTokenKind.Function,
                                    ordinal: ordinal,
                                    line: line,
                                    indentAmount: indentation,
                                });
                                break;
                            case ts.SyntaxKind.GetAccessor:
                                tokens.push({
                                    name: getEscapedTextOfIdentifierOrLiteral(node.name) || "()",
                                    kind: CodeOutlineTokenKind.Get,
                                    ordinal: ordinal,
                                    line: line,
                                    indentAmount: indentation,
                                });
                                break;
                            case ts.SyntaxKind.SetAccessor:
                                tokens.push({
                                    name: getEscapedTextOfIdentifierOrLiteral(node.name) || "()",
                                    kind: CodeOutlineTokenKind.Set,
                                    ordinal: ordinal,
                                    line: line,
                                    indentAmount: indentation,
                                });
                                break;
                            case ts.SyntaxKind.ArrowFunction:
                                tokens.push({
                                    name: getEscapedTextOfIdentifierOrLiteral(node.name) || name || "() => {}",
                                    kind: CodeOutlineTokenKind.Function,
                                    ordinal: ordinal,
                                    line: line,
                                    indentAmount: indentation,
                                });
                                break;
                            default:
                                break;
                        }
                    };

                    const buildOutline = function (node: ts.Node): void {
                        let didIndent = false;
                        switch (node.kind) {
                            case ts.SyntaxKind.ObjectLiteralExpression:
                                if (extractLiteral(node as ts.ObjectLiteralExpression)) {
                                    indentation += 1;
                                    didIndent = true;
                                }
                                break;
                            case ts.SyntaxKind.ClassExpression:
                            case ts.SyntaxKind.ClassDeclaration:
                                extractClass(node as ts.ClassDeclaration);
                                indentation += 1;
                                didIndent = true;
                                break;
                            case ts.SyntaxKind.MethodDeclaration:
                            case ts.SyntaxKind.MethodSignature:
                            case ts.SyntaxKind.FunctionDeclaration:
                            case ts.SyntaxKind.FunctionExpression:
                            case ts.SyntaxKind.GetAccessor:
                            case ts.SyntaxKind.SetAccessor:
                            case ts.SyntaxKind.Constructor:
                            case ts.SyntaxKind.ArrowFunction:
                                extractMethod(node as ts.FunctionLikeDeclaration);
                                indentation += 1;
                                didIndent = true;
                                break;
                            default:
                                break;
                        }

                        ts.forEachChild(node, buildOutline);
                        if (didIndent) indentation -= 1;
                    };

                    buildOutline(currentFile);
                }
            }
            return tokens;
        }

        /**
         * Returns an object that describes the thingworx widget class declared in the given file, or `undefined`
         * if the given file does not contain a thingworx widget class.
         * If the file contains multiple widget classes, only the information related to the last class is returned.
         * @returns 	An object describing the thingworx widget class if available, `undefined` otherwise.
         */
        getWidgetClassInformation(
            fileName: string,
            parentObjects: string[]
        ): ThingworxTypescriptWidgetClass | undefined {
            const program = (this as any)._languageService.getProgram() as ts.Program;
            if (!program) return undefined;

            const currentFile = program.getSourceFile(fileName);
            if (!currentFile) return undefined;

            const typeChecker = program.getTypeChecker();

            let classDefinition: ThingworxTypescriptWidgetClass | undefined = undefined;
            let currentClass: ts.ClassDeclaration | undefined = undefined;

            /**
             * Checks whether the given node has a decorator with the given name.
             * @param name      The name of the decorator to find.
             * @param node      The node in which to search.
             * @return          `true` if the decorator was found, `false` otherwise.
             */
            const hasDecoratorNamed = (name: string, node: ts.HasDecorators): boolean => {
                const decorators = ts.getDecorators(node);

                if (!decorators) return false;

                // Getting the decorator name depends on whether the decorator is applied directly or via a
                // decorator factory
                for (const decorator of decorators) {
                    if (decorator.expression.kind == ts.SyntaxKind.CallExpression) {
                        const callExpression = decorator.expression as ts.CallExpression;
                        if (callExpression.expression.getText() == name) {
                            return true;
                        }
                    } else if (decorator.expression.kind == ts.SyntaxKind.Identifier) {
                        const identifierExpression = decorator.expression as ts.Identifier;
                        if (identifierExpression.text == name) {
                            return true;
                        }
                    }
                }
                return false;
            };

            /**
             * Returns the documentation for the given node, if it exists.
             * @param node      The node whose documentation to get.
             * @return          The documentation, or an empty string if it doesn't exist.
             */
            const documentationOfNode = (node: ts.Node): string => {
                const checker: ts.TypeChecker = program.getTypeChecker();
                if ("name" in node) {
                    const symbol = checker.getSymbolAtLocation((node as any).name);

                    if (symbol) {
                        return ts.displayPartsToString(symbol?.getDocumentationComment(checker));
                    }
                }

                return "";
            };

            /**
             * Retrieves the arguments of the decorator with the given name, if the decorator exists and is a applied
             * via a decorator factory.
             * @param name      The name of the decorator to find.
             * @param node      The node in which to search.
             * @return          An array of expressions representing the arguments, or `undefined` if they could not be retrieved.
             */
            const argumentsOfDecoratorNamed = (
                name: string,
                node: ts.HasDecorators
            ): ts.NodeArray<ts.Expression> | undefined => {
                const decorators = ts.getDecorators(node);
                if (!decorators) return;

                for (const decorator of decorators) {
                    if (decorator.expression.kind == ts.SyntaxKind.CallExpression) {
                        const callExpression = decorator.expression as ts.CallExpression;
                        if (callExpression.expression.getText() == name) {
                            return callExpression.arguments;
                        }
                    }
                }
            };

            /**
             * Retrieves the text of the single literal argument of the given decorator. This method will return undefined if the given
             * decorator factory has no arguments, more than one argument or a non-literal argument.
             * @param name      The name of the decorator to find.
             * @param node      The node in which to search.
             * @return          The text of the literal argument, or `undefined` if the decorator does not exist.
             */
            const literalArgumentOfDecoratorNamed = (name: string, node: ts.HasDecorators): string | undefined => {
                if (!hasDecoratorNamed(name, node)) return;

                const args = argumentsOfDecoratorNamed(name, node);

                if (!args || args.length != 1) {
                    return undefined;
                } else {
                    const argument = args[0];

                    if (argument.kind != ts.SyntaxKind.StringLiteral) {
                        return undefined;
                    }

                    const literalArgument = argument as ts.StringLiteral;
                    return literalArgument.text;
                }
            };

            /**
             * Checks if the given type has a specific flag.
             * @param type 		The type to check.
             * @param flag 		The flag to look for.
             * @returns 		`true` if the type has the specified flag, `false` otherwise.
             */
            const hasFlag = (type: ts.Type, flag: number): boolean => {
                return (type.flags & flag) === flag;
            };

            /**
             * Checks if the given type is an enum.
             * @param type 	The type to check.
             * @returns 	`true` if the type is an enum, `false` otherwise.
             */
            const isEnumType = (type: ts.Type): boolean => {
                if (hasFlag(type, 32 /*TypeFlags.Enum*/)) return true;

                // It's not an enum type if it's an enum literal type
                if (hasFlag(type, 1024 /*TypeFlags.EnumLiteral*/) && !type.isUnion()) return false;

                // Get the symbol and check if its value declaration is an enum declaration
                const symbol = type.getSymbol();
                if (symbol == null) return false;

                const { valueDeclaration } = symbol;
                return valueDeclaration != null && valueDeclaration.kind === ts.SyntaxKind.EnumDeclaration;
            };

            const visit = (node: ts.Node): void => {
                switch (node.kind) {
                    case ts.SyntaxKind.ClassExpression:
                    case ts.SyntaxKind.ClassDeclaration:
                        const classNode = node as ts.ClassDeclaration;

                        // Check if the class has the appropriate widget definition decorator
                        if (hasDecoratorNamed("TWWidgetDefinition", classNode)) {
                            if (classNode.name) {
                                classDefinition = {
                                    name: classNode.name.text,
                                    members: [],
                                };

                                currentClass = classNode;
                            }
                        }
                        break;
                    case ts.SyntaxKind.SetAccessor:
                    case ts.SyntaxKind.GetAccessor:
                    case ts.SyntaxKind.PropertyDeclaration:
                        // Only properties declared directly on the current class are relevant
                        if (node.parent != currentClass || !classDefinition) break;

                        // Properties can either be widget properties or widget events
                        const propertyNode = node as
                            | ts.PropertyDeclaration
                            | ts.GetAccessorDeclaration
                            | ts.SetAccessorDeclaration;
                        if (hasDecoratorNamed("property", propertyNode)) {
                            // If the node is marked as a property, add it as a member

                            // Non-identifier property names cannot map to composer properties
                            if (propertyNode.name.kind != ts.SyntaxKind.Identifier) break;
                            const name = propertyNode.name.text;

                            let typeDeclaration = propertyNode.type as ts.TypeReferenceNode | undefined;
                            if (propertyNode.kind == ts.SyntaxKind.SetAccessor) {
                                // Set accessors don't have a type node, instead they use a typed argument
                                const setter = node as ts.SetAccessorDeclaration;
                                const argument = setter.parameters[0];
                                if (argument) {
                                    typeDeclaration = argument.type as ts.TypeReferenceNode;
                                } else {
                                    typeDeclaration = undefined;
                                }
                            }

                            const aspects: ThingworxTypescriptWidgetAspect[] = [];

                            // Non-type reference type annotations cannot map to composer properties
                            if (!typeDeclaration) break;

                            const baseTypeName =
                                TypeScriptPrimitiveTypes.indexOf(typeDeclaration.kind) != -1
                                    ? typeDeclaration.getText()
                                    : typeDeclaration.typeName?.getText();
                            const inferredType = typeChecker.getTypeAtLocation(typeDeclaration);

                            let type = ThingworxBaseTypes[baseTypeName] as string | undefined;

                            // If the inferred type is an enum, the resulting property will be a dropdown string property
                            if (isEnumType(inferredType)) {
                                const enumDeclaration = inferredType.getSymbol()
                                    ?.valueDeclaration as ts.EnumDeclaration;

                                if (!enumDeclaration || enumDeclaration.kind != ts.SyntaxKind.EnumDeclaration) break;

                                const selectValue: { text: string; value: string }[] = [];
                                const selectValueAspect: ThingworxTypescriptWidgetAspect = {
                                    name: "selectOptions",
                                    value: selectValue,
                                };
                                for (const member of enumDeclaration.members) {
                                    const value = {
                                        text: member.name.getText(),
                                        value: (member.initializer as ts.LiteralExpression)?.text,
                                    };

                                    if (value.value) {
                                        selectValue.push(value);
                                    }
                                }

                                aspects.push(selectValueAspect);
                                type = "STRING";
                            }

                            // If the type isn't a thingworx type, the property cannot be represented in the composer
                            if (!type) break;

                            switch (type) {
                                case "INFOTABLE":
                                    // Infotables may optionally have a data shape argument
                                    const argument = typeDeclaration.typeArguments?.[0];
                                    if (!argument) break;
                                    if (argument.kind != ts.SyntaxKind.TypeReference) break;

                                    // If a valid data shape name is specified, add it as an aspect
                                    const argumentKind = (argument as ts.TypeReferenceNode).typeName.getText();
                                    if (!argumentKind) break;

                                    aspects.push({ name: "dataShape", value: argumentKind });
                                    break;
                                case "THINGNAME":
                                    // TODO: Thingnames may optionally have a template or shape restriction
                                    break;
                            }

                            const propertyAspects = argumentsOfDecoratorNamed("property", propertyNode);

                            if (propertyAspects?.length) {
                                for (const aspect of propertyAspects) {
                                    if (aspect.kind == ts.SyntaxKind.Identifier) {
                                        const name = (aspect as ts.Identifier).text;

                                        // Add the composer aspects, if any are defined
                                        switch (name) {
                                            case "bindingSource":
                                                aspects.push({ name: "isBindingSource", value: true });
                                                break;
                                            case "bindingTarget":
                                                aspects.push({ name: "isBindingTarget", value: true });
                                                break;
                                        }
                                    } else if (aspect.kind == ts.SyntaxKind.CallExpression) {
                                        const call = aspect as ts.CallExpression;
                                        const nameExpression = call.expression;

                                        if (nameExpression.kind == ts.SyntaxKind.Identifier) {
                                            const name = (nameExpression as ts.Identifier).text;

                                            switch (name) {
                                                case "sourcePropertyName":
                                                case "baseTypeInfotableProperty":
                                                    const value = call.arguments[0];
                                                    if (value.kind == ts.SyntaxKind.StringLiteral) {
                                                        aspects.push({
                                                            name,
                                                            value: (value as ts.StringLiteral).text,
                                                        });
                                                    }
                                                    break;
                                            }
                                        }
                                    }
                                }
                            }

                            const description = documentationOfNode(node);

                            classDefinition.members.push({
                                name,
                                baseType: type,
                                description,
                                aspects,
                                kind: ThingworxTypescriptWidgetClassMemberKind.Property,
                            } as ThingworxTypescriptWidgetProperty);
                        } else if (hasDecoratorNamed("event", propertyNode) || hasDecoratorNamed("twevent", propertyNode)) {
                            // If this property is marked as an event add it to the class

                            // Non-identifier property names cannot map to composer properties
                            if (propertyNode.name.kind != ts.SyntaxKind.Identifier) break;
                            const name = propertyNode.name.text;

                            // Non-type reference type annotations cannot map to composer properties
                            if (propertyNode.type?.kind != ts.SyntaxKind.TypeReference) break;
                            const typeNode = propertyNode.type as ts.TypeReferenceNode;

                            const type = typeNode.typeName.getText();
                            // If the type isn't EVENT, the property cannot be represented in the composer
                            if (type != "TWEvent") break;

                            const description = documentationOfNode(node);

                            classDefinition.members.push({
                                kind: ThingworxTypescriptWidgetClassMemberKind.Event,
                                name,
                                description,
                            });
                        }

                        break;
                    case ts.SyntaxKind.MethodDeclaration:
                        // Only properties declared directly on the current class are relevant
                        if (node.parent != currentClass || !classDefinition) break;
                        const methodNode = node as ts.MethodDeclaration;

                        // Only service methods are relevant
                        if (!hasDecoratorNamed("service", methodNode)) break;

                        const nameNode = methodNode.name;

                        // Only identifier names can map to composer services
                        if (nameNode.kind != ts.SyntaxKind.Identifier) break;
                        const name = nameNode.text;

                        // In order to be valid as services, all parameters must be optional
                        let isValidService = true;
                        for (const parameter of methodNode.parameters) {
                            // A parameter is optional if it is either marked optional explicitly
                            // or if it has an initializer expression
                            if (parameter.questionToken || parameter.initializer) continue;
                            isValidService = false;
                            break;
                        }

                        if (!isValidService) break;

                        const description = documentationOfNode(methodNode);

                        classDefinition.members.push({
                            kind: ThingworxTypescriptWidgetClassMemberKind.Service,
                            name,
                            description,
                        });

                        break;
                }

                ts.forEachChild(node, visit);
            };

            visit(currentFile);

            return classDefinition;
        }
    };
};

self.customTSWorkerFactory = worker;
