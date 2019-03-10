export interface EntityMetadataInformtion {
    propertyDefinitions: PropertyDefinitions;
    subscriptions: Subscriptions;
    eventDefinitions: EventDefinitions;
    serviceImplementations: ServiceImplementations;
    serviceMappings: ServiceMappings;
    serviceDefinitions: ServiceDefinitions;
}
interface PropertyDefinitions {
    [name: string]: PropertyDefinition
}
interface PropertyDefinition {
    sourceType?: string;
    name: string;
    aspects: Aspects;
    isLocalOnly?: boolean;
    description?: string;
    sourceName?: string;
    category?: string;
    baseType: string;
    ordinal: number;
    metadataCategory?: string;
    inheritedFrom?: InheritedFrom;
}
interface Aspects {
    isReadOnly?: boolean;
    isPersistent?: boolean;
    isLogged?: boolean;
    dataChangeType?: string;
    cacheTime?: number;
    isBuiltIn?: boolean;
    tagType?: string;
    auditMessageKey?: string;
    auditCategoryKey?: string;
    name?: string;
    aspects?: Aspects;
    description?: string;
    baseType?: string;
    ordinal?: number;
    isRequired?: boolean;
    isAsync?: boolean;
    dataShape?: string;
    defaultValue?: boolean | number | string;
    isStreamEntry?: boolean;
    thingTemplate?: string;
    thingShape?: string;
    isMultiRow?: string;
}

interface InheritedFrom {
    relationshipType: string;
    name: string;
}

interface Subscriptions {
}
interface EventDefinitions {
    [name: string]: EventDefinition;
}
interface EventDefinition {
    sourceType: string;
    name: string;
    aspects: Aspects;
    description: string;
    sourceName: string;
    category: string;
    dataShape: string;
    inheritedFrom?: InheritedFrom;
    metadataCategory: string;
}
interface ServiceImplementations {
    [name: string]: ServiceImplementation;
}
interface ServiceImplementation {
    name: string;
    description: string;
    handlerName?: string;
    configurationTables?: ConfigurationTables;
}
interface ConfigurationTables {
    Script?: Script;
}
interface Script {
    isMultiRow: boolean;
    name: string;
    description: string;
    rows: RowsItem[];
    ordinal: number;
    dataShape: DataShape;
}
interface RowsItem {
    code: string;
}
interface DataShape {
    fieldDefinitions?: FieldDefinitions;
    name?: string;
    aspects?: Aspects;
    description?: string;
    baseType?: string;
    ordinal?: number;
}
interface FieldDefinitions {
    code: Code;
}
interface Code {
    name: string;
    aspects: Aspects;
    description: string;
    baseType: string;
    ordinal: number;
}
interface ServiceDefinition {
    isAllowOverride?: boolean;
    isOpen?: boolean;
    sourceType: string;
    parameterDefinitions?: {[name: string]: ParameterDefinition};
    Inputs?: {
        fieldDefinitions: {[name: string]: ParameterDefinition}
    }
    aspects: Aspects;
    isLocalOnly?: boolean;
    isPrivate?: boolean;
    sourceName: string;
    category?: string;
    resultType?: ResultType;
    Outputs?: ResultType;
    inheritedFrom?: InheritedFrom;
    metadataCategory?: string;
    name: string,
    description: string
}
interface ServiceMappings {
    ConfigurationChanges: any;
    IncomingDependencies: any;
    OutgoingDependencyNetwork: any;
    OutgoingDependencies: any;
    IncomingDependencyNetwork: any;
    PropertyHistory: any;
}
interface ServiceDefinitions {
    [name: string]: ServiceDefinition;
}
interface ParameterDefinition {
    name: string;
    aspects?: Aspects;
    description?: string;
    baseType: string;
    ordinal: number;
}
interface ResultType {
    name: string;
    aspects: Aspects;
    description: string;
    baseType: string;
    ordinal: number;
}