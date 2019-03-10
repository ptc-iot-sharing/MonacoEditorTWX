export as namespace twx.GenericThing;
declare namespace twx.GenericThing {
    export interface SetLocalPropertyBindingParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * Aspects for the local binding
        */
        aspects?: twx.JSON;

        /**
        * Thing name to bind to
        */
        sourceThingName?: twx.STRING;

        /**
        * Source property name
        */
        sourcePropertyName?: twx.STRING;
    }
    export interface GetBooleanPropertyValueParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;
    }
    export interface SetMultiRowConfigurationTableParams {
        /**
        * Configuration table content
        */
        configurationTable?: twx.INFOTABLE;

        /**
        * Persist these changes
        */
        persistent?: twx.BOOLEAN;

        /**
        * Configuration table name
        */
        tableName?: twx.STRING;
    }
    export interface AddNumberValueStreamEntryParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * Data value
        */
        value?: twx.NUMBER;

        /**
        * Event time (optional)
        */
        timestamp?: twx.DATETIME;
    }
    export interface QueryVec2PropertyHistoryParams {
        /**
        * Search/sort from oldest to newest
        */
        oldestFirst?: twx.BOOLEAN;

        /**
        * Maximum number of items to return
        */
        maxItems?: twx.NUMBER;

        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * End time
        */
        endDate?: twx.DATETIME;

        /**
        * Query definition
        */
        query?: twx.QUERY;

        /**
        * Start time
        */
        startDate?: twx.DATETIME;
    }
    export interface AddEventDefinitionParams {
        /**
        * Remote event name
        */
        remoteEventName?: twx.STRING;

        /**
        * Property name
        */
        name?: twx.STRING;

        /**
        * Property description
        */
        description?: twx.STRING;

        /**
        * Category
        */
        category?: twx.STRING;

        /**
        * Is a remote service
        */
        remote?: twx.BOOLEAN;

        /**
        * Data shape
        */
        dataShape?: twx.DATASHAPENAME;
    }
    export interface PurgeAllPropertyHistoryParams {
        /**
        * End time
        */
        endDate?: twx.DATETIME;

        /**
        * Start time
        */
        startDate?: twx.DATETIME;
    }
    export interface AddLocationValueStreamEntryParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * Data value
        */
        value?: twx.LOCATION;

        /**
        * Event time (optional)
        */
        timestamp?: twx.DATETIME;
    }
    export interface AddVec3ValueStreamEntryParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * Data value
        */
        value?: twx.VEC3;

        /**
        * Event time (optional)
        */
        timestamp?: twx.DATETIME;
    }
    export interface GetVec3PropertyValueParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;
    }
    export interface RemoveRemoteServiceBindingParams {
        /**
        * Service name
        */
        serviceName?: twx.STRING;
    }
    export interface GetAlertDefinitionsParams {
        /**
        * Property name
        */
        property?: twx.STRING;
    }
    export interface CheckPermissionForUserParams {
        /**
        * Name of the resource (i.e. property, service, event) to check
        */
        name?: twx.STRING;

        /**
        * Permission type
        */
        type?: twx.STRING;

        /**
        * User name
        */
        user?: twx.USERNAME;
    }
    export interface AcknowledgeAllAlertsParams {
        /**
        * Message (optional)
        */
        message?: twx.STRING;
    }
    export interface SetPublishedParams {
        /**
        * Publish status (true/false)
        */
        publish?: twx.BOOLEAN;
    }
    export interface GetImagePropertyValueParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;
    }
    export interface GetOutgoingDependenciesParams {
        /**
        * Maximum number of items to return
        */
        maxItems?: twx.NUMBER;
    }
    export interface QueryStringPropertyHistoryParams {
        /**
        * Search/sort from oldest to newest
        */
        oldestFirst?: twx.BOOLEAN;

        /**
        * Maximum number of items to return
        */
        maxItems?: twx.NUMBER;

        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * End time
        */
        endDate?: twx.DATETIME;

        /**
        * Query definition
        */
        query?: twx.QUERY;

        /**
        * Start time
        */
        startDate?: twx.DATETIME;
    }
    export interface EnableAllAlertsParams {
        /**
        * Persist this change
        */
        persistent?: twx.BOOLEAN;
    }
    export interface QueryBooleanPropertyHistoryParams {
        /**
        * Search/sort from oldest to newest
        */
        oldestFirst?: twx.BOOLEAN;

        /**
        * Maximum number of items to return
        */
        maxItems?: twx.NUMBER;

        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * End time
        */
        endDate?: twx.DATETIME;

        /**
        * Query definition
        */
        query?: twx.QUERY;

        /**
        * Start time
        */
        startDate?: twx.DATETIME;
    }
    export interface AddRunTimePermissionParams {
        /**
        * Principal name (name of user or group)
        */
        principal?: twx.STRING;

        /**
        * Permission (true = allow, false = deny)
        */
        allow?: twx.BOOLEAN;

        /**
        * Resource name (* = all or enter a specific resource (i.e. Service, Property, Event) to override)
        */
        resource?: twx.STRING;

        /**
        * Permission type (PropertyRead PropertyWrite ServiceInvoke EventInvoke EventSubscribe)
        */
        type?: twx.STRING;

        /**
        * Principal type (User or Group)
        */
        principalType?: twx.STRING;
    }
    export interface IsMultiRowTableParams {
        /**
        * Configuration table name
        */
        tableName?: twx.STRING;
    }
    export interface RemoveRemotePropertyBindingParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;
    }
    export interface GetEffectivePropertyLoggingParams {
        /**
        * Property name to look up on the effective shape for its logging status
        */
        propertyName?: twx.STRING;
    }
    export interface GetThingCodePropertyValueParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;
    }
    export interface UpdatePropertyValuesParams {
        /**
        * Collection of properties to be updated - Datashape: NamedVTQ
        */
        values?: twx.INFOTABLE<twx.ds.NamedVTQ>;
    }
    export interface DeleteAllConfigurationTableRowsParams {
        /**
        * Persist these changes
        */
        persistent?: twx.BOOLEAN;

        /**
        * Configuration table name
        */
        tableName?: twx.STRING;
    }
    export interface AddServiceDefinitionParams {
        /**
        * Property name
        */
        name?: twx.STRING;

        /**
        * Property description
        */
        description?: twx.STRING;

        /**
        * Remote service name
        */
        remoteServiceName?: twx.STRING;

        /**
        * Category
        */
        category?: twx.STRING;

        /**
        * Is a remote service
        */
        remote?: twx.BOOLEAN;

        /**
        * Service parameters - Datashape: FieldDefinition
        */
        parameters?: twx.INFOTABLE<twx.ds.FieldDefinition>;

        /**
        * Service result type - Datashape: FieldDefinition
        */
        resultType?: twx.INFOTABLE<twx.ds.FieldDefinition>;

        /**
        * Request timeout
        */
        timeout?: twx.INTEGER;
    }
    export interface CheckDesignTimePermissionForGroupParams {
        /**
        * Permission type
        */
        type?: twx.STRING;

        /**
        * Group name
        */
        group?: twx.GROUPNAME;
    }
    export interface AddOrUpdateAlertParams {
        /**
        * Alert type
        */
        alertType?: twx.STRING;

        /**
        * Alert name
        */
        alertName?: twx.STRING;

        /**
        * Property name
        */
        property?: twx.STRING;

        /**
        * Alert description
        */
        description?: twx.STRING;

        /**
        * Alert attributes
        */
        attributes?: twx.INFOTABLE;

        /**
        * Alert priority
        */
        priority?: twx.INTEGER;

        /**
        * Persist this change
        */
        persistent?: twx.BOOLEAN;

        /**
        * Alert enabled
        */
        enabled?: twx.BOOLEAN;
    }
    export interface QueryAlertHistoryParams {
        /**
        * Search/sort from oldest to newest
        */
        oldestFirst?: twx.BOOLEAN;

        /**
        * Maximum number of items to return
        */
        maxItems?: twx.NUMBER;

        /**
        * End time
        */
        endDate?: twx.DATETIME;

        /**
        * Query definition
        */
        query?: twx.QUERY;

        /**
        * Start time
        */
        startDate?: twx.DATETIME;
    }
    export interface CheckDesignTimePermissionForUserParams {
        /**
        * Permission type
        */
        type?: twx.STRING;

        /**
        * User name
        */
        user?: twx.USERNAME;
    }
    export interface GetDifferencesAsJSONParams {
        /**
        * Entity to compare
        */
        otherEntity?: twx.STRING;
    }
    export interface AddPropertyDefinitionsParams {
        /**
        * True will skip over any invalid definitions provided, false indicates to fail the whole transaction when at least one invalid definition is found
        */
        ignoreInvalidDefinitions?: twx.BOOLEAN;

        /**
        * Infotable where each row defines a property, using the PropertyDefinitionWithDetails data shape - Datashape: PropertyDefinitionWithDetails
        */
        values?: twx.INFOTABLE<twx.ds.PropertyDefinitionWithDetails>;
    }
    export interface DisableAlertsForPropertyParams {
        /**
        * Alert name
        */
        alertName?: twx.STRING;

        /**
        * Property name
        */
        property?: twx.STRING;

        /**
        * Persist this change
        */
        persistent?: twx.BOOLEAN;
    }
    export interface ImplementsShapeParams {
        /**
        * Thing shape name
        */
        thingShapeName?: twx.THINGSHAPENAME;
    }
    export interface SetPropertyLoggingParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * Enable/disable logging
        */
        enabled?: twx.BOOLEAN;
    }
    export interface GetDifferencesParams {
        /**
        * Entity to compare
        */
        otherEntity?: twx.STRING;
    }
    export interface AddLongValueStreamEntryParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * Data value
        */
        value?: twx.LONG;

        /**
        * Event time (optional)
        */
        timestamp?: twx.DATETIME;
    }
    export interface AddConfigurationTableDefinitionParams {
        /**
        * Controls whether the configuration table should accept tabular entry of data or key/value entry. When set to true, the fields in the data shape provided will be interpreted as column descriptors. When set to false or omitted, the fields are interpreted as row descriptors
        */
        isMultiRow?: twx.BOOLEAN;

        /**
        * The name of the configuration table. This name should be used when retrieving values from the configuration table during execution. Configuration tables must have unique names that obey standard ThingWorx entity naming conventions. It is strongly recommended that you always specify a non-empty configuration table name
        */
        name: twx.STRING;

        /**
        * A short description of the configuration table and its purpose
        */
        description?: twx.STRING;

        /**
        * A category that conceptually groups together related configuration tables.
        */
        category?: twx.STRING;

        /**
        * This datashape will be used as the data shape for the Configuration table. Any changes to the datashape like adding or deleting fields will reflect on the configuration table.
        */
        dataShapeName: twx.DATASHAPENAME;

        /**
        * Controls the order in which the configuration tables should be rendered. Any non-negative integer is permitted, where lower values take higher precedence over larger values. If several tables share the same ordinal, then the order is non-deterministic
        */
        ordinal?: twx.INTEGER;

        /**
        * Controls whether the configuration table should be hidden by Composer (e.g. if the configuration is for internal purposes only) 
        */
        isHidden?: twx.BOOLEAN;
    }
    export interface GetNamedPropertiesParams {
        /**
        * List of property names
        */
        propertyNames?: twx.JSON;
    }
    export interface SetRemotePropertyBindingParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * Push threshold
        */
        pushThreshold?: twx.NUMBER;

        /**
        * Aspects for the remote binding
        */
        aspects?: twx.JSON;

        /**
        * How a remote property's value should be handled by the server when a connection is lost
        */
        foldType?: twx.STRING;

        /**
        * Source property name
        */
        sourcePropertyName?: twx.STRING;

        /**
        * Request timeout
        */
        timeout?: twx.INTEGER;

        /**
        * Push type
        */
        pushType?: twx.STRING;

        /**
        * Property's cache time value at the server in milliseconds
        */
        cacheTime?: twx.INTEGER;
    }
    export interface GetEventDefinitionParams {
        /**
        * Name
        */
        name?: twx.STRING;
    }
    export interface SetIntegerAlertParameterParams {
        /**
        * Alert name
        */
        alertName?: twx.STRING;

        /**
        * Property name
        */
        property?: twx.STRING;

        /**
        * Parameter name
        */
        parameterName?: twx.STRING;

        /**
        * Make it persistent
        */
        persistent?: twx.BOOLEAN;

        /**
        * Parameter value
        */
        value?: twx.INTEGER;
    }
    export interface AddPropertyDefinitionParams {
        /**
        * Default value for property
        */
        defaultValue?: twx.STRING;

        /**
        * Aspects for the remote binding
        */
        remoteBindingAspects?: twx.JSON;

        /**
        * Property description
        */
        description?: twx.STRING;

        /**
        * Read only
        */
        readOnly?: twx.BOOLEAN;

        /**
        * Data type
        */
        type?: twx.BASETYPENAME;

        /**
        * Is a remote property
        */
        remote?: twx.BOOLEAN;

        /**
        * Remote property name
        */
        remotePropertyName?: twx.STRING;

        /**
        * Request timeout
        */
        timeout?: twx.INTEGER;

        /**
        * Push type
        */
        pushType?: twx.STRING;

        /**
        * Data change threshold
        */
        dataChangeThreshold?: twx.NUMBER;

        /**
        * Log property value
        */
        logged?: twx.BOOLEAN;

        /**
        * Property name
        */
        name?: twx.STRING;

        /**
        * Push threshold
        */
        pushThreshold?: twx.NUMBER;

        /**
        * Data change type
        */
        dataChangeType?: twx.STRING;

        /**
        * Category
        */
        category?: twx.STRING;

        /**
        * Persist property value
        */
        persistent?: twx.BOOLEAN;

        /**
        * Data shape
        */
        dataShape?: twx.DATASHAPENAME;
    }
    export interface GetDateTimeAlertParameterParams {
        /**
        * Alert name
        */
        alertName?: twx.STRING;

        /**
        * Property name
        */
        property?: twx.STRING;

        /**
        * Parameter name
        */
        parameterName?: twx.STRING;
    }
    export interface SetConfigurationTableParams {
        /**
        * Configuration table content
        */
        configurationTable?: twx.INFOTABLE;

        /**
        * Persist these changes
        */
        persistent?: twx.BOOLEAN;

        /**
        * Configuration table name
        */
        tableName?: twx.STRING;
    }
    export interface IsInNetworkParams {
        /**
        * Network name
        */
        network?: twx.STRING;
    }
    export interface RemoveDynamicSubscriptionParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * Thing name
        */
        thingName?: twx.THINGNAME;

        /**
        * Event name
        */
        eventName?: twx.STRING;

        /**
        * Local service name
        */
        serviceName?: twx.STRING;
    }
    export interface RemoveTagsParams {
        /**
        * Tags to remove from the entity
        */
        tags?: twx.TAGS;
    }
    export interface GetNumberPropertyValueParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;
    }
    export interface GetLoggedPropertiesParams {
        /**
        * Type to filter on
        */
        type?: twx.BASETYPENAME;
    }
    export interface GetServiceDefinitionParams {
        /**
        * Name
        */
        name?: twx.STRING;
    }
    export interface GetStringPropertyValueParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;
    }
    export interface DeleteRunTimePermissionParams {
        /**
        * Principal name (name of user or group)
        */
        principal?: twx.STRING;

        /**
        * Resource name
        */
        resource?: twx.STRING;

        /**
        * Permission type
        */
        type?: twx.STRING;

        /**
        * Principal type (User or Group)
        */
        principalType?: twx.STRING;
    }
    export interface GetConfigurationTableRowParams {
        /**
        * Row key value
        */
        key?: twx.STRING;

        /**
        * Configuration table name
        */
        tableName?: twx.STRING;
    }
    export interface AcknowledgeAlertParams {
        /**
        * Property name
        */
        property?: twx.STRING;

        /**
        * Message (optional)
        */
        message?: twx.STRING;
    }
    export interface QueryLocationPropertyHistoryParams {
        /**
        * Search/sort from oldest to newest
        */
        oldestFirst?: twx.BOOLEAN;

        /**
        * Maximum number of items to return
        */
        maxItems?: twx.NUMBER;

        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * End time
        */
        endDate?: twx.DATETIME;

        /**
        * Query definition
        */
        query?: twx.QUERY;

        /**
        * Start time
        */
        startDate?: twx.DATETIME;
    }
    export interface SetRemoteServiceBindingParams {
        /**
        * Source service name
        */
        sourceServiceName?: twx.STRING;

        /**
        * Service name
        */
        serviceName?: twx.STRING;

        /**
        * Request timeout
        */
        timeout?: twx.INTEGER;
    }
    export interface QueryVec4PropertyHistoryParams {
        /**
        * Search/sort from oldest to newest
        */
        oldestFirst?: twx.BOOLEAN;

        /**
        * Maximum number of items to return
        */
        maxItems?: twx.NUMBER;

        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * End time
        */
        endDate?: twx.DATETIME;

        /**
        * Query definition
        */
        query?: twx.QUERY;

        /**
        * Start time
        */
        startDate?: twx.DATETIME;
    }
    export interface IsDerivedFromTemplateParams {
        /**
        * Thing template name
        */
        thingTemplateName?: twx.THINGTEMPLATENAME;
    }
    export interface WritePropertiesToStreamParams {
        /**
        * Stream name
        */
        name?: twx.THINGNAME;

        /**
        * Tags
        */
        tags?: twx.TAGS;
    }
    export interface GetThingRelationshipsParams {
        /**
        * Maximum depth to search
        */
        maxDepth?: twx.INTEGER;
    }
    export interface AddVec4ValueStreamEntryParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * Data value
        */
        value?: twx.VEC4;

        /**
        * Event time (optional)
        */
        timestamp?: twx.DATETIME;
    }
    export interface AddDateTimeValueStreamEntryParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * Data value
        */
        value?: twx.DATETIME;

        /**
        * Event time (optional)
        */
        timestamp?: twx.DATETIME;
    }
    export interface GetServiceDefinitionsParams {
        /**
        * Category to filter on
        */
        category?: twx.STRING;

        /**
        * Type to filter on
        */
        type?: twx.BASETYPENAME;

        /**
        * Data shape to filter on if InfoTable base type
        */
        dataShape?: twx.DATASHAPENAME;
    }
    export interface PurgeSelectedPropertyHistoryParams {
        /**
        * Properties to purge - Datashape: PropertyList
        */
        propertiesToPurge?: twx.INFOTABLE<twx.ds.PropertyList>;

        /**
        * End time
        */
        endDate?: twx.DATETIME;

        /**
        * Start time
        */
        startDate?: twx.DATETIME;
    }
    export interface SetHomeMashupParams {
        /**
        * Home mashup name
        */
        name?: twx.MASHUPNAME;
    }
    export interface SetOwnerParams {
        /**
        * User name
        */
        name?: twx.USERNAME;
    }
    export interface QueryNumberPropertyHistoryParams {
        /**
        * Search/sort from oldest to newest
        */
        oldestFirst?: twx.BOOLEAN;

        /**
        * Maximum number of items to return
        */
        maxItems?: twx.NUMBER;

        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * End time
        */
        endDate?: twx.DATETIME;

        /**
        * Query definition
        */
        query?: twx.QUERY;

        /**
        * Start time
        */
        startDate?: twx.DATETIME;
    }
    export interface SetNumberAlertParameterParams {
        /**
        * Alert name
        */
        alertName?: twx.STRING;

        /**
        * Property name
        */
        property?: twx.STRING;

        /**
        * Parameter name
        */
        parameterName?: twx.STRING;

        /**
        * Make it persistent
        */
        persistent?: twx.BOOLEAN;

        /**
        * Parameter value
        */
        value?: twx.NUMBER;
    }
    export interface GetAlertStatusParams {
        /**
        * Alert name
        */
        alertName?: twx.STRING;

        /**
        * Property name
        */
        property?: twx.STRING;
    }
    export interface SetBooleanAlertParameterParams {
        /**
        * Alert name
        */
        alertName?: twx.STRING;

        /**
        * Property name
        */
        property?: twx.STRING;

        /**
        * Parameter name
        */
        parameterName?: twx.STRING;

        /**
        * Make it persistent
        */
        persistent?: twx.BOOLEAN;

        /**
        * Parameter value
        */
        value?: twx.BOOLEAN;
    }
    export interface DeleteConfigurationTableParams {
        /**
        * Persist these changes
        */
        persistent?: twx.BOOLEAN;

        /**
        * Configuration table name
        */
        tableName?: twx.STRING;
    }
    export interface GetPermissionsForCurrentUserParams {
        /**
        * Target name (or wildcard)
        */
        name?: twx.STRING;

        /**
        * Permission name
        */
        permissionName?: twx.STRING;
    }
    export interface QueryPropertyHistoryParams {
        /**
        * Search/sort from oldest to newest
        */
        oldestFirst?: twx.BOOLEAN;

        /**
        * Maximum number of items to return
        */
        maxItems?: twx.NUMBER;

        /**
        * End time
        */
        endDate?: twx.DATETIME;

        /**
        * Query definition
        */
        query?: twx.QUERY;

        /**
        * Start time
        */
        startDate?: twx.DATETIME;
    }
    export interface CheckDesignTimePermissionParams {
        /**
        * Permission type
        */
        type?: twx.STRING;
    }
    export interface GetConfigurationTableDefinitionParams {
        /**
        * Configuration table name
        */
        tableName?: twx.STRING;
    }
    export interface RemoveLocalPropertyBindingParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;
    }
    export interface GetVec2PropertyValueParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;
    }
    export interface QueryLongPropertyHistoryParams {
        /**
        * Search/sort from oldest to newest
        */
        oldestFirst?: twx.BOOLEAN;

        /**
        * Maximum number of items to return
        */
        maxItems?: twx.NUMBER;

        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * End time
        */
        endDate?: twx.DATETIME;

        /**
        * Query definition
        */
        query?: twx.QUERY;

        /**
        * Start time
        */
        startDate?: twx.DATETIME;
    }
    export interface SetDesignTimePermissionsAsJSONParams {
        /**
        * Permissions in JSON format
        */
        permissions?: twx.JSON;
    }
    export interface GetRemoteEventBindingParams {
        /**
        * Event name
        */
        eventName?: twx.STRING;
    }
    export interface GetPermissionsForGroupParams {
        /**
        * Target name (or wildcard)
        */
        name?: twx.STRING;

        /**
        * Group name
        */
        group?: twx.STRING;

        /**
        * Permission name
        */
        permissionName?: twx.STRING;
    }
    export interface AddIntegerValueStreamEntryParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * Data value
        */
        value?: twx.INTEGER;

        /**
        * Event time (optional)
        */
        timestamp?: twx.DATETIME;
    }
    export interface GetRemotePropertyBindingParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;
    }
    export interface SetTagsParams {
        /**
        * Tags for an entity
        */
        tags?: twx.TAGS;
    }
    export interface GetIncomingDependenciesParams {
        /**
        * Maximum number of items to return
        */
        maxItems?: twx.NUMBER;
    }
    export interface PromoteAlertParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * Alert name
        */
        alertName?: twx.STRING;
    }
    export interface AddTagsParams {
        /**
        * Tags for an entity
        */
        tags?: twx.TAGS;
    }
    export interface GetPermissionsForUserParams {
        /**
        * Target name (or wildcard)
        */
        name?: twx.STRING;

        /**
        * User name
        */
        user?: twx.STRING;

        /**
        * Permission name
        */
        permissionName?: twx.STRING;
    }
    export interface AddBooleanValueStreamEntryParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * Data value
        */
        value?: twx.BOOLEAN;

        /**
        * Event time (optional)
        */
        timestamp?: twx.DATETIME;
    }
    export interface GetNamedPropertyValuesParams {
        /**
        * Property names - Datashape: EntityList
        */
        propertyNames?: twx.INFOTABLE<twx.ds.EntityList>;
    }
    export interface CheckPermissionForGroupParams {
        /**
        * Name of the resource (i.e. property, service, event) to check
        */
        name?: twx.STRING;

        /**
        * Permission type
        */
        type?: twx.STRING;

        /**
        * Group name
        */
        group?: twx.GROUPNAME;
    }
    export interface SetIdentifierParams {
        /**
        * Thing identifier for remote things
        */
        identifier?: twx.STRING;
    }
    export interface GetDateTimePropertyValueParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;
    }
    export interface GetAnomalyAlertTrainingStatisticsForAlertParams {
        /**
        * Alert name
        */
        alertName?: twx.STRING;

        /**
        * Property name
        */
        property?: twx.STRING;
    }
    export interface DisableSubscriptionParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * Thing name
        */
        thingName?: twx.THINGNAME;

        /**
        * Event name
        */
        eventName?: twx.STRING;
    }
    export interface HavePropertiesChangedSinceParams {
        /**
        * Timestamp to compare
        */
        timestamp?: twx.DATETIME;
    }
    export interface QueryImagePropertyHistoryParams {
        /**
        * Search/sort from oldest to newest
        */
        oldestFirst?: twx.BOOLEAN;

        /**
        * Maximum number of items to return
        */
        maxItems?: twx.NUMBER;

        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * End time
        */
        endDate?: twx.DATETIME;

        /**
        * Query definition
        */
        query?: twx.QUERY;

        /**
        * Start time
        */
        startDate?: twx.DATETIME;
    }
    export interface SetVisibilityPermissionsAsJSONParams {
        /**
        * Permissions in JSON format
        */
        permissions?: twx.JSON;
    }
    export interface GetAlertDefinitionParams {
        /**
        * Alert name
        */
        alertName?: twx.STRING;

        /**
        * Property name
        */
        property?: twx.STRING;
    }
    export interface AddVisibilityPermissionParams {
        /**
        * Principal name (name of organization or organization unit)
        */
        principal?: twx.STRING;

        /**
        * Principal type (Organization or Organization Unit)
        */
        principalType?: twx.STRING;
    }
    export interface RemoveAlertParams {
        /**
        * Alert name
        */
        alertName?: twx.STRING;

        /**
        * Property name
        */
        property?: twx.STRING;

        /**
        * Persist this change
        */
        persistent?: twx.BOOLEAN;
    }
    export interface GetLocationAlertParameterParams {
        /**
        * Alert name
        */
        alertName?: twx.STRING;

        /**
        * Property name
        */
        property?: twx.STRING;

        /**
        * Parameter name
        */
        parameterName?: twx.STRING;
    }
    export interface AddDynamicSubscriptionParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * Thing name
        */
        thingName?: twx.THINGNAME;

        /**
        * Event name
        */
        eventName?: twx.STRING;

        /**
        * Local service name
        */
        serviceName?: twx.STRING;
    }
    export interface GetIntegerAlertParameterParams {
        /**
        * Alert name
        */
        alertName?: twx.STRING;

        /**
        * Property name
        */
        property?: twx.STRING;

        /**
        * Parameter name
        */
        parameterName?: twx.STRING;
    }
    export interface GetIncomingLocalPropertyBindingParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;
    }
    export interface SetValueStreamParams {
        /**
        * Value stream name
        */
        name?: twx.THINGNAME;
    }
    export interface RemoveServiceDefinitionParams {
        /**
        * Service name
        */
        name?: twx.STRING;
    }
    export interface GetLongAlertParameterParams {
        /**
        * Alert name
        */
        alertName?: twx.STRING;

        /**
        * Property name
        */
        property?: twx.STRING;

        /**
        * Parameter name
        */
        parameterName?: twx.STRING;
    }
    export interface AddStringValueStreamEntryParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * Data value
        */
        value?: twx.STRING;

        /**
        * Event time (optional)
        */
        timestamp?: twx.DATETIME;
    }
    export interface GetLocalPropertyBindingParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;
    }
    export interface GetAlertSummaryParams {
        /**
        * Maximum number of items to return
        */
        maxItems?: twx.NUMBER;

        /**
        * Show only unacknowledged alerts
        */
        onlyUnacknowledged?: twx.BOOLEAN;

        /**
        * Show only acknowledged alerts
        */
        onlyAcknowledged?: twx.BOOLEAN;
    }
    export interface QueryAlertSummaryParams {
        /**
        * Maximum number of items to return
        */
        maxItems?: twx.NUMBER;

        /**
        * Query definition
        */
        query?: twx.QUERY;

        /**
        * Show only unacknowledged alerts
        */
        onlyUnacknowledged?: twx.BOOLEAN;

        /**
        * Show only acknowledged alerts
        */
        onlyAcknowledged?: twx.BOOLEAN;
    }
    export interface SetLocationAlertParameterParams {
        /**
        * Alert name
        */
        alertName?: twx.STRING;

        /**
        * Property name
        */
        property?: twx.STRING;

        /**
        * Parameter name
        */
        parameterName?: twx.STRING;

        /**
        * Make it persistent
        */
        persistent?: twx.BOOLEAN;

        /**
        * Parameter value
        */
        value?: twx.LOCATION;
    }
    export interface GetLongPropertyValueParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;
    }
    export interface GetEventDefinitionsParams {
        /**
        * Category to filter on
        */
        category?: twx.STRING;

        /**
        * Data shape to filter on if InfoTable base type
        */
        dataShape?: twx.DATASHAPENAME;
    }
    export interface QueryNamedPropertyHistoryParams {
        /**
        * Search/sort from oldest to newest
        */
        oldestFirst?: twx.BOOLEAN;

        /**
        * Maximum number of items to return
        */
        maxItems?: twx.NUMBER;

        /**
        * End time
        */
        endDate?: twx.DATETIME;

        /**
        * Property names - Datashape: EntityList
        */
        propertyNames?: twx.INFOTABLE<twx.ds.EntityList>;

        /**
        * Query definition
        */
        query?: twx.QUERY;

        /**
        * Start time
        */
        startDate?: twx.DATETIME;
    }
    export interface SetPropertyValuesParams {
        /**
        * Property values
        */
        values?: twx.INFOTABLE;
    }
    export interface GetAnomalyAlertTrainingStatisticsForPropertyParams {
        /**
        * Property name
        */
        property?: twx.STRING;
    }
    export interface QueryIntegerPropertyHistoryParams {
        /**
        * Search/sort from oldest to newest
        */
        oldestFirst?: twx.BOOLEAN;

        /**
        * Maximum number of items to return
        */
        maxItems?: twx.NUMBER;

        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * End time
        */
        endDate?: twx.DATETIME;

        /**
        * Query definition
        */
        query?: twx.QUERY;

        /**
        * Start time
        */
        startDate?: twx.DATETIME;
    }
    export interface GetPropertyDefinitionParams {
        /**
        * Name
        */
        name?: twx.STRING;
    }
    export interface GetAlertSummaryForPropertyParams {
        /**
        * Maximum number of items to return
        */
        maxItems?: twx.NUMBER;

        /**
        * Show only unacknowledged alerts
        */
        onlyUnacknowledged?: twx.BOOLEAN;

        /**
        * Property name
        */
        property?: twx.STRING;

        /**
        * Show only acknowledged alerts
        */
        onlyAcknowledged?: twx.BOOLEAN;
    }
    export interface AddThingCodeValueStreamEntryParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * Data value
        */
        value?: twx.THINGCODE;

        /**
        * Event time (optional)
        */
        timestamp?: twx.DATETIME;
    }
    export interface GetPropertyTimeParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;
    }
    export interface AddVec2ValueStreamEntryParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * Data value
        */
        value?: twx.VEC2;

        /**
        * Event time (optional)
        */
        timestamp?: twx.DATETIME;
    }
    export interface AddImageValueStreamEntryParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * Data value
        */
        value?: twx.IMAGE;

        /**
        * Event time (optional)
        */
        timestamp?: twx.DATETIME;
    }
    export interface GetPropertyDefinitionsParams {
        /**
        * Category to filter on
        */
        category?: twx.STRING;

        /**
        * Type to filter on
        */
        type?: twx.BASETYPENAME;

        /**
        * Data shape to filter on if InfoTable base type
        */
        dataShape?: twx.DATASHAPENAME;
    }
    export interface QueryThingCodePropertyHistoryParams {
        /**
        * Search/sort from oldest to newest
        */
        oldestFirst?: twx.BOOLEAN;

        /**
        * Maximum number of items to return
        */
        maxItems?: twx.NUMBER;

        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * End time
        */
        endDate?: twx.DATETIME;

        /**
        * Query definition
        */
        query?: twx.QUERY;

        /**
        * Start time
        */
        startDate?: twx.DATETIME;
    }
    export interface RemoveRemoteEventBindingParams {
        /**
        * Event name
        */
        eventName?: twx.STRING;
    }
    export interface GetOutgoingDependenciesAsNetworkParams {
        /**
        * Maximum depth to traverse
        */
        maxDepth?: twx.NUMBER;

        /**
        * Maximum number of items to return
        */
        maxItems?: twx.NUMBER;
    }
    export interface GetLocalAlertDefinitionsParams {
        /**
        * Property name
        */
        property?: twx.STRING;
    }
    export interface GetAlertStatusesForPropertyParams {
        /**
        * Property name
        */
        property?: twx.STRING;
    }
    export interface GetNumberAlertParameterParams {
        /**
        * Alert name
        */
        alertName?: twx.STRING;

        /**
        * Property name
        */
        property?: twx.STRING;

        /**
        * Parameter name
        */
        parameterName?: twx.STRING;
    }
    export interface GetPropertyQualityParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;
    }
    export interface GetIncomingDependenciesAsNetworkParams {
        /**
        * Maximum depth to traverse
        */
        maxDepth?: twx.NUMBER;

        /**
        * Maximum number of items to return
        */
        maxItems?: twx.NUMBER;
    }
    export interface HasAlertParams {
        /**
        * Alert name
        */
        alertName?: twx.STRING;

        /**
        * Property name
        */
        property?: twx.STRING;
    }
    export interface RemoveEventDefinitionParams {
        /**
        * Event name
        */
        name?: twx.STRING;
    }
    export interface SetRunTimePermissionsAsJSONParams {
        /**
        * Permissions in JSON format
        */
        permissions?: twx.JSON;
    }
    export interface EnableSubscriptionParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * Thing name
        */
        thingName?: twx.THINGNAME;

        /**
        * Event name
        */
        eventName?: twx.STRING;
    }
    export interface QueryDateTimePropertyHistoryParams {
        /**
        * Search/sort from oldest to newest
        */
        oldestFirst?: twx.BOOLEAN;

        /**
        * Maximum number of items to return
        */
        maxItems?: twx.NUMBER;

        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * End time
        */
        endDate?: twx.DATETIME;

        /**
        * Query definition
        */
        query?: twx.QUERY;

        /**
        * Start time
        */
        startDate?: twx.DATETIME;
    }
    export interface SetRemoteEventBindingParams {
        /**
        * Source event name
        */
        sourceEventName?: twx.STRING;

        /**
        * Event name
        */
        eventName?: twx.STRING;
    }
    export interface EnableAlertsForPropertyParams {
        /**
        * Alert name
        */
        alertName?: twx.STRING;

        /**
        * Property name
        */
        property?: twx.STRING;

        /**
        * Persist this change
        */
        persistent?: twx.BOOLEAN;
    }
    export interface GetStringAlertParameterParams {
        /**
        * Alert name
        */
        alertName?: twx.STRING;

        /**
        * Property name
        */
        property?: twx.STRING;

        /**
        * Parameter name
        */
        parameterName?: twx.STRING;
    }
    export interface RemovePropertyDefinitionParams {
        /**
        * Property name
        */
        name?: twx.STRING;
    }
    export interface DeleteConfigurationTableRowsParams {
        /**
        * Configuration table rows to modify
        */
        values?: twx.INFOTABLE;

        /**
        * Persist these changes
        */
        persistent?: twx.BOOLEAN;

        /**
        * Configuration table name
        */
        tableName?: twx.STRING;
    }
    export interface SetConfigurationTableRowsParams {
        /**
        * Configuration table rows to modify
        */
        values?: twx.INFOTABLE;

        /**
        * Persist these changes
        */
        persistent?: twx.BOOLEAN;

        /**
        * Configuration table name
        */
        tableName?: twx.STRING;
    }
    export interface SetStringAlertParameterParams {
        /**
        * Alert name
        */
        alertName?: twx.STRING;

        /**
        * Property name
        */
        property?: twx.STRING;

        /**
        * Parameter name
        */
        parameterName?: twx.STRING;

        /**
        * Make it persistent
        */
        persistent?: twx.BOOLEAN;

        /**
        * Parameter value
        */
        value?: twx.STRING;
    }
    export interface AddDesignTimePermissionParams {
        /**
        * Principal name (name of user or group)
        */
        principal?: twx.STRING;

        /**
        * Permission (true = allow, false = deny)
        */
        allow?: twx.BOOLEAN;

        /**
        * Permission type (Create, Read, Update, Delete)
        */
        type?: twx.STRING;

        /**
        * Principal type (User or Group)
        */
        principalType?: twx.STRING;
    }
    export interface CheckPermissionParams {
        /**
        * Name of the resource (i.e. property, service, event) to check
        */
        name?: twx.STRING;

        /**
        * Permission type
        */
        type?: twx.STRING;
    }
    export interface SetDateTimeAlertParameterParams {
        /**
        * Alert name
        */
        alertName?: twx.STRING;

        /**
        * Property name
        */
        property?: twx.STRING;

        /**
        * Parameter name
        */
        parameterName?: twx.STRING;

        /**
        * Make it persistent
        */
        persistent?: twx.BOOLEAN;

        /**
        * Parameter value
        */
        value?: twx.DATETIME;
    }
    export interface GetBooleanAlertParameterParams {
        /**
        * Alert name
        */
        alertName?: twx.STRING;

        /**
        * Property name
        */
        property?: twx.STRING;

        /**
        * Parameter name
        */
        parameterName?: twx.STRING;
    }
    export interface DisableAllAlertsParams {
        /**
        * Persist this change
        */
        persistent?: twx.BOOLEAN;
    }
    export interface GetLocationPropertyValueParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;
    }
    export interface GetNamedPropertyValuesVTQParams {
        /**
        * Property names - Datashape: EntityList
        */
        propertyNames?: twx.INFOTABLE<twx.ds.EntityList>;
    }
    export interface GetNamedPropertyValuesVTQAParams {
        /**
        * Property names - Datashape: EntityList
        */
        propertyNames?: twx.INFOTABLE<twx.ds.EntityList>;
    }
    export interface AddInfoTableValueStreamEntryParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * Data value
        */
        value?: twx.INFOTABLE;

        /**
        * Event time (optional)
        */
        timestamp?: twx.DATETIME;
    }
    export interface GetVec4PropertyValueParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;
    }
    export interface SetAvatarParams {
        /**
        * Base 64 Encoded Content
        */
        content?: twx.IMAGE;
    }
    export interface QueryInfoTablePropertyHistoryParams {
        /**
        * Search/sort from oldest to newest
        */
        oldestFirst?: twx.BOOLEAN;

        /**
        * Maximum number of items to return
        */
        maxItems?: twx.NUMBER;

        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * End time
        */
        endDate?: twx.DATETIME;

        /**
        * Query definition
        */
        query?: twx.QUERY;

        /**
        * Start time
        */
        startDate?: twx.DATETIME;
    }
    export interface SetProjectNameParams {
        /**
        * Project name
        */
        projectName?: twx.PROJECTNAME;
    }
    export interface RetrainAlertParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * Alert name
        */
        alertName?: twx.STRING;
    }
    export interface GetPropertyLoggingParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;
    }
    export interface QueryVec3PropertyHistoryParams {
        /**
        * Search/sort from oldest to newest
        */
        oldestFirst?: twx.BOOLEAN;

        /**
        * Maximum number of items to return
        */
        maxItems?: twx.NUMBER;

        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * End time
        */
        endDate?: twx.DATETIME;

        /**
        * Query definition
        */
        query?: twx.QUERY;

        /**
        * Start time
        */
        startDate?: twx.DATETIME;
    }
    export interface SetDescriptionParams {
        /**
        * Description for an entity
        */
        description?: twx.STRING;
    }
    export interface GetConfigurationTableParams {
        /**
        * Configuration table name
        */
        tableName?: twx.STRING;
    }
    export interface DeleteDesignTimePermissionParams {
        /**
        * Principal name (name of user or group)
        */
        principal?: twx.STRING;

        /**
        * Permission type
        */
        type?: twx.STRING;

        /**
        * Principal type (User or Group)
        */
        principalType?: twx.STRING;
    }
    export interface GetRemoteServiceBindingParams {
        /**
        * Service name
        */
        serviceName?: twx.STRING;
    }
    export interface PurgePropertyHistoryParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;

        /**
        * End time
        */
        endDate?: twx.DATETIME;

        /**
        * Delete immediately
        */
        immediate?: twx.BOOLEAN;

        /**
        * Start time
        */
        startDate?: twx.DATETIME;
    }
    export interface DeleteVisibilityPermissionParams {
        /**
        * Principal name (name of organization or organization unit)
        */
        principal?: twx.STRING;

        /**
        * Principal type (Organization or Organization Unit)
        */
        principalType?: twx.STRING;
    }
    export interface GetIntegerPropertyValueParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;
    }
    export interface GetEffectiveLocalPropertyBindingParams {
        /**
        * Property name
        */
        propertyName?: twx.STRING;
    }
}
declare namespace twx {
    export class GenericThing {
        constructor();

        /**
        * **Category**: Bindings
        * 
        * **Description**:  Set the property binding for a property
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        * * _aspects_: twx.JSON - Aspects for the local binding
        * * _sourceThingName_: twx.STRING - Thing name to bind to
        * * _sourcePropertyName_: twx.STRING - Source property name
        */
        SetLocalPropertyBinding(params: GenericThing.SetLocalPropertyBindingParams): twx.NOTHING;

        /**
        * **Category**: Properties
        * 
        * **Description**:  Get the current property value
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        */
        GetBooleanPropertyValue(params: GenericThing.GetBooleanPropertyValueParams): twx.BOOLEAN;

        /**
        * **Category**: DataLogging
        * 
        * **Description**:  Get the identifier for a thing
        * 
        */
        GetValueStream(params: GenericThing.GetValueStreamParams): twx.THINGNAME;

        /**
        * **Category**: Configuration
        * 
        * **Description**:  Set an entire multi-row configuration table
        * 
        * **Params**:
        * * _configurationTable_: twx.INFOTABLE - Configuration table content
        * * _persistent_: twx.BOOLEAN - Persist these changes
        * * _tableName_: twx.STRING - Configuration table name
        */
        SetMultiRowConfigurationTable(params: GenericThing.SetMultiRowConfigurationTableParams): twx.NOTHING;

        /**
        * **Category**: Permissions
        * 
        * **Description**:  Get a list of assigned design time permissions
        * 
        */
        GetDesignTimePermissions(params: GenericThing.GetDesignTimePermissionsParams): twx.INFOTABLE<twx.ds.Permissions>;

        /**
        * **Category**: StreamEntries
        * 
        * **Description**:  Add a new stream entry
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        * * _value_: twx.NUMBER - Data value
        * * _timestamp_: twx.DATETIME - Event time (optional)
        */
        AddNumberValueStreamEntry(params: GenericThing.AddNumberValueStreamEntryParams): twx.NOTHING;

        /**
        * **Category**: Queries
        * 
        * **Description**:  Query stream entries, along with filter and sort criteria
        * 
        * **Params**:
        * * _oldestFirst_: twx.BOOLEAN - Search/sort from oldest to newest
        * * _maxItems_: twx.NUMBER - Maximum number of items to return
        * * _propertyName_: twx.STRING - Property name
        * * _endDate_: twx.DATETIME - End time
        * * _query_: twx.QUERY - Query definition
        * * _startDate_: twx.DATETIME - Start time
        */
        QueryVec2PropertyHistory(params: GenericThing.QueryVec2PropertyHistoryParams): twx.INFOTABLE<twx.ds.Vec2DataShape>;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Add or update an event definition
        * 
        * **Params**:
        * * _remoteEventName_: twx.STRING - Remote event name
        * * _name_: twx.STRING - Property name
        * * _description_: twx.STRING - Property description
        * * _category_: twx.STRING - Category
        * * _remote_: twx.BOOLEAN - Is a remote service
        * * _dataShape_: twx.DATASHAPENAME - Data shape
        */
        AddEventDefinition(params: GenericThing.AddEventDefinitionParams): twx.NOTHING;

        /**
        * **Category**: Maintenance
        * 
        * **Description**:  Purge all value stream entries for a specified date range
        * 
        * **Params**:
        * * _endDate_: twx.DATETIME - End time
        * * _startDate_: twx.DATETIME - Start time
        */
        PurgeAllPropertyHistory(params: GenericThing.PurgeAllPropertyHistoryParams): twx.NOTHING;

        /**
        * **Category**: Permissions
        * 
        * **Description**:  Get a list of assigned visibility permissions
        * 
        */
        GetVisibilityPermissions(params: GenericThing.GetVisibilityPermissionsParams): twx.INFOTABLE<twx.ds.Permissions>;

        /**
        * **Category**: StreamEntries
        * 
        * **Description**:  Add a new stream entry
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        * * _value_: twx.LOCATION - Data value
        * * _timestamp_: twx.DATETIME - Event time (optional)
        */
        AddLocationValueStreamEntry(params: GenericThing.AddLocationValueStreamEntryParams): twx.NOTHING;

        /**
        * **Category**: StreamEntries
        * 
        * **Description**:  Add a new stream entry
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        * * _value_: twx.VEC3 - Data value
        * * _timestamp_: twx.DATETIME - Event time (optional)
        */
        AddVec3ValueStreamEntry(params: GenericThing.AddVec3ValueStreamEntryParams): twx.NOTHING;

        /**
        * **Category**: Permissions
        * 
        * **Description**:  Get a list of assigned runtime permissions
        * 
        */
        GetRunTimePermissions(params: GenericThing.GetRunTimePermissionsParams): twx.INFOTABLE<twx.ds.Permissions>;

        /**
        * **Category**: Properties
        * 
        * **Description**:  Get the current property value
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        */
        GetVec3PropertyValue(params: GenericThing.GetVec3PropertyValueParams): twx.VEC3;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Get the metadata in JSON format
        * 
        */
        GetMetadataAsJSON(params: GenericThing.GetMetadataAsJSONParams): twx.JSON;

        /**
        * **Category**: Bindings
        * 
        * **Description**:  Remove the remote service binding for a service
        * 
        * **Params**:
        * * _serviceName_: twx.STRING - Service name
        */
        RemoveRemoteServiceBinding(params: GenericThing.RemoveRemoteServiceBindingParams): twx.NOTHING;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Get thing summary information
        * 
        */
        GetThingSummaryInformation(params: GenericThing.GetThingSummaryInformationParams): twx.INFOTABLE<twx.ds.Thing>;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Get effective alert definitions for a property
        * 
        * **Params**:
        * * _property_: twx.STRING - Property name
        */
        GetAlertDefinitions(params: GenericThing.GetAlertDefinitionsParams): twx.INFOTABLE<twx.ds.AlertDefinition>;

        /**
        * **Category**: Permissions
        * 
        * **Description**:  Check to see if an entity has a specific run time permission for a specific user
        * 
        * **Params**:
        * * _name_: twx.STRING - Name of the resource (i.e. property, service, event) to check
        * * _type_: twx.STRING - Permission type
        * * _user_: twx.USERNAME - User name
        */
        CheckPermissionForUser(params: GenericThing.CheckPermissionForUserParams): twx.BOOLEAN;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Acknowledge all active alerts
        * 
        * **Params**:
        * * _message_: twx.STRING - Message (optional)
        */
        AcknowledgeAllAlerts(params: GenericThing.AcknowledgeAllAlertsParams): twx.NOTHING;

        /**
        * **Category**: Federation
        * 
        * **Description**:  Set this as a published thing for federation
        * 
        * **Params**:
        * * _publish_: twx.BOOLEAN - Publish status (true/false)
        */
        SetPublished(params: GenericThing.SetPublishedParams): twx.NOTHING;

        /**
        * **Category**: Properties
        * 
        * **Description**:  Get the current property value
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        */
        GetImagePropertyValue(params: GenericThing.GetImagePropertyValueParams): twx.IMAGE;

        /**
        * **Category**: Dependencies
        * 
        * **Description**:  Get the outgoing dependencies
        * 
        * **Params**:
        * * _maxItems_: twx.NUMBER - Maximum number of items to return
        */
        GetOutgoingDependencies(params: GenericThing.GetOutgoingDependenciesParams): twx.INFOTABLE<twx.ds.EntityDescriptor>;

        /**
        * **Category**: Queries
        * 
        * **Description**:  Query stream entries, along with filter and sort criteria
        * 
        * **Params**:
        * * _oldestFirst_: twx.BOOLEAN - Search/sort from oldest to newest
        * * _maxItems_: twx.NUMBER - Maximum number of items to return
        * * _propertyName_: twx.STRING - Property name
        * * _endDate_: twx.DATETIME - End time
        * * _query_: twx.QUERY - Query definition
        * * _startDate_: twx.DATETIME - Start time
        */
        QueryStringPropertyHistory(params: GenericThing.QueryStringPropertyHistoryParams): twx.INFOTABLE<twx.ds.StringValueStream>;

        /**
        * **Category**: Federation
        * 
        * **Description**:  Get published thing for federation
        * 
        */
        GetPublished(params: GenericThing.GetPublishedParams): twx.BOOLEAN;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Get the Statuses of the given Alerts
        * 
        */
        GetAlertStatuses(params: GenericThing.GetAlertStatusesParams): twx.INFOTABLE<twx.ds.AlertStatus>;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Enable all alerts for a thing
        * 
        * **Params**:
        * * _persistent_: twx.BOOLEAN - Persist this change
        */
        EnableAllAlerts(params: GenericThing.EnableAllAlertsParams): twx.NOTHING;

        /**
        * **Category**: Queries
        * 
        * **Description**:  Query stream entries, along with filter and sort criteria
        * 
        * **Params**:
        * * _oldestFirst_: twx.BOOLEAN - Search/sort from oldest to newest
        * * _maxItems_: twx.NUMBER - Maximum number of items to return
        * * _propertyName_: twx.STRING - Property name
        * * _endDate_: twx.DATETIME - End time
        * * _query_: twx.QUERY - Query definition
        * * _startDate_: twx.DATETIME - Start time
        */
        QueryBooleanPropertyHistory(params: GenericThing.QueryBooleanPropertyHistoryParams): twx.INFOTABLE<twx.ds.BooleanValueStream>;

        /**
        * **Category**: Permissions
        * 
        * **Description**:  Add a run time permission
        * 
        * **Params**:
        * * _principal_: twx.STRING - Principal name (name of user or group)
        * * _allow_: twx.BOOLEAN - Permission (true = allow, false = deny)
        * * _resource_: twx.STRING - Resource name (* = all or enter a specific resource (i.e. Service, Property, Event) to override)
        * * _type_: twx.STRING - Permission type (PropertyRead PropertyWrite ServiceInvoke EventInvoke EventSubscribe)
        * * _principalType_: twx.STRING - Principal type (User or Group)
        */
        AddRunTimePermission(params: GenericThing.AddRunTimePermissionParams): twx.NOTHING;

        /**
        * **Category**: Configuration
        * 
        * **Description**:  Check if a configuration table is a multi-row table
        * 
        * **Params**:
        * * _tableName_: twx.STRING - Configuration table name
        */
        IsMultiRowTable(params: GenericThing.IsMultiRowTableParams): twx.BOOLEAN;

        /**
        * **Category**: Bindings
        * 
        * **Description**:  Remove the remote property binding for a property
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        */
        RemoveRemotePropertyBinding(params: GenericThing.RemoveRemotePropertyBindingParams): twx.NOTHING;

        /**
        * **Category**: DataLogging
        * 
        * **Description**:  Get the logging status of a specific property from the effective Thing shape
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name to look up on the effective shape for its logging status
        */
        GetEffectivePropertyLogging(params: GenericThing.GetEffectivePropertyLoggingParams): twx.BOOLEAN;

        /**
        * **Category**: Projects
        * 
        * **Description**:  Get the project name of this entity
        * 
        */
        GetProjectName(params: GenericThing.GetProjectNameParams): twx.STRING;

        /**
        * **Category**: Properties
        * 
        * **Description**:  Get the current property value
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        */
        GetThingCodePropertyValue(params: GenericThing.GetThingCodePropertyValueParams): twx.THINGCODE;

        /**
        * **Category**: Properties
        * 
        * **Description**:  Write property values for a thing
        * 
        * **Params**:
        * * _values_: twx.INFOTABLE<twx.ds.NamedVTQ> - Collection of properties to be updated
        */
        UpdatePropertyValues(params: GenericThing.UpdatePropertyValuesParams): twx.NOTHING;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Get the implemented thing shapes for this thing
        * 
        */
        GetImplementedShapes(params: GenericThing.GetImplementedShapesParams): twx.INFOTABLE<twx.ds.EntityList>;

        /**
        * **Category**: Configuration
        * 
        * **Description**:  Delete all rows from a multi-row configuration table
        * 
        * **Params**:
        * * _persistent_: twx.BOOLEAN - Persist these changes
        * * _tableName_: twx.STRING - Configuration table name
        */
        DeleteAllConfigurationTableRows(params: GenericThing.DeleteAllConfigurationTableRowsParams): twx.NOTHING;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Add or update a service definition
        * 
        * **Params**:
        * * _name_: twx.STRING - Property name
        * * _description_: twx.STRING - Property description
        * * _remoteServiceName_: twx.STRING - Remote service name
        * * _category_: twx.STRING - Category
        * * _remote_: twx.BOOLEAN - Is a remote service
        * * _parameters_: twx.INFOTABLE<twx.ds.FieldDefinition> - Service parameters
        * * _resultType_: twx.INFOTABLE<twx.ds.FieldDefinition> - Service result type
        * * _timeout_: twx.INTEGER - Request timeout
        */
        AddServiceDefinition(params: GenericThing.AddServiceDefinitionParams): twx.NOTHING;

        /**
        * **Category**: Permissions
        * 
        * **Description**:  Check to see if an entity has a specific design time permission for a specific group
        * 
        * **Params**:
        * * _type_: twx.STRING - Permission type
        * * _group_: twx.GROUPNAME - Group name
        */
        CheckDesignTimePermissionForGroup(params: GenericThing.CheckDesignTimePermissionForGroupParams): twx.BOOLEAN;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Add or update an alert for a property
        * 
        * **Params**:
        * * _alertType_: twx.STRING - Alert type
        * * _alertName_: twx.STRING - Alert name
        * * _property_: twx.STRING - Property name
        * * _description_: twx.STRING - Alert description
        * * _attributes_: twx.INFOTABLE - Alert attributes
        * * _priority_: twx.INTEGER - Alert priority
        * * _persistent_: twx.BOOLEAN - Persist this change
        * * _enabled_: twx.BOOLEAN - Alert enabled
        */
        AddOrUpdateAlert(params: GenericThing.AddOrUpdateAlertParams): twx.NOTHING;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Query the alert history
        * 
        * **Params**:
        * * _oldestFirst_: twx.BOOLEAN - Search/sort from oldest to newest
        * * _maxItems_: twx.NUMBER - Maximum number of items to return
        * * _endDate_: twx.DATETIME - End time
        * * _query_: twx.QUERY - Query definition
        * * _startDate_: twx.DATETIME - Start time
        */
        QueryAlertHistory(params: GenericThing.QueryAlertHistoryParams): twx.INFOTABLE<twx.ds.AlertHistory>;

        /**
        * **Category**: Permissions
        * 
        * **Description**:  Check to see if an entity has a specific design time permission for a specific user
        * 
        * **Params**:
        * * _type_: twx.STRING - Permission type
        * * _user_: twx.USERNAME - User name
        */
        CheckDesignTimePermissionForUser(params: GenericThing.CheckDesignTimePermissionForUserParams): twx.BOOLEAN;

        /**
        * **Category**: Queries
        * 
        * **Description**:  Get the difference between this entity and another
        * 
        * **Params**:
        * * _otherEntity_: twx.STRING - Entity to compare
        */
        GetDifferencesAsJSON(params: GenericThing.GetDifferencesAsJSONParams): twx.JSON;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Add multiple property definitions at once
        * 
        * **Params**:
        * * _ignoreInvalidDefinitions_: twx.BOOLEAN - True will skip over any invalid definitions provided, false indicates to fail the whole transaction when at least one invalid definition is found
        * * _values_: twx.INFOTABLE<twx.ds.PropertyDefinitionWithDetails> - Infotable where each row defines a property, using the PropertyDefinitionWithDetails data shape
        */
        AddPropertyDefinitions(params: GenericThing.AddPropertyDefinitionsParams): twx.INFOTABLE<twx.ds.BulkProcessingReport>;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Disable alert(s) for a property. Specify alertName for a specific property alert; otherwise, all alerts are disabled.
        * 
        * **Params**:
        * * _alertName_: twx.STRING - Alert name
        * * _property_: twx.STRING - Property name
        * * _persistent_: twx.BOOLEAN - Persist this change
        */
        DisableAlertsForProperty(params: GenericThing.DisableAlertsForPropertyParams): twx.NOTHING;

        /**
        * **Category**: Lifecycle
        * 
        * **Description**:  Get Enabled Status
        * 
        */
        IsEnabled(params: GenericThing.IsEnabledParams): twx.BOOLEAN;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Check to see if a thing implements a particular thing shape
        * 
        * **Params**:
        * * _thingShapeName_: twx.THINGSHAPENAME - Thing shape name
        */
        ImplementsShape(params: GenericThing.ImplementsShapeParams): twx.BOOLEAN;

        /**
        * **Category**: Properties
        * 
        * **Description**:  Get the current property values for this thing as VTQ
        * 
        */
        GetPropertyValuesVTQ(params: GenericThing.GetPropertyValuesVTQParams): twx.INFOTABLE;

        /**
        * **Category**: DataLogging
        * 
        * **Description**:  Set property logging status for a specific property
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        * * _enabled_: twx.BOOLEAN - Enable/disable logging
        */
        SetPropertyLogging(params: GenericThing.SetPropertyLoggingParams): twx.NOTHING;

        /**
        * **Category**: Queries
        * 
        * **Description**:  Get the difference between this entity and another
        * 
        * **Params**:
        * * _otherEntity_: twx.STRING - Entity to compare
        */
        GetDifferences(params: GenericThing.GetDifferencesParams): twx.INFOTABLE<twx.ds.Difference>;

        /**
        * **Category**: StreamEntries
        * 
        * **Description**:  Add a new stream entry
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        * * _value_: twx.LONG - Data value
        * * _timestamp_: twx.DATETIME - Event time (optional)
        */
        AddLongValueStreamEntry(params: GenericThing.AddLongValueStreamEntryParams): twx.NOTHING;

        /**
        * **Category**: Configuration
        * 
        * **Description**:  Adds a ConfigurationTableDefinition and creates and ConfigurationTable from the definition
        * 
        * **Params**:
        * * _isMultiRow_: twx.BOOLEAN - Controls whether the configuration table should accept tabular entry of data or key/value entry. When set to true, the fields in the data shape provided will be interpreted as column descriptors. When set to false or omitted, the fields are interpreted as row descriptors
        * * _name_: twx.STRING - The name of the configuration table. This name should be used when retrieving values from the configuration table during execution. Configuration tables must have unique names that obey standard ThingWorx entity naming conventions. It is strongly recommended that you always specify a non-empty configuration table name
        * * _description_: twx.STRING - A short description of the configuration table and its purpose
        * * _category_: twx.STRING - A category that conceptually groups together related configuration tables.
        * * _dataShapeName_: twx.DATASHAPENAME - This datashape will be used as the data shape for the Configuration table. Any changes to the datashape like adding or deleting fields will reflect on the configuration table.
        * * _ordinal_: twx.INTEGER - Controls the order in which the configuration tables should be rendered. Any non-negative integer is permitted, where lower values take higher precedence over larger values. If several tables share the same ordinal, then the order is non-deterministic
        * * _isHidden_: twx.BOOLEAN - Controls whether the configuration table should be hidden by Composer (e.g. if the configuration is for internal purposes only)
        */
        AddConfigurationTableDefinition(params: GenericThing.AddConfigurationTableDefinitionParams): twx.NOTHING;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Get a list of logged properties for this thing that are of a numeric data type
        * 
        */
        GetNumericLoggedProperties(params: GenericThing.GetNumericLoggedPropertiesParams): twx.INFOTABLE<twx.ds.PropertyDefinition>;

        /**
        * **Category**: Properties
        * 
        * **Description**:  Get a subset of the current property values for this thing
        * 
        * **Params**:
        * * _propertyNames_: twx.JSON - List of property names
        */
        GetNamedProperties(params: GenericThing.GetNamedPropertiesParams): twx.INFOTABLE;

        /**
        * **Category**: Bindings
        * 
        * **Description**:  Set the remote property binding for a property
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        * * _pushThreshold_: twx.NUMBER - Push threshold
        * * _aspects_: twx.JSON - Aspects for the remote binding
        * * _foldType_: twx.STRING - How a remote property's value should be handled by the server when a connection is lost
        * * _sourcePropertyName_: twx.STRING - Source property name
        * * _timeout_: twx.INTEGER - Request timeout
        * * _pushType_: twx.STRING - Push type
        * * _cacheTime_: twx.INTEGER - Property's cache time value at the server in milliseconds
        */
        SetRemotePropertyBinding(params: GenericThing.SetRemotePropertyBindingParams): twx.NOTHING;

        /**
        * **Category**: Lifecycle
        * 
        * **Description**:  Restart this thing
        * 
        */
        RestartThing(params: GenericThing.RestartThingParams): twx.NOTHING;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Get ann event definitions for this thing
        * 
        * **Params**:
        * * _name_: twx.STRING - Name
        */
        GetEventDefinition(params: GenericThing.GetEventDefinitionParams): twx.INFOTABLE<twx.ds.EventDefinition>;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Set a numeric alert parameter
        * 
        * **Params**:
        * * _alertName_: twx.STRING - Alert name
        * * _property_: twx.STRING - Property name
        * * _parameterName_: twx.STRING - Parameter name
        * * _persistent_: twx.BOOLEAN - Make it persistent
        * * _value_: twx.INTEGER - Parameter value
        */
        SetIntegerAlertParameter(params: GenericThing.SetIntegerAlertParameterParams): twx.NOTHING;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Add a property definition
        * 
        * **Params**:
        * * _defaultValue_: twx.STRING - Default value for property
        * * _remoteBindingAspects_: twx.JSON - Aspects for the remote binding
        * * _description_: twx.STRING - Property description
        * * _readOnly_: twx.BOOLEAN - Read only
        * * _type_: twx.BASETYPENAME - Data type
        * * _remote_: twx.BOOLEAN - Is a remote property
        * * _remotePropertyName_: twx.STRING - Remote property name
        * * _timeout_: twx.INTEGER - Request timeout
        * * _pushType_: twx.STRING - Push type
        * * _dataChangeThreshold_: twx.NUMBER - Data change threshold
        * * _logged_: twx.BOOLEAN - Log property value
        * * _name_: twx.STRING - Property name
        * * _pushThreshold_: twx.NUMBER - Push threshold
        * * _dataChangeType_: twx.STRING - Data change type
        * * _category_: twx.STRING - Category
        * * _persistent_: twx.BOOLEAN - Persist property value
        * * _dataShape_: twx.DATASHAPENAME - Data shape
        */
        AddPropertyDefinition(params: GenericThing.AddPropertyDefinitionParams): twx.NOTHING;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Get a date alert parameter
        * 
        * **Params**:
        * * _alertName_: twx.STRING - Alert name
        * * _property_: twx.STRING - Property name
        * * _parameterName_: twx.STRING - Parameter name
        */
        GetDateTimeAlertParameter(params: GenericThing.GetDateTimeAlertParameterParams): twx.DATETIME;

        /**
        * **Category**: Configuration
        * 
        * **Description**:  Set an entire configuration table
        * 
        * **Params**:
        * * _configurationTable_: twx.INFOTABLE - Configuration table content
        * * _persistent_: twx.BOOLEAN - Persist these changes
        * * _tableName_: twx.STRING - Configuration table name
        */
        SetConfigurationTable(params: GenericThing.SetConfigurationTableParams): twx.NOTHING;

        /**
        * **Category**: Networks
        * 
        * **Description**:  Check to see if a thing is in a specific network
        * 
        * **Params**:
        * * _network_: twx.STRING - Network name
        */
        IsInNetwork(params: GenericThing.IsInNetworkParams): twx.BOOLEAN;

        /**
        * **Category**: Subscriptions
        * 
        * **Description**:  Remove a dynamic subscription
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        * * _thingName_: twx.THINGNAME - Thing name
        * * _eventName_: twx.STRING - Event name
        * * _serviceName_: twx.STRING - Local service name
        */
        RemoveDynamicSubscription(params: GenericThing.RemoveDynamicSubscriptionParams): twx.NOTHING;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Remove tags from an entity
        * 
        * **Params**:
        * * _tags_: twx.TAGS - Tags to remove from the entity
        */
        RemoveTags(params: GenericThing.RemoveTagsParams): twx.NOTHING;

        /**
        * **Category**: Properties
        * 
        * **Description**:  Get the current property value
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        */
        GetNumberPropertyValue(params: GenericThing.GetNumberPropertyValueParams): twx.NUMBER;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Get avatar image
        * 
        */
        GetAvatar(params: GenericThing.GetAvatarParams): twx.IMAGE;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Get a list of logged properties for this thing
        * 
        * **Params**:
        * * _type_: twx.BASETYPENAME - Type to filter on
        */
        GetLoggedProperties(params: GenericThing.GetLoggedPropertiesParams): twx.INFOTABLE<twx.ds.PropertyDefinition>;

        /**
        * **Category**: Lifecycle
        * 
        * **Description**:  Enable this thing
        * 
        */
        EnableThing(params: GenericThing.EnableThingParams): twx.NOTHING;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Get a service definition for this thing
        * 
        * **Params**:
        * * _name_: twx.STRING - Name
        */
        GetServiceDefinition(params: GenericThing.GetServiceDefinitionParams): twx.INFOTABLE<twx.ds.ServiceDefinition>;

        /**
        * **Category**: Editing
        * 
        * **Description**:  Get the configuration change history
        * 
        */
        GetConfigurationChangeHistory(params: GenericThing.GetConfigurationChangeHistoryParams): twx.INFOTABLE<twx.ds.ConfigurationChange>;

        /**
        * **Category**: Properties
        * 
        * **Description**:  Get the current property value
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        */
        GetStringPropertyValue(params: GenericThing.GetStringPropertyValueParams): twx.STRING;

        /**
        * **Category**: Permissions
        * 
        * **Description**:  Delete a run time permission
        * 
        * **Params**:
        * * _principal_: twx.STRING - Principal name (name of user or group)
        * * _resource_: twx.STRING - Resource name
        * * _type_: twx.STRING - Permission type
        * * _principalType_: twx.STRING - Principal type (User or Group)
        */
        DeleteRunTimePermission(params: GenericThing.DeleteRunTimePermissionParams): twx.NOTHING;

        /**
        * **Category**: Configuration
        * 
        * **Description**:  Get a specific configuration table row as an InfoTable
        * 
        * **Params**:
        * * _key_: twx.STRING - Row key value
        * * _tableName_: twx.STRING - Configuration table name
        */
        GetConfigurationTableRow(params: GenericThing.GetConfigurationTableRowParams): twx.INFOTABLE;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Get the instance metadata in JSON format
        * 
        */
        GetInstanceMetadataAsJSON(params: GenericThing.GetInstanceMetadataAsJSONParams): twx.JSON;

        /**
        * **Category**: Configuration
        * 
        * **Description**:  Save any changes to configuration tables
        * 
        */
        SaveConfigurationTables(params: GenericThing.SaveConfigurationTablesParams): twx.NOTHING;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Acknowledge an active alert
        * 
        * **Params**:
        * * _property_: twx.STRING - Property name
        * * _message_: twx.STRING - Message (optional)
        */
        AcknowledgeAlert(params: GenericThing.AcknowledgeAlertParams): twx.NOTHING;

        /**
        * **Category**: Queries
        * 
        * **Description**:  Query stream entries, along with filter and sort criteria
        * 
        * **Params**:
        * * _oldestFirst_: twx.BOOLEAN - Search/sort from oldest to newest
        * * _maxItems_: twx.NUMBER - Maximum number of items to return
        * * _propertyName_: twx.STRING - Property name
        * * _endDate_: twx.DATETIME - End time
        * * _query_: twx.QUERY - Query definition
        * * _startDate_: twx.DATETIME - Start time
        */
        QueryLocationPropertyHistory(params: GenericThing.QueryLocationPropertyHistoryParams): twx.INFOTABLE<twx.ds.LocationValueStream>;

        /**
        * **Category**: Bindings
        * 
        * **Description**:  Set the remote service binding for a service
        * 
        * **Params**:
        * * _sourceServiceName_: twx.STRING - Source service name
        * * _serviceName_: twx.STRING - Service name
        * * _timeout_: twx.INTEGER - Request timeout
        */
        SetRemoteServiceBinding(params: GenericThing.SetRemoteServiceBindingParams): twx.NOTHING;

        /**
        * **Category**: Queries
        * 
        * **Description**:  Query stream entries, along with filter and sort criteria
        * 
        * **Params**:
        * * _oldestFirst_: twx.BOOLEAN - Search/sort from oldest to newest
        * * _maxItems_: twx.NUMBER - Maximum number of items to return
        * * _propertyName_: twx.STRING - Property name
        * * _endDate_: twx.DATETIME - End time
        * * _query_: twx.QUERY - Query definition
        * * _startDate_: twx.DATETIME - Start time
        */
        QueryVec4PropertyHistory(params: GenericThing.QueryVec4PropertyHistoryParams): twx.INFOTABLE<twx.ds.Vec4DataShape>;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Check to see if a thing is derived from a particular thing template
        * 
        * **Params**:
        * * _thingTemplateName_: twx.THINGTEMPLATENAME - Thing template name
        */
        IsDerivedFromTemplate(params: GenericThing.IsDerivedFromTemplateParams): twx.BOOLEAN;

        /**
        * **Category**: Data
        * 
        * **Description**:  Store properties of this thing to a stream
        * 
        * **Params**:
        * * _name_: twx.THINGNAME - Stream name
        * * _tags_: twx.TAGS - Tags
        */
        WritePropertiesToStream(params: GenericThing.WritePropertiesToStreamParams): twx.NOTHING;

        /**
        * **Category**: Relationships
        * 
        * **Description**:  Return a list of all the things referenced by this thing
        * 
        * **Params**:
        * * _maxDepth_: twx.INTEGER - Maximum depth to search
        */
        GetThingRelationships(params: GenericThing.GetThingRelationshipsParams): twx.INFOTABLE<twx.ds.ThingRelationship>;

        /**
        * **Category**: Configuration
        * 
        * **Description**:  Get a list of configuration tables
        * 
        */
        GetConfigurationTables(params: GenericThing.GetConfigurationTablesParams): twx.INFOTABLE<twx.ds.EntityList>;

        /**
        * **Category**: StreamEntries
        * 
        * **Description**:  Add a new stream entry
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        * * _value_: twx.VEC4 - Data value
        * * _timestamp_: twx.DATETIME - Event time (optional)
        */
        AddVec4ValueStreamEntry(params: GenericThing.AddVec4ValueStreamEntryParams): twx.NOTHING;

        /**
        * **Category**: StreamEntries
        * 
        * **Description**:  Add a new stream entry
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        * * _value_: twx.DATETIME - Data value
        * * _timestamp_: twx.DATETIME - Event time (optional)
        */
        AddDateTimeValueStreamEntry(params: GenericThing.AddDateTimeValueStreamEntryParams): twx.NOTHING;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Get the current service definitions for this thing
        * 
        * **Params**:
        * * _category_: twx.STRING - Category to filter on
        * * _type_: twx.BASETYPENAME - Type to filter on
        * * _dataShape_: twx.DATASHAPENAME - Data shape to filter on if InfoTable base type
        */
        GetServiceDefinitions(params: GenericThing.GetServiceDefinitionsParams): twx.INFOTABLE<twx.ds.ServiceDefinition>;

        /**
        * **Category**: Maintenance
        * 
        * **Description**:  Purge all value stream entries for a specified date range for a given list of properties
        * 
        * **Params**:
        * * _propertiesToPurge_: twx.INFOTABLE<twx.ds.PropertyList> - Properties to purge
        * * _endDate_: twx.DATETIME - End time
        * * _startDate_: twx.DATETIME - Start time
        */
        PurgeSelectedPropertyHistory(params: GenericThing.PurgeSelectedPropertyHistoryParams): twx.NOTHING;

        /**
        * **Category**: Mashups
        * 
        * **Description**:  Set home mashup
        * 
        * **Params**:
        * * _name_: twx.MASHUPNAME - Home mashup name
        */
        SetHomeMashup(params: GenericThing.SetHomeMashupParams): twx.NOTHING;

        /**
        * **Category**: Permissions
        * 
        * **Description**:  Assign an owner to this entity
        * 
        * **Params**:
        * * _name_: twx.USERNAME - User name
        */
        SetOwner(params: GenericThing.SetOwnerParams): twx.NOTHING;

        /**
        * **Category**: Queries
        * 
        * **Description**:  Query stream entries, along with filter and sort criteria
        * 
        * **Params**:
        * * _oldestFirst_: twx.BOOLEAN - Search/sort from oldest to newest
        * * _maxItems_: twx.NUMBER - Maximum number of items to return
        * * _propertyName_: twx.STRING - Property name
        * * _endDate_: twx.DATETIME - End time
        * * _query_: twx.QUERY - Query definition
        * * _startDate_: twx.DATETIME - Start time
        */
        QueryNumberPropertyHistory(params: GenericThing.QueryNumberPropertyHistoryParams): twx.INFOTABLE<twx.ds.NumberValueStream>;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Set a numeric alert parameter
        * 
        * **Params**:
        * * _alertName_: twx.STRING - Alert name
        * * _property_: twx.STRING - Property name
        * * _parameterName_: twx.STRING - Parameter name
        * * _persistent_: twx.BOOLEAN - Make it persistent
        * * _value_: twx.NUMBER - Parameter value
        */
        SetNumberAlertParameter(params: GenericThing.SetNumberAlertParameterParams): twx.NOTHING;

        /**
        * **Category**: Mashups
        * 
        * **Description**:  Get home mashup
        * 
        */
        GetHomeMashup(params: GenericThing.GetHomeMashupParams): twx.MASHUPNAME;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Get the tags for an entity
        * 
        */
        GetTags(params: GenericThing.GetTagsParams): twx.TAGS;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Get the Status of the given Alert
        * 
        * **Params**:
        * * _alertName_: twx.STRING - Alert name
        * * _property_: twx.STRING - Property name
        */
        GetAlertStatus(params: GenericThing.GetAlertStatusParams): twx.STRING;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Set a boolean alert parameter
        * 
        * **Params**:
        * * _alertName_: twx.STRING - Alert name
        * * _property_: twx.STRING - Property name
        * * _parameterName_: twx.STRING - Parameter name
        * * _persistent_: twx.BOOLEAN - Make it persistent
        * * _value_: twx.BOOLEAN - Parameter value
        */
        SetBooleanAlertParameter(params: GenericThing.SetBooleanAlertParameterParams): twx.NOTHING;

        /**
        * **Category**: Networks
        * 
        * **Description**:  Get the networks associated with a thing
        * 
        */
        GetNetworks(params: GenericThing.GetNetworksParams): twx.INFOTABLE<twx.ds.EntityList>;

        /**
        * **Category**: Configuration
        * 
        * **Description**:  Delete an entire configuration table
        * 
        * **Params**:
        * * _persistent_: twx.BOOLEAN - Persist these changes
        * * _tableName_: twx.STRING - Configuration table name
        */
        DeleteConfigurationTable(params: GenericThing.DeleteConfigurationTableParams): twx.NOTHING;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Get the tags for an entity as an InfoTable
        * 
        */
        GetTagsAsInfoTable(params: GenericThing.GetTagsAsInfoTableParams): twx.INFOTABLE<twx.ds.VocabularyTermList>;

        /**
        * **Category**: Permissions
        * 
        * **Description**:  Get current user permissions
        * 
        * **Params**:
        * * _name_: twx.STRING - Target name (or wildcard)
        * * _permissionName_: twx.STRING - Permission name
        */
        GetPermissionsForCurrentUser(params: GenericThing.GetPermissionsForCurrentUserParams): twx.INFOTABLE<twx.ds.UserPermissions>;

        /**
        * **Category**: Queries
        * 
        * **Description**:  Query stream entries (without data), along with filter and sort criteria
        * 
        * **Params**:
        * * _oldestFirst_: twx.BOOLEAN - Search/sort from oldest to newest
        * * _maxItems_: twx.NUMBER - Maximum number of items to return
        * * _endDate_: twx.DATETIME - End time
        * * _query_: twx.QUERY - Query definition
        * * _startDate_: twx.DATETIME - Start time
        */
        QueryPropertyHistory(params: GenericThing.QueryPropertyHistoryParams): twx.INFOTABLE;

        /**
        * **Category**: Permissions
        * 
        * **Description**:  Check to see if an entity has a specific design time permission for the current user
        * 
        * **Params**:
        * * _type_: twx.STRING - Permission type
        */
        CheckDesignTimePermission(params: GenericThing.CheckDesignTimePermissionParams): twx.BOOLEAN;

        /**
        * **Category**: Configuration
        * 
        * **Description**:  Get a specific configuration table definition as an InfoTable
        * 
        * **Params**:
        * * _tableName_: twx.STRING - Configuration table name
        */
        GetConfigurationTableDefinition(params: GenericThing.GetConfigurationTableDefinitionParams): twx.INFOTABLE;

        /**
        * **Category**: Bindings
        * 
        * **Description**:  Remove the local property binding for a property
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        */
        RemoveLocalPropertyBinding(params: GenericThing.RemoveLocalPropertyBindingParams): twx.NOTHING;

        /**
        * **Category**: Properties
        * 
        * **Description**:  Get the current property value
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        */
        GetVec2PropertyValue(params: GenericThing.GetVec2PropertyValueParams): twx.VEC2;

        /**
        * **Category**: Queries
        * 
        * **Description**:  Query stream entries, along with filter and sort criteria
        * 
        * **Params**:
        * * _oldestFirst_: twx.BOOLEAN - Search/sort from oldest to newest
        * * _maxItems_: twx.NUMBER - Maximum number of items to return
        * * _propertyName_: twx.STRING - Property name
        * * _endDate_: twx.DATETIME - End time
        * * _query_: twx.QUERY - Query definition
        * * _startDate_: twx.DATETIME - Start time
        */
        QueryLongPropertyHistory(params: GenericThing.QueryLongPropertyHistoryParams): twx.INFOTABLE<twx.ds.LongValueStream>;

        /**
        * **Category**: Permissions
        * 
        * **Description**:  Set a list of assigned design time permissions
        * 
        * **Params**:
        * * _permissions_: twx.JSON - Permissions in JSON format
        */
        SetDesignTimePermissionsAsJSON(params: GenericThing.SetDesignTimePermissionsAsJSONParams): twx.NOTHING;

        /**
        * **Category**: Dependencies
        * 
        * **Description**:  Has outgoing dependencies
        * 
        */
        HasOutgoingDependencies(params: GenericThing.HasOutgoingDependenciesParams): twx.BOOLEAN;

        /**
        * **Category**: Bindings
        * 
        * **Description**:  Get the remote event binding for a event
        * 
        * **Params**:
        * * _eventName_: twx.STRING - Event name
        */
        GetRemoteEventBinding(params: GenericThing.GetRemoteEventBindingParams): twx.INFOTABLE<twx.ds.RemoteEventBinding>;

        /**
        * **Category**: Permissions
        * 
        * **Description**:  Get group permissions
        * 
        * **Params**:
        * * _name_: twx.STRING - Target name (or wildcard)
        * * _group_: twx.STRING - Group name
        * * _permissionName_: twx.STRING - Permission name
        */
        GetPermissionsForGroup(params: GenericThing.GetPermissionsForGroupParams): twx.INFOTABLE<twx.ds.UserPermissions>;

        /**
        * **Category**: StreamEntries
        * 
        * **Description**:  Add a new stream entry
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        * * _value_: twx.INTEGER - Data value
        * * _timestamp_: twx.DATETIME - Event time (optional)
        */
        AddIntegerValueStreamEntry(params: GenericThing.AddIntegerValueStreamEntryParams): twx.NOTHING;

        /**
        * **Category**: Bindings
        * 
        * **Description**:  Get the remote property binding for a property
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        */
        GetRemotePropertyBinding(params: GenericThing.GetRemotePropertyBindingParams): twx.INFOTABLE<twx.ds.RemotePropertyBinding>;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Get the metadata in JSON format
        * 
        */
        GetMetadataWithPermissionsAsJSON(params: GenericThing.GetMetadataWithPermissionsAsJSONParams): twx.JSON;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Overwrite/set the tags for an entity
        * 
        * **Params**:
        * * _tags_: twx.TAGS - Tags for an entity
        */
        SetTags(params: GenericThing.SetTagsParams): twx.NOTHING;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Get the metadata in InfoTable format
        * 
        */
        GetMetadata(params: GenericThing.GetMetadataParams): twx.INFOTABLE;

        /**
        * **Category**: Dependencies
        * 
        * **Description**:  Get the incoming dependencies
        * 
        * **Params**:
        * * _maxItems_: twx.NUMBER - Maximum number of items to return
        */
        GetIncomingDependencies(params: GenericThing.GetIncomingDependenciesParams): twx.INFOTABLE<twx.ds.EntityDescriptor>;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Get the locally implemented thing shapes for this thing
        * 
        */
        GetLocallyImplementedShapes(params: GenericThing.GetLocallyImplementedShapesParams): twx.INFOTABLE<twx.ds.EntityList>;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Promote an overridden alert to the nearest parent in its heirarchy that defines it.  Currently only Anomaly type Alerts are supported.
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        * * _alertName_: twx.STRING - Alert name
        */
        PromoteAlert(params: GenericThing.PromoteAlertParams): twx.NOTHING;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Append additional tags to an entity
        * 
        * **Params**:
        * * _tags_: twx.TAGS - Tags for an entity
        */
        AddTags(params: GenericThing.AddTagsParams): twx.NOTHING;

        /**
        * **Category**: Permissions
        * 
        * **Description**:  Get user permissions
        * 
        * **Params**:
        * * _name_: twx.STRING - Target name (or wildcard)
        * * _user_: twx.STRING - User name
        * * _permissionName_: twx.STRING - Permission name
        */
        GetPermissionsForUser(params: GenericThing.GetPermissionsForUserParams): twx.INFOTABLE<twx.ds.UserPermissions>;

        /**
        * **Category**: StreamEntries
        * 
        * **Description**:  Add a new stream entry
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        * * _value_: twx.BOOLEAN - Data value
        * * _timestamp_: twx.DATETIME - Event time (optional)
        */
        AddBooleanValueStreamEntry(params: GenericThing.AddBooleanValueStreamEntryParams): twx.NOTHING;

        /**
        * **Category**: Properties
        * 
        * **Description**:  Get a subset of the current property values for this thing
        * 
        * **Params**:
        * * _propertyNames_: twx.INFOTABLE<twx.ds.EntityList> - Property names
        */
        GetNamedPropertyValues(params: GenericThing.GetNamedPropertyValuesParams): twx.INFOTABLE;

        /**
        * **Category**: Permissions
        * 
        * **Description**:  Get a list of assigned designtime permissions
        * 
        */
        GetDesignTimePermissionsAsJSON(params: GenericThing.GetDesignTimePermissionsAsJSONParams): twx.JSON;

        /**
        * **Category**: Permissions
        * 
        * **Description**:  Check to see if an entity has a specific run time permission for a specific group
        * 
        * **Params**:
        * * _name_: twx.STRING - Name of the resource (i.e. property, service, event) to check
        * * _type_: twx.STRING - Permission type
        * * _group_: twx.GROUPNAME - Group name
        */
        CheckPermissionForGroup(params: GenericThing.CheckPermissionForGroupParams): twx.BOOLEAN;

        /**
        * **Category**: Identifier
        * 
        * **Description**:  Set the identifier for a thing
        * 
        * **Params**:
        * * _identifier_: twx.STRING - Thing identifier for remote things
        */
        SetIdentifier(params: GenericThing.SetIdentifierParams): twx.NOTHING;

        /**
        * **Category**: Properties
        * 
        * **Description**:  Get the current property value
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        */
        GetDateTimePropertyValue(params: GenericThing.GetDateTimePropertyValueParams): twx.DATETIME;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Get Training Statistics for given Alert
        * 
        * **Params**:
        * * _alertName_: twx.STRING - Alert name
        * * _property_: twx.STRING - Property name
        */
        GetAnomalyAlertTrainingStatisticsForAlert(params: GenericThing.GetAnomalyAlertTrainingStatisticsForAlertParams): twx.INFOTABLE<twx.ds.AnomalyAlertTrainingStatistics>;

        /**
        * **Category**: Subscriptions
        * 
        * **Description**:  Disable Subscription
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        * * _thingName_: twx.THINGNAME - Thing name
        * * _eventName_: twx.STRING - Event name
        */
        DisableSubscription(params: GenericThing.DisableSubscriptionParams): twx.NOTHING;

        /**
        * **Category**: Properties
        * 
        * **Description**:  Has any property changed since a given time
        * 
        * **Params**:
        * * _timestamp_: twx.DATETIME - Timestamp to compare
        */
        HavePropertiesChangedSince(params: GenericThing.HavePropertiesChangedSinceParams): twx.BOOLEAN;

        /**
        * **Category**: Identifier
        * 
        * **Description**:  Get the identifier for a thing
        * 
        */
        GetIdentifier(params: GenericThing.GetIdentifierParams): twx.STRING;

        /**
        * **Category**: Queries
        * 
        * **Description**:  Query stream entries, along with filter and sort criteria
        * 
        * **Params**:
        * * _oldestFirst_: twx.BOOLEAN - Search/sort from oldest to newest
        * * _maxItems_: twx.NUMBER - Maximum number of items to return
        * * _propertyName_: twx.STRING - Property name
        * * _endDate_: twx.DATETIME - End time
        * * _query_: twx.QUERY - Query definition
        * * _startDate_: twx.DATETIME - Start time
        */
        QueryImagePropertyHistory(params: GenericThing.QueryImagePropertyHistoryParams): twx.INFOTABLE<twx.ds.ImageValueStream>;

        /**
        * **Category**: Permissions
        * 
        * **Description**:  Set a list of assigned visibility permissions
        * 
        * **Params**:
        * * _permissions_: twx.JSON - Permissions in JSON format
        */
        SetVisibilityPermissionsAsJSON(params: GenericThing.SetVisibilityPermissionsAsJSONParams): twx.NOTHING;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Get alert definition for a property
        * 
        * **Params**:
        * * _alertName_: twx.STRING - Alert name
        * * _property_: twx.STRING - Property name
        */
        GetAlertDefinition(params: GenericThing.GetAlertDefinitionParams): twx.INFOTABLE<twx.ds.AlertDefinition>;

        /**
        * **Category**: Permissions
        * 
        * **Description**:  Add a visibility permission
        * 
        * **Params**:
        * * _principal_: twx.STRING - Principal name (name of organization or organization unit)
        * * _principalType_: twx.STRING - Principal type (Organization or Organization Unit)
        */
        AddVisibilityPermission(params: GenericThing.AddVisibilityPermissionParams): twx.NOTHING;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Remove an alert for a property
        * 
        * **Params**:
        * * _alertName_: twx.STRING - Alert name
        * * _property_: twx.STRING - Property name
        * * _persistent_: twx.BOOLEAN - Persist this change
        */
        RemoveAlert(params: GenericThing.RemoveAlertParams): twx.NOTHING;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Get a location alert parameter
        * 
        * **Params**:
        * * _alertName_: twx.STRING - Alert name
        * * _property_: twx.STRING - Property name
        * * _parameterName_: twx.STRING - Parameter name
        */
        GetLocationAlertParameter(params: GenericThing.GetLocationAlertParameterParams): twx.LOCATION;

        /**
        * **Category**: Mashups
        * 
        * **Description**:  Get the mashups related to this thing
        * 
        */
        GetMashups(params: GenericThing.GetMashupsParams): twx.INFOTABLE<twx.ds.MashupList>;

        /**
        * **Category**: Permissions
        * 
        * **Description**:  Get a list of assigned runtime permissions
        * 
        */
        GetRunTimePermissionsAsJSON(params: GenericThing.GetRunTimePermissionsAsJSONParams): twx.JSON;

        /**
        * **Category**: Subscriptions
        * 
        * **Description**:  Add a dynamic subscription
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        * * _thingName_: twx.THINGNAME - Thing name
        * * _eventName_: twx.STRING - Event name
        * * _serviceName_: twx.STRING - Local service name
        */
        AddDynamicSubscription(params: GenericThing.AddDynamicSubscriptionParams): twx.NOTHING;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Get a numeric alert parameter
        * 
        * **Params**:
        * * _alertName_: twx.STRING - Alert name
        * * _property_: twx.STRING - Property name
        * * _parameterName_: twx.STRING - Parameter name
        */
        GetIntegerAlertParameter(params: GenericThing.GetIntegerAlertParameterParams): twx.INTEGER;

        /**
        * **Category**: Bindings
        * 
        * **Description**:  Get incoming local bindings to this thing for the given property
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        */
        GetIncomingLocalPropertyBinding(params: GenericThing.GetIncomingLocalPropertyBindingParams): twx.INFOTABLE<twx.ds.IncomingLocalPropertyBinding>;

        /**
        * **Category**: DataLogging
        * 
        * **Description**:  Set the value stream for a thing
        * 
        * **Params**:
        * * _name_: twx.THINGNAME - Value stream name
        */
        SetValueStream(params: GenericThing.SetValueStreamParams): twx.NOTHING;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Remove a service definition
        * 
        * **Params**:
        * * _name_: twx.STRING - Service name
        */
        RemoveServiceDefinition(params: GenericThing.RemoveServiceDefinitionParams): twx.NOTHING;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Get a long alert parameter
        * 
        * **Params**:
        * * _alertName_: twx.STRING - Alert name
        * * _property_: twx.STRING - Property name
        * * _parameterName_: twx.STRING - Parameter name
        */
        GetLongAlertParameter(params: GenericThing.GetLongAlertParameterParams): twx.LONG;

        /**
        * **Category**: StreamEntries
        * 
        * **Description**:  Add a new stream entry
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        * * _value_: twx.STRING - Data value
        * * _timestamp_: twx.DATETIME - Event time (optional)
        */
        AddStringValueStreamEntry(params: GenericThing.AddStringValueStreamEntryParams): twx.NOTHING;

        /**
        * **Category**: Properties
        * 
        * **Description**:  Get the current property values for this thing
        * 
        */
        GetPropertyValues(params: GenericThing.GetPropertyValuesParams): twx.INFOTABLE;

        /**
        * **Category**: Bindings
        * 
        * **Description**:  Get the property binding for a property
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        */
        GetLocalPropertyBinding(params: GenericThing.GetLocalPropertyBindingParams): twx.INFOTABLE<twx.ds.LocalPropertyBinding>;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Get alert summary status
        * 
        * **Params**:
        * * _maxItems_: twx.NUMBER - Maximum number of items to return
        * * _onlyUnacknowledged_: twx.BOOLEAN - Show only unacknowledged alerts
        * * _onlyAcknowledged_: twx.BOOLEAN - Show only acknowledged alerts
        */
        GetAlertSummary(params: GenericThing.GetAlertSummaryParams): twx.INFOTABLE<twx.ds.AlertSummary>;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Query the alert summary
        * 
        * **Params**:
        * * _maxItems_: twx.NUMBER - Maximum number of items to return
        * * _query_: twx.QUERY - Query definition
        * * _onlyUnacknowledged_: twx.BOOLEAN - Show only unacknowledged alerts
        * * _onlyAcknowledged_: twx.BOOLEAN - Show only acknowledged alerts
        */
        QueryAlertSummary(params: GenericThing.QueryAlertSummaryParams): twx.INFOTABLE<twx.ds.AlertSummary>;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Set a location alert parameter
        * 
        * **Params**:
        * * _alertName_: twx.STRING - Alert name
        * * _property_: twx.STRING - Property name
        * * _parameterName_: twx.STRING - Parameter name
        * * _persistent_: twx.BOOLEAN - Make it persistent
        * * _value_: twx.LOCATION - Parameter value
        */
        SetLocationAlertParameter(params: GenericThing.SetLocationAlertParameterParams): twx.NOTHING;

        /**
        * **Category**: Properties
        * 
        * **Description**:  Get the current property value
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        */
        GetLongPropertyValue(params: GenericThing.GetLongPropertyValueParams): twx.LONG;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Get the current event definitions for this thing
        * 
        * **Params**:
        * * _category_: twx.STRING - Category to filter on
        * * _dataShape_: twx.DATASHAPENAME - Data shape to filter on if InfoTable base type
        */
        GetEventDefinitions(params: GenericThing.GetEventDefinitionsParams): twx.INFOTABLE<twx.ds.EventDefinition>;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Get the thing template for this thing
        * 
        */
        GetThingTemplate(params: GenericThing.GetThingTemplateParams): twx.INFOTABLE<twx.ds.EntityList>;

        /**
        * **Category**: Queries
        * 
        * **Description**:  Query stream entries (without data), along with filter and sort criteria
        * 
        * **Params**:
        * * _oldestFirst_: twx.BOOLEAN - Search/sort from oldest to newest
        * * _maxItems_: twx.NUMBER - Maximum number of items to return
        * * _endDate_: twx.DATETIME - End time
        * * _propertyNames_: twx.INFOTABLE<twx.ds.EntityList> - Property names
        * * _query_: twx.QUERY - Query definition
        * * _startDate_: twx.DATETIME - Start time
        */
        QueryNamedPropertyHistory(params: GenericThing.QueryNamedPropertyHistoryParams): twx.INFOTABLE;

        /**
        * **Category**: Properties
        * 
        * **Description**:  Get a subset of the current property values for this thing
        * 
        * **Params**:
        * * _values_: twx.INFOTABLE - Property values
        */
        SetPropertyValues(params: GenericThing.SetPropertyValuesParams): twx.NOTHING;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Get AnomalyAlert Training Statistics for given Property
        * 
        * **Params**:
        * * _property_: twx.STRING - Property name
        */
        GetAnomalyAlertTrainingStatisticsForProperty(params: GenericThing.GetAnomalyAlertTrainingStatisticsForPropertyParams): twx.INFOTABLE<twx.ds.AnomalyAlertTrainingStatistics>;

        /**
        * **Category**: Queries
        * 
        * **Description**:  Query stream entries, along with filter and sort criteria
        * 
        * **Params**:
        * * _oldestFirst_: twx.BOOLEAN - Search/sort from oldest to newest
        * * _maxItems_: twx.NUMBER - Maximum number of items to return
        * * _propertyName_: twx.STRING - Property name
        * * _endDate_: twx.DATETIME - End time
        * * _query_: twx.QUERY - Query definition
        * * _startDate_: twx.DATETIME - Start time
        */
        QueryIntegerPropertyHistory(params: GenericThing.QueryIntegerPropertyHistoryParams): twx.INFOTABLE<twx.ds.IntegerValueStream>;

        /**
        * **Category**: Lifecycle
        * 
        * **Description**:  Disable this thing
        * 
        */
        DisableThing(params: GenericThing.DisableThingParams): twx.NOTHING;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Get the current property definitions for this thing
        * 
        * **Params**:
        * * _name_: twx.STRING - Name
        */
        GetPropertyDefinition(params: GenericThing.GetPropertyDefinitionParams): twx.INFOTABLE<twx.ds.PropertyDefinition>;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Get alert summary for a property
        * 
        * **Params**:
        * * _maxItems_: twx.NUMBER - Maximum number of items to return
        * * _onlyUnacknowledged_: twx.BOOLEAN - Show only unacknowledged alerts
        * * _property_: twx.STRING - Property name
        * * _onlyAcknowledged_: twx.BOOLEAN - Show only acknowledged alerts
        */
        GetAlertSummaryForProperty(params: GenericThing.GetAlertSummaryForPropertyParams): twx.INFOTABLE<twx.ds.PropertyAlertSummary>;

        /**
        * **Category**: StreamEntries
        * 
        * **Description**:  Add a new stream entry
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        * * _value_: twx.THINGCODE - Data value
        * * _timestamp_: twx.DATETIME - Event time (optional)
        */
        AddThingCodeValueStreamEntry(params: GenericThing.AddThingCodeValueStreamEntryParams): twx.NOTHING;

        /**
        * **Category**: Properties
        * 
        * **Description**:  Get the timestamp for a specific property
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        */
        GetPropertyTime(params: GenericThing.GetPropertyTimeParams): twx.DATETIME;

        /**
        * **Category**: Bindings
        * 
        * **Description**:  Get all things and their properties that have local bindings on this thing
        * 
        */
        GetIncomingLocalPropertyBindings(params: GenericThing.GetIncomingLocalPropertyBindingsParams): twx.INFOTABLE<twx.ds.IncomingLocalPropertyBinding>;

        /**
        * **Category**: StreamEntries
        * 
        * **Description**:  Add a new stream entry
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        * * _value_: twx.VEC2 - Data value
        * * _timestamp_: twx.DATETIME - Event time (optional)
        */
        AddVec2ValueStreamEntry(params: GenericThing.AddVec2ValueStreamEntryParams): twx.NOTHING;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Get avatar image url
        * 
        */
        GetAvatarURL(params: GenericThing.GetAvatarURLParams): twx.IMAGELINK;

        /**
        * **Category**: StreamEntries
        * 
        * **Description**:  Add a new stream entry
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        * * _value_: twx.IMAGE - Data value
        * * _timestamp_: twx.DATETIME - Event time (optional)
        */
        AddImageValueStreamEntry(params: GenericThing.AddImageValueStreamEntryParams): twx.NOTHING;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Get the current property definitions for this thing
        * 
        * **Params**:
        * * _category_: twx.STRING - Category to filter on
        * * _type_: twx.BASETYPENAME - Type to filter on
        * * _dataShape_: twx.DATASHAPENAME - Data shape to filter on if InfoTable base type
        */
        GetPropertyDefinitions(params: GenericThing.GetPropertyDefinitionsParams): twx.INFOTABLE<twx.ds.PropertyDefinition>;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Get summary information
        * 
        */
        GetSummaryInformation(params: GenericThing.GetSummaryInformationParams): twx.INFOTABLE<twx.ds.EntitySummary>;

        /**
        * **Category**: Queries
        * 
        * **Description**:  Query stream entries, along with filter and sort criteria
        * 
        * **Params**:
        * * _oldestFirst_: twx.BOOLEAN - Search/sort from oldest to newest
        * * _maxItems_: twx.NUMBER - Maximum number of items to return
        * * _propertyName_: twx.STRING - Property name
        * * _endDate_: twx.DATETIME - End time
        * * _query_: twx.QUERY - Query definition
        * * _startDate_: twx.DATETIME - Start time
        */
        QueryThingCodePropertyHistory(params: GenericThing.QueryThingCodePropertyHistoryParams): twx.INFOTABLE<twx.ds.ThingCodeDataShape>;

        /**
        * **Category**: Bindings
        * 
        * **Description**:  Remove the remote event binding for a event
        * 
        * **Params**:
        * * _eventName_: twx.STRING - Event name
        */
        RemoveRemoteEventBinding(params: GenericThing.RemoveRemoteEventBindingParams): twx.NOTHING;

        /**
        * **Category**: Dependencies
        * 
        * **Description**:  Get the outgoing dependencies as a network
        * 
        * **Params**:
        * * _maxDepth_: twx.NUMBER - Maximum depth to traverse
        * * _maxItems_: twx.NUMBER - Maximum number of items to return
        */
        GetOutgoingDependenciesAsNetwork(params: GenericThing.GetOutgoingDependenciesAsNetworkParams): twx.INFOTABLE<twx.ds.EntityNetwork>;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Get local alert definitions for a property
        * 
        * **Params**:
        * * _property_: twx.STRING - Property name
        */
        GetLocalAlertDefinitions(params: GenericThing.GetLocalAlertDefinitionsParams): twx.INFOTABLE<twx.ds.AlertDefinition>;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Get the Statuses of the given Alerts
        * 
        * **Params**:
        * * _property_: twx.STRING - Property name
        */
        GetAlertStatusesForProperty(params: GenericThing.GetAlertStatusesForPropertyParams): twx.INFOTABLE;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Get a numeric alert parameter
        * 
        * **Params**:
        * * _alertName_: twx.STRING - Alert name
        * * _property_: twx.STRING - Property name
        * * _parameterName_: twx.STRING - Parameter name
        */
        GetNumberAlertParameter(params: GenericThing.GetNumberAlertParameterParams): twx.NUMBER;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Get All AnomalyAlert Training Statistics on this Thing
        * 
        */
        GetAllAnomalyAlertTrainingStatistics(params: GenericThing.GetAllAnomalyAlertTrainingStatisticsParams): twx.INFOTABLE<twx.ds.AnomalyAlertTrainingStatistics>;

        /**
        * **Category**: Properties
        * 
        * **Description**:  Get the quality for a specific property
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        */
        GetPropertyQuality(params: GenericThing.GetPropertyQualityParams): twx.STRING;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Get the instance metadata in JSON format
        * 
        */
        GetInstanceMetadataWithPermissionsAsJSON(params: GenericThing.GetInstanceMetadataWithPermissionsAsJSONParams): twx.JSON;

        /**
        * **Category**: Permissions
        * 
        * **Description**:  Get a list of assigned visibility permissions
        * 
        */
        GetVisibilityPermissionsAsJSON(params: GenericThing.GetVisibilityPermissionsAsJSONParams): twx.JSON;

        /**
        * **Category**: Dependencies
        * 
        * **Description**:  Get the incoming dependencies as a network
        * 
        * **Params**:
        * * _maxDepth_: twx.NUMBER - Maximum depth to traverse
        * * _maxItems_: twx.NUMBER - Maximum number of items to return
        */
        GetIncomingDependenciesAsNetwork(params: GenericThing.GetIncomingDependenciesAsNetworkParams): twx.INFOTABLE<twx.ds.EntityNetwork>;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Check to see if an alert is defined for a property
        * 
        * **Params**:
        * * _alertName_: twx.STRING - Alert name
        * * _property_: twx.STRING - Property name
        */
        HasAlert(params: GenericThing.HasAlertParams): twx.BOOLEAN;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Remove a event definition
        * 
        * **Params**:
        * * _name_: twx.STRING - Event name
        */
        RemoveEventDefinition(params: GenericThing.RemoveEventDefinitionParams): twx.NOTHING;

        /**
        * **Category**: Permissions
        * 
        * **Description**:  Set a list of assigned runtime permissions
        * 
        * **Params**:
        * * _permissions_: twx.JSON - Permissions in JSON format
        */
        SetRunTimePermissionsAsJSON(params: GenericThing.SetRunTimePermissionsAsJSONParams): twx.NOTHING;

        /**
        * **Category**: Subscriptions
        * 
        * **Description**:  Enable Subscription
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        * * _thingName_: twx.THINGNAME - Thing name
        * * _eventName_: twx.STRING - Event name
        */
        EnableSubscription(params: GenericThing.EnableSubscriptionParams): twx.NOTHING;

        /**
        * **Category**: Editing
        * 
        * **Description**:  Get the date edit was last modified
        * 
        */
        GetLastModifiedDate(params: GenericThing.GetLastModifiedDateParams): twx.DATETIME;

        /**
        * **Category**: Queries
        * 
        * **Description**:  Query stream entries, along with filter and sort criteria
        * 
        * **Params**:
        * * _oldestFirst_: twx.BOOLEAN - Search/sort from oldest to newest
        * * _maxItems_: twx.NUMBER - Maximum number of items to return
        * * _propertyName_: twx.STRING - Property name
        * * _endDate_: twx.DATETIME - End time
        * * _query_: twx.QUERY - Query definition
        * * _startDate_: twx.DATETIME - Start time
        */
        QueryDateTimePropertyHistory(params: GenericThing.QueryDateTimePropertyHistoryParams): twx.INFOTABLE<twx.ds.DateTimeValueStream>;

        /**
        * **Category**: Bindings
        * 
        * **Description**:  Set the remote event binding for a event
        * 
        * **Params**:
        * * _sourceEventName_: twx.STRING - Source event name
        * * _eventName_: twx.STRING - Event name
        */
        SetRemoteEventBinding(params: GenericThing.SetRemoteEventBindingParams): twx.NOTHING;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Enable alert(s) for a property. Specify alertName for a specific property alert; otherwise, all alerts are enabled.
        * 
        * **Params**:
        * * _alertName_: twx.STRING - Alert name
        * * _property_: twx.STRING - Property name
        * * _persistent_: twx.BOOLEAN - Persist this change
        */
        EnableAlertsForProperty(params: GenericThing.EnableAlertsForPropertyParams): twx.NOTHING;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Get a string alert parameter
        * 
        * **Params**:
        * * _alertName_: twx.STRING - Alert name
        * * _property_: twx.STRING - Property name
        * * _parameterName_: twx.STRING - Parameter name
        */
        GetStringAlertParameter(params: GenericThing.GetStringAlertParameterParams): twx.STRING;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Remove a property definition
        * 
        * **Params**:
        * * _name_: twx.STRING - Property name
        */
        RemovePropertyDefinition(params: GenericThing.RemovePropertyDefinitionParams): twx.NOTHING;

        /**
        * **Category**: Configuration
        * 
        * **Description**:  Delete one or more rows from a multi-row configuration table
        * 
        * **Params**:
        * * _values_: twx.INFOTABLE - Configuration table rows to modify
        * * _persistent_: twx.BOOLEAN - Persist these changes
        * * _tableName_: twx.STRING - Configuration table name
        */
        DeleteConfigurationTableRows(params: GenericThing.DeleteConfigurationTableRowsParams): twx.NOTHING;

        /**
        * **Category**: Configuration
        * 
        * **Description**:  Update/add one or more rows in a multi-row configuration table
        * 
        * **Params**:
        * * _values_: twx.INFOTABLE - Configuration table rows to modify
        * * _persistent_: twx.BOOLEAN - Persist these changes
        * * _tableName_: twx.STRING - Configuration table name
        */
        SetConfigurationTableRows(params: GenericThing.SetConfigurationTableRowsParams): twx.NOTHING;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Set a string alert parameter
        * 
        * **Params**:
        * * _alertName_: twx.STRING - Alert name
        * * _property_: twx.STRING - Property name
        * * _parameterName_: twx.STRING - Parameter name
        * * _persistent_: twx.BOOLEAN - Make it persistent
        * * _value_: twx.STRING - Parameter value
        */
        SetStringAlertParameter(params: GenericThing.SetStringAlertParameterParams): twx.NOTHING;

        /**
        * **Category**: Permissions
        * 
        * **Description**:  Add a design time permission
        * 
        * **Params**:
        * * _principal_: twx.STRING - Principal name (name of user or group)
        * * _allow_: twx.BOOLEAN - Permission (true = allow, false = deny)
        * * _type_: twx.STRING - Permission type (Create, Read, Update, Delete)
        * * _principalType_: twx.STRING - Principal type (User or Group)
        */
        AddDesignTimePermission(params: GenericThing.AddDesignTimePermissionParams): twx.NOTHING;

        /**
        * **Category**: Permissions
        * 
        * **Description**:  Check to see if an entity has a specific run time permission for the current user
        * 
        * **Params**:
        * * _name_: twx.STRING - Name of the resource (i.e. property, service, event) to check
        * * _type_: twx.STRING - Permission type
        */
        CheckPermission(params: GenericThing.CheckPermissionParams): twx.BOOLEAN;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Set a date alert parameter
        * 
        * **Params**:
        * * _alertName_: twx.STRING - Alert name
        * * _property_: twx.STRING - Property name
        * * _parameterName_: twx.STRING - Parameter name
        * * _persistent_: twx.BOOLEAN - Make it persistent
        * * _value_: twx.DATETIME - Parameter value
        */
        SetDateTimeAlertParameter(params: GenericThing.SetDateTimeAlertParameterParams): twx.NOTHING;

        /**
        * **Category**: Bindings
        * 
        * **Description**:  Get the effective local property bindings
        * 
        */
        GetEffectiveLocalPropertyBindings(params: GenericThing.GetEffectiveLocalPropertyBindingsParams): twx.INFOTABLE<twx.ds.LocalPropertyBinding>;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Get a boolean alert parameter
        * 
        * **Params**:
        * * _alertName_: twx.STRING - Alert name
        * * _property_: twx.STRING - Property name
        * * _parameterName_: twx.STRING - Parameter name
        */
        GetBooleanAlertParameter(params: GenericThing.GetBooleanAlertParameterParams): twx.BOOLEAN;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Get the description for an entity
        * 
        */
        GetDescription(params: GenericThing.GetDescriptionParams): twx.STRING;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Disable all alerts for a thing
        * 
        * **Params**:
        * * _persistent_: twx.BOOLEAN - Persist this change
        */
        DisableAllAlerts(params: GenericThing.DisableAllAlertsParams): twx.NOTHING;

        /**
        * **Category**: Properties
        * 
        * **Description**:  Get the current property value
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        */
        GetLocationPropertyValue(params: GenericThing.GetLocationPropertyValueParams): twx.LOCATION;

        /**
        * **Category**: Properties
        * 
        * **Description**:  Get the current property values for this thing as VTQ
        * 
        * **Params**:
        * * _propertyNames_: twx.INFOTABLE<twx.ds.EntityList> - Property names
        */
        GetNamedPropertyValuesVTQ(params: GenericThing.GetNamedPropertyValuesVTQParams): twx.INFOTABLE;

        /**
        * **Category**: Dependencies
        * 
        * **Description**:  Has incoming dependencies
        * 
        */
        HasIncomingDependencies(params: GenericThing.HasIncomingDependenciesParams): twx.BOOLEAN;

        /**
        * **Category**: Properties
        * 
        * **Description**:  Get a subset of the current property values (VTQ) and the highest alert for this thing
        * 
        * **Params**:
        * * _propertyNames_: twx.INFOTABLE<twx.ds.EntityList> - Property names
        */
        GetNamedPropertyValuesVTQA(params: GenericThing.GetNamedPropertyValuesVTQAParams): twx.INFOTABLE;

        /**
        * **Category**: StreamEntries
        * 
        * **Description**:  Add a new stream entry
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        * * _value_: twx.INFOTABLE - Data value
        * * _timestamp_: twx.DATETIME - Event time (optional)
        */
        AddInfoTableValueStreamEntry(params: GenericThing.AddInfoTableValueStreamEntryParams): twx.NOTHING;

        /**
        * **Category**: Properties
        * 
        * **Description**:  Get the current property value
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        */
        GetVec4PropertyValue(params: GenericThing.GetVec4PropertyValueParams): twx.VEC4;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Set the avatar icon for the entity
        * 
        * **Params**:
        * * _content_: twx.IMAGE - Base 64 Encoded Content
        */
        SetAvatar(params: GenericThing.SetAvatarParams): twx.NOTHING;

        /**
        * **Category**: Queries
        * 
        * **Description**:  Query stream entries, along with filter and sort criteria
        * 
        * **Params**:
        * * _oldestFirst_: twx.BOOLEAN - Search/sort from oldest to newest
        * * _maxItems_: twx.NUMBER - Maximum number of items to return
        * * _propertyName_: twx.STRING - Property name
        * * _endDate_: twx.DATETIME - End time
        * * _query_: twx.QUERY - Query definition
        * * _startDate_: twx.DATETIME - Start time
        */
        QueryInfoTablePropertyHistory(params: GenericThing.QueryInfoTablePropertyHistoryParams): twx.INFOTABLE<twx.ds.InfoTableValueStream>;

        /**
        * **Category**: Projects
        * 
        * **Description**:  Set the project name of this entity
        * 
        * **Params**:
        * * _projectName_: twx.PROJECTNAME - Project name
        */
        SetProjectName(params: GenericThing.SetProjectNameParams): twx.NOTHING;

        /**
        * **Category**: Alerts
        * 
        * **Description**:  Retrain an Anomaly Alert
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        * * _alertName_: twx.STRING - Alert name
        */
        RetrainAlert(params: GenericThing.RetrainAlertParams): twx.NOTHING;

        /**
        * **Category**: DataLogging
        * 
        * **Description**:  Get property logging status for a specific property
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        */
        GetPropertyLogging(params: GenericThing.GetPropertyLoggingParams): twx.BOOLEAN;

        /**
        * **Category**: Queries
        * 
        * **Description**:  Query stream entries, along with filter and sort criteria
        * 
        * **Params**:
        * * _oldestFirst_: twx.BOOLEAN - Search/sort from oldest to newest
        * * _maxItems_: twx.NUMBER - Maximum number of items to return
        * * _propertyName_: twx.STRING - Property name
        * * _endDate_: twx.DATETIME - End time
        * * _query_: twx.QUERY - Query definition
        * * _startDate_: twx.DATETIME - Start time
        */
        QueryVec3PropertyHistory(params: GenericThing.QueryVec3PropertyHistoryParams): twx.INFOTABLE<twx.ds.Vec3DataShape>;

        /**
        * **Category**: Metadata
        * 
        * **Description**:  Overwrite/set the description for an entity
        * 
        * **Params**:
        * * _description_: twx.STRING - Description for an entity
        */
        SetDescription(params: GenericThing.SetDescriptionParams): twx.NOTHING;

        /**
        * **Category**: Configuration
        * 
        * **Description**:  Get a specific configuration table as an InfoTable
        * 
        * **Params**:
        * * _tableName_: twx.STRING - Configuration table name
        */
        GetConfigurationTable(params: GenericThing.GetConfigurationTableParams): twx.INFOTABLE;

        /**
        * **Category**: Permissions
        * 
        * **Description**:  Delete a design time permission
        * 
        * **Params**:
        * * _principal_: twx.STRING - Principal name (name of user or group)
        * * _type_: twx.STRING - Permission type
        * * _principalType_: twx.STRING - Principal type (User or Group)
        */
        DeleteDesignTimePermission(params: GenericThing.DeleteDesignTimePermissionParams): twx.NOTHING;

        /**
        * **Category**: Bindings
        * 
        * **Description**:  Get the remote service binding for a service
        * 
        * **Params**:
        * * _serviceName_: twx.STRING - Service name
        */
        GetRemoteServiceBinding(params: GenericThing.GetRemoteServiceBindingParams): twx.INFOTABLE<twx.ds.RemoteServiceBinding>;

        /**
        * **Category**: Maintenance
        * 
        * **Description**:  Purge stream entries for a specified date range
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        * * _endDate_: twx.DATETIME - End time
        * * _immediate_: twx.BOOLEAN - Delete immediately
        * * _startDate_: twx.DATETIME - Start time
        */
        PurgePropertyHistory(params: GenericThing.PurgePropertyHistoryParams): twx.NOTHING;

        /**
        * **Category**: Properties
        * 
        * **Description**:  Get the current property values (VTQ) and the highest alert for this thing
        * 
        */
        GetPropertyValuesVTQA(params: GenericThing.GetPropertyValuesVTQAParams): twx.INFOTABLE;

        /**
        * **Category**: Permissions
        * 
        * **Description**:  Delete a visibility permission
        * 
        * **Params**:
        * * _principal_: twx.STRING - Principal name (name of organization or organization unit)
        * * _principalType_: twx.STRING - Principal type (Organization or Organization Unit)
        */
        DeleteVisibilityPermission(params: GenericThing.DeleteVisibilityPermissionParams): twx.NOTHING;

        /**
        * **Category**: Properties
        * 
        * **Description**:  Get the current property value
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        */
        GetIntegerPropertyValue(params: GenericThing.GetIntegerPropertyValueParams): twx.INTEGER;

        /**
        * **Category**: Bindings
        * 
        * **Description**:  Get the effective local property binding for a property
        * 
        * **Params**:
        * * _propertyName_: twx.STRING - Property name
        */
        GetEffectiveLocalPropertyBinding(params: GenericThing.GetEffectiveLocalPropertyBindingParams): twx.INFOTABLE<twx.ds.LocalPropertyBinding>;

        /**
        * **Category**: Properties
        * 
        * **Description**:  Get the current property values for this thing
        * 
        */
        GetPropertyValuesAsMultiRowTable(params: GenericThing.GetPropertyValuesAsMultiRowTableParams): twx.INFOTABLE;

        /**
        * Thing name
        */
        readonly name = "GenericThing";

        /**
        * Thing description
        */
        readonly description = "";

        /**
        * Thing Template
        */
        readonly thingTemplate = "GenericThing";

        /**
        * Thing Tags
        */
        tags: twx.TAGS;
    }
}
