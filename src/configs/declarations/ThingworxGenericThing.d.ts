declare namespace twx {
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
         * Collection of properties to be updated 
         * Datashape: NamedVTQ 
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
         * Service parameters 
         * Datashape: FieldDefinition 
         */
        parameters?: twx.INFOTABLE<twx.ds.FieldDefinition>;
        /**
         * Service result type 
         * Datashape: FieldDefinition 
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
         * Infotable where each row defines a property, using the PropertyDefinitionWithDetails data shape 
         * Datashape: PropertyDefinitionWithDetails 
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
         * Properties to purge 
         * Datashape: PropertyList 
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
         * Property names 
         * Datashape: EntityList 
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
         * Property names 
         * Datashape: EntityList 
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
         * Property names 
         * Datashape: EntityList 
         */
        propertyNames?: twx.INFOTABLE<twx.ds.EntityList>;
    }
    export interface GetNamedPropertyValuesVTQAParams {
        /**
         * Property names 
         * Datashape: EntityList 
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
    export class GenericThing {
        constructor();
        /**
         * Category: Bindings 
         * Set the property binding for a property
         * Params:
         *	propertyName: twx.STRING  - Property name
        *	aspects: twx.JSON  - Aspects for the local binding
        *	sourceThingName: twx.STRING  - Thing name to bind to
        *	sourcePropertyName: twx.STRING  - Source property name
        **/
        SetLocalPropertyBinding(params: SetLocalPropertyBindingParams): twx.NOTHING;
        /**
         * Category: Properties 
         * Get the current property value
         * Params:
         *	propertyName: twx.STRING  - Property name
        **/
        GetBooleanPropertyValue(params: GetBooleanPropertyValueParams): twx.BOOLEAN;
        /**
         * Category: DataLogging 
         * Get the identifier for a thing
         * 
         **/
        GetValueStream(): twx.THINGNAME;
        /**
         * Category: Configuration 
         * Set an entire multi-row configuration table
         * Params:
         *	configurationTable: twx.INFOTABLE  - Configuration table content
        *	persistent: twx.BOOLEAN  - Persist these changes
        *	tableName: twx.STRING  - Configuration table name
        **/
        SetMultiRowConfigurationTable(params: SetMultiRowConfigurationTableParams): twx.NOTHING;
        /**
         * Category: Permissions 
         * Get a list of assigned design time permissions
         * 
         **/
        GetDesignTimePermissions(): twx.INFOTABLE<twx.ds.Permissions>;
        /**
         * Category: StreamEntries 
         * Add a new stream entry
         * Params:
         *	propertyName: twx.STRING  - Property name
        *	value: twx.NUMBER  - Data value
        *	timestamp: twx.DATETIME  - Event time (optional)
        **/
        AddNumberValueStreamEntry(params: AddNumberValueStreamEntryParams): twx.NOTHING;
        /**
         * Category: Queries 
         * Query stream entries, along with filter and sort criteria
         * Params:
         *	oldestFirst: twx.BOOLEAN  - Search/sort from oldest to newest
        *	maxItems: twx.NUMBER  - Maximum number of items to return
        *	propertyName: twx.STRING  - Property name
        *	endDate: twx.DATETIME  - End time
        *	query: twx.QUERY  - Query definition
        *	startDate: twx.DATETIME  - Start time
        **/
        QueryVec2PropertyHistory(params: QueryVec2PropertyHistoryParams): twx.INFOTABLE<twx.ds.Vec2DataShape>;
        /**
         * Category: Metadata 
         * Add or update an event definition
         * Params:
         *	remoteEventName: twx.STRING  - Remote event name
        *	name: twx.STRING  - Property name
        *	description: twx.STRING  - Property description
        *	category: twx.STRING  - Category
        *	remote: twx.BOOLEAN  - Is a remote service
        *	dataShape: twx.DATASHAPENAME  - Data shape
        **/
        AddEventDefinition(params: AddEventDefinitionParams): twx.NOTHING;
        /**
         * Category: Maintenance 
         * Purge all value stream entries for a specified date range
         * Params:
         *	endDate: twx.DATETIME  - End time
        *	startDate: twx.DATETIME  - Start time
        **/
        PurgeAllPropertyHistory(params: PurgeAllPropertyHistoryParams): twx.NOTHING;
        /**
         * Category: Permissions 
         * Get a list of assigned visibility permissions
         * 
         **/
        GetVisibilityPermissions(): twx.INFOTABLE<twx.ds.Permissions>;
        /**
         * Category: StreamEntries 
         * Add a new stream entry
         * Params:
         *	propertyName: twx.STRING  - Property name
        *	value: twx.LOCATION  - Data value
        *	timestamp: twx.DATETIME  - Event time (optional)
        **/
        AddLocationValueStreamEntry(params: AddLocationValueStreamEntryParams): twx.NOTHING;
        /**
         * Category: StreamEntries 
         * Add a new stream entry
         * Params:
         *	propertyName: twx.STRING  - Property name
        *	value: twx.VEC3  - Data value
        *	timestamp: twx.DATETIME  - Event time (optional)
        **/
        AddVec3ValueStreamEntry(params: AddVec3ValueStreamEntryParams): twx.NOTHING;
        /**
         * Category: Permissions 
         * Get a list of assigned runtime permissions
         * 
         **/
        GetRunTimePermissions(): twx.INFOTABLE<twx.ds.Permissions>;
        /**
         * Category: Properties 
         * Get the current property value
         * Params:
         *	propertyName: twx.STRING  - Property name
        **/
        GetVec3PropertyValue(params: GetVec3PropertyValueParams): twx.VEC3;
        /**
         * Category: Metadata 
         * Get the metadata in JSON format
         * 
         **/
        GetMetadataAsJSON(): twx.JSON;
        /**
         * Category: Bindings 
         * Remove the remote service binding for a service
         * Params:
         *	serviceName: twx.STRING  - Service name
        **/
        RemoveRemoteServiceBinding(params: RemoveRemoteServiceBindingParams): twx.NOTHING;
        /**
         * Category: Metadata 
         * Get thing summary information
         * 
         **/
        GetThingSummaryInformation(): twx.INFOTABLE<twx.ds.Thing>;
        /**
         * Category: Alerts 
         * Get effective alert definitions for a property
         * Params:
         *	property: twx.STRING  - Property name
        **/
        GetAlertDefinitions(params: GetAlertDefinitionsParams): twx.INFOTABLE<twx.ds.AlertDefinition>;
        /**
         * Category: Permissions 
         * Check to see if an entity has a specific run time permission for a specific user
         * Params:
         *	name: twx.STRING  - Name of the resource (i.e. property, service, event) to check
        *	type: twx.STRING  - Permission type
        *	user: twx.USERNAME  - User name
        **/
        CheckPermissionForUser(params: CheckPermissionForUserParams): twx.BOOLEAN;
        /**
         * Category: Alerts 
         * Acknowledge all active alerts
         * Params:
         *	message: twx.STRING  - Message (optional)
        **/
        AcknowledgeAllAlerts(params: AcknowledgeAllAlertsParams): twx.NOTHING;
        /**
         * Category: Federation 
         * Set this as a published thing for federation
         * Params:
         *	publish: twx.BOOLEAN  - Publish status (true/false)
        **/
        SetPublished(params: SetPublishedParams): twx.NOTHING;
        /**
         * Category: Properties 
         * Get the current property value
         * Params:
         *	propertyName: twx.STRING  - Property name
        **/
        GetImagePropertyValue(params: GetImagePropertyValueParams): twx.IMAGE;
        /**
         * Category: Dependencies 
         * Get the outgoing dependencies
         * Params:
         *	maxItems: twx.NUMBER  - Maximum number of items to return
        **/
        GetOutgoingDependencies(params: GetOutgoingDependenciesParams): twx.INFOTABLE<twx.ds.EntityDescriptor>;
        /**
         * Category: Queries 
         * Query stream entries, along with filter and sort criteria
         * Params:
         *	oldestFirst: twx.BOOLEAN  - Search/sort from oldest to newest
        *	maxItems: twx.NUMBER  - Maximum number of items to return
        *	propertyName: twx.STRING  - Property name
        *	endDate: twx.DATETIME  - End time
        *	query: twx.QUERY  - Query definition
        *	startDate: twx.DATETIME  - Start time
        **/
        QueryStringPropertyHistory(params: QueryStringPropertyHistoryParams): twx.INFOTABLE<twx.ds.StringValueStream>;
        /**
         * Category: Alerts 
         * Get the Statuses of the given Alerts
         * 
         **/
        GetAlertStatuses(): twx.INFOTABLE<twx.ds.AlertStatus>;
        /**
         * Category: Federation 
         * Get published thing for federation
         * 
         **/
        GetPublished(): twx.BOOLEAN;
        /**
         * Category: Alerts 
         * Enable all alerts for a thing
         * Params:
         *	persistent: twx.BOOLEAN  - Persist this change
        **/
        EnableAllAlerts(params: EnableAllAlertsParams): twx.NOTHING;
        /**
         * Category: Queries 
         * Query stream entries, along with filter and sort criteria
         * Params:
         *	oldestFirst: twx.BOOLEAN  - Search/sort from oldest to newest
        *	maxItems: twx.NUMBER  - Maximum number of items to return
        *	propertyName: twx.STRING  - Property name
        *	endDate: twx.DATETIME  - End time
        *	query: twx.QUERY  - Query definition
        *	startDate: twx.DATETIME  - Start time
        **/
        QueryBooleanPropertyHistory(params: QueryBooleanPropertyHistoryParams): twx.INFOTABLE<twx.ds.BooleanValueStream>;
        /**
         * Category: Permissions 
         * Add a run time permission
         * Params:
         *	principal: twx.STRING  - Principal name (name of user or group)
        *	allow: twx.BOOLEAN  - Permission (true = allow, false = deny)
        *	resource: twx.STRING  - Resource name (* = all or enter a specific resource (i.e. Service, Property, Event) to override)
        *	type: twx.STRING  - Permission type (PropertyRead PropertyWrite ServiceInvoke EventInvoke EventSubscribe)
        *	principalType: twx.STRING  - Principal type (User or Group)
        **/
        AddRunTimePermission(params: AddRunTimePermissionParams): twx.NOTHING;
        /**
         * Category: Configuration 
         * Check if a configuration table is a multi-row table
         * Params:
         *	tableName: twx.STRING  - Configuration table name
        **/
        IsMultiRowTable(params: IsMultiRowTableParams): twx.BOOLEAN;
        /**
         * Category: Bindings 
         * Remove the remote property binding for a property
         * Params:
         *	propertyName: twx.STRING  - Property name
        **/
        RemoveRemotePropertyBinding(params: RemoveRemotePropertyBindingParams): twx.NOTHING;
        /**
         * Category: DataLogging 
         * Get the logging status of a specific property from the effective Thing shape
         * Params:
         *	propertyName: twx.STRING  - Property name to look up on the effective shape for its logging status
        **/
        GetEffectivePropertyLogging(params: GetEffectivePropertyLoggingParams): twx.BOOLEAN;
        /**
         * Category: Projects 
         * Get the project name of this entity
         * 
         **/
        GetProjectName(): twx.STRING;
        /**
         * Category: Properties 
         * Get the current property value
         * Params:
         *	propertyName: twx.STRING  - Property name
        **/
        GetThingCodePropertyValue(params: GetThingCodePropertyValueParams): twx.THINGCODE;
        /**
         * Category: Properties 
         * Write property values for a thing
         * Params:
         *	values: twx.INFOTABLE<twx.ds.NamedVTQ>  with datashape NamedVTQ - Collection of properties to be updated
        **/
        UpdatePropertyValues(params: UpdatePropertyValuesParams): twx.NOTHING;
        /**
         * Category: Metadata 
         * Get the implemented thing shapes for this thing
         * 
         **/
        GetImplementedShapes(): twx.INFOTABLE<twx.ds.EntityList>;
        /**
         * Category: Configuration 
         * Delete all rows from a multi-row configuration table
         * Params:
         *	persistent: twx.BOOLEAN  - Persist these changes
        *	tableName: twx.STRING  - Configuration table name
        **/
        DeleteAllConfigurationTableRows(params: DeleteAllConfigurationTableRowsParams): twx.NOTHING;
        /**
         * Category: Metadata 
         * Add or update a service definition
         * Params:
         *	name: twx.STRING  - Property name
        *	description: twx.STRING  - Property description
        *	remoteServiceName: twx.STRING  - Remote service name
        *	category: twx.STRING  - Category
        *	remote: twx.BOOLEAN  - Is a remote service
        *	parameters: twx.INFOTABLE<twx.ds.FieldDefinition>  with datashape FieldDefinition - Service parameters
        *	resultType: twx.INFOTABLE<twx.ds.FieldDefinition>  with datashape FieldDefinition - Service result type
        *	timeout: twx.INTEGER  - Request timeout
        **/
        AddServiceDefinition(params: AddServiceDefinitionParams): twx.NOTHING;
        /**
         * Category: Permissions 
         * Check to see if an entity has a specific design time permission for a specific group
         * Params:
         *	type: twx.STRING  - Permission type
        *	group: twx.GROUPNAME  - Group name
        **/
        CheckDesignTimePermissionForGroup(params: CheckDesignTimePermissionForGroupParams): twx.BOOLEAN;
        /**
         * Category: Alerts 
         * Add or update an alert for a property
         * Params:
         *	alertType: twx.STRING  - Alert type
        *	alertName: twx.STRING  - Alert name
        *	property: twx.STRING  - Property name
        *	description: twx.STRING  - Alert description
        *	attributes: twx.INFOTABLE  - Alert attributes
        *	priority: twx.INTEGER  - Alert priority
        *	persistent: twx.BOOLEAN  - Persist this change
        *	enabled: twx.BOOLEAN  - Alert enabled
        **/
        AddOrUpdateAlert(params: AddOrUpdateAlertParams): twx.NOTHING;
        /**
         * Category: Alerts 
         * Query the alert history
         * Params:
         *	oldestFirst: twx.BOOLEAN  - Search/sort from oldest to newest
        *	maxItems: twx.NUMBER  - Maximum number of items to return
        *	endDate: twx.DATETIME  - End time
        *	query: twx.QUERY  - Query definition
        *	startDate: twx.DATETIME  - Start time
        **/
        QueryAlertHistory(params: QueryAlertHistoryParams): twx.INFOTABLE<twx.ds.AlertHistory>;
        /**
         * Category: Permissions 
         * Check to see if an entity has a specific design time permission for a specific user
         * Params:
         *	type: twx.STRING  - Permission type
        *	user: twx.USERNAME  - User name
        **/
        CheckDesignTimePermissionForUser(params: CheckDesignTimePermissionForUserParams): twx.BOOLEAN;
        /**
         * Category: Queries 
         * Get the difference between this entity and another
         * Params:
         *	otherEntity: twx.STRING  - Entity to compare
        **/
        GetDifferencesAsJSON(params: GetDifferencesAsJSONParams): twx.JSON;
        /**
         * Category: Metadata 
         * Add multiple property definitions at once
         * Params:
         *	ignoreInvalidDefinitions: twx.BOOLEAN  - True will skip over any invalid definitions provided, false indicates to fail the whole transaction when at least one invalid definition is found
        *	values: twx.INFOTABLE<twx.ds.PropertyDefinitionWithDetails>  with datashape PropertyDefinitionWithDetails - Infotable where each row defines a property, using the PropertyDefinitionWithDetails data shape
        **/
        AddPropertyDefinitions(params: AddPropertyDefinitionsParams): twx.INFOTABLE<twx.ds.BulkProcessingReport>;
        /**
         * Category: Alerts 
         * Disable alert(s) for a property. Specify alertName for a specific property alert; otherwise, all alerts are disabled.
         * Params:
         *	alertName: twx.STRING  - Alert name
        *	property: twx.STRING  - Property name
        *	persistent: twx.BOOLEAN  - Persist this change
        **/
        DisableAlertsForProperty(params: DisableAlertsForPropertyParams): twx.NOTHING;
        /**
         * Category: Lifecycle 
         * Get Enabled Status
         * 
         **/
        IsEnabled(): twx.BOOLEAN;
        /**
         * Category: Metadata 
         * Check to see if a thing implements a particular thing shape
         * Params:
         *	thingShapeName: twx.THINGSHAPENAME  - Thing shape name
        **/
        ImplementsShape(params: ImplementsShapeParams): twx.BOOLEAN;
        /**
         * Category: Properties 
         * Get the current property values for this thing as VTQ
         * 
         **/
        GetPropertyValuesVTQ(): twx.INFOTABLE;
        /**
         * Category: DataLogging 
         * Set property logging status for a specific property
         * Params:
         *	propertyName: twx.STRING  - Property name
        *	enabled: twx.BOOLEAN  - Enable/disable logging
        **/
        SetPropertyLogging(params: SetPropertyLoggingParams): twx.NOTHING;
        /**
         * Category: Queries 
         * Get the difference between this entity and another
         * Params:
         *	otherEntity: twx.STRING  - Entity to compare
        **/
        GetDifferences(params: GetDifferencesParams): twx.INFOTABLE<twx.ds.Difference>;
        /**
         * Category: StreamEntries 
         * Add a new stream entry
         * Params:
         *	propertyName: twx.STRING  - Property name
        *	value: twx.LONG  - Data value
        *	timestamp: twx.DATETIME  - Event time (optional)
        **/
        AddLongValueStreamEntry(params: AddLongValueStreamEntryParams): twx.NOTHING;
        /**
         * Category: Configuration 
         * Adds a ConfigurationTableDefinition and creates and ConfigurationTable from the definition
         * Params:
         *	isMultiRow: twx.BOOLEAN  - Controls whether the configuration table should accept tabular entry of data or key/value entry. When set to true, the fields in the data shape provided will be interpreted as column descriptors. When set to false or omitted, the fields are interpreted as row descriptors
        *	name: twx.STRING  - The name of the configuration table. This name should be used when retrieving values from the configuration table during execution. Configuration tables must have unique names that obey standard ThingWorx entity naming conventions. It is strongly recommended that you always specify a non-empty configuration table name
        *	description: twx.STRING  - A short description of the configuration table and its purpose
        *	category: twx.STRING  - A category that conceptually groups together related configuration tables.
        *	dataShapeName: twx.DATASHAPENAME  - This datashape will be used as the data shape for the Configuration table. Any changes to the datashape like adding or deleting fields will reflect on the configuration table.
        *	ordinal: twx.INTEGER  - Controls the order in which the configuration tables should be rendered. Any non-negative integer is permitted, where lower values take higher precedence over larger values. If several tables share the same ordinal, then the order is non-deterministic
        *	isHidden: twx.BOOLEAN  - Controls whether the configuration table should be hidden by Composer (e.g. if the configuration is for internal purposes only) 
        **/
        AddConfigurationTableDefinition(params: AddConfigurationTableDefinitionParams): twx.NOTHING;
        /**
         * Category: Metadata 
         * Get a list of logged properties for this thing that are of a numeric data type
         * 
         **/
        GetNumericLoggedProperties(): twx.INFOTABLE<twx.ds.PropertyDefinition>;
        /**
         * Category: Properties 
         * Get a subset of the current property values for this thing
         * Params:
         *	propertyNames: twx.JSON  - List of property names
        **/
        GetNamedProperties(params: GetNamedPropertiesParams): twx.INFOTABLE;
        /**
         * Category: Bindings 
         * Set the remote property binding for a property
         * Params:
         *	propertyName: twx.STRING  - Property name
        *	pushThreshold: twx.NUMBER  - Push threshold
        *	aspects: twx.JSON  - Aspects for the remote binding
        *	foldType: twx.STRING  - How a remote property's value should be handled by the server when a connection is lost
        *	sourcePropertyName: twx.STRING  - Source property name
        *	timeout: twx.INTEGER  - Request timeout
        *	pushType: twx.STRING  - Push type
        *	cacheTime: twx.INTEGER  - Property's cache time value at the server in milliseconds
        **/
        SetRemotePropertyBinding(params: SetRemotePropertyBindingParams): twx.NOTHING;
        /**
         * Category: Lifecycle 
         * Restart this thing
         * 
         **/
        RestartThing(): twx.NOTHING;
        /**
         * Category: Metadata 
         * Get ann event definitions for this thing
         * Params:
         *	name: twx.STRING  - Name
        **/
        GetEventDefinition(params: GetEventDefinitionParams): twx.INFOTABLE<twx.ds.EventDefinition>;
        /**
         * Category: Alerts 
         * Set a numeric alert parameter
         * Params:
         *	alertName: twx.STRING  - Alert name
        *	property: twx.STRING  - Property name
        *	parameterName: twx.STRING  - Parameter name
        *	persistent: twx.BOOLEAN  - Make it persistent
        *	value: twx.INTEGER  - Parameter value
        **/
        SetIntegerAlertParameter(params: SetIntegerAlertParameterParams): twx.NOTHING;
        /**
         * Category: Metadata 
         * Add a property definition
         * Params:
         *	defaultValue: twx.STRING  - Default value for property
        *	remoteBindingAspects: twx.JSON  - Aspects for the remote binding
        *	description: twx.STRING  - Property description
        *	readOnly: twx.BOOLEAN  - Read only
        *	type: twx.BASETYPENAME  - Data type
        *	remote: twx.BOOLEAN  - Is a remote property
        *	remotePropertyName: twx.STRING  - Remote property name
        *	timeout: twx.INTEGER  - Request timeout
        *	pushType: twx.STRING  - Push type
        *	dataChangeThreshold: twx.NUMBER  - Data change threshold
        *	logged: twx.BOOLEAN  - Log property value
        *	name: twx.STRING  - Property name
        *	pushThreshold: twx.NUMBER  - Push threshold
        *	dataChangeType: twx.STRING  - Data change type
        *	category: twx.STRING  - Category
        *	persistent: twx.BOOLEAN  - Persist property value
        *	dataShape: twx.DATASHAPENAME  - Data shape
        **/
        AddPropertyDefinition(params: AddPropertyDefinitionParams): twx.NOTHING;
        /**
         * Category: Alerts 
         * Get a date alert parameter
         * Params:
         *	alertName: twx.STRING  - Alert name
        *	property: twx.STRING  - Property name
        *	parameterName: twx.STRING  - Parameter name
        **/
        GetDateTimeAlertParameter(params: GetDateTimeAlertParameterParams): twx.DATETIME;
        /**
         * Category: Configuration 
         * Set an entire configuration table
         * Params:
         *	configurationTable: twx.INFOTABLE  - Configuration table content
        *	persistent: twx.BOOLEAN  - Persist these changes
        *	tableName: twx.STRING  - Configuration table name
        **/
        SetConfigurationTable(params: SetConfigurationTableParams): twx.NOTHING;
        /**
         * Category: Networks 
         * Check to see if a thing is in a specific network
         * Params:
         *	network: twx.STRING  - Network name
        **/
        IsInNetwork(params: IsInNetworkParams): twx.BOOLEAN;
        /**
         * Category: Subscriptions 
         * Remove a dynamic subscription
         * Params:
         *	propertyName: twx.STRING  - Property name
        *	thingName: twx.THINGNAME  - Thing name
        *	eventName: twx.STRING  - Event name
        *	serviceName: twx.STRING  - Local service name
        **/
        RemoveDynamicSubscription(params: RemoveDynamicSubscriptionParams): twx.NOTHING;
        /**
         * Category: Metadata 
         * Remove tags from an entity
         * Params:
         *	tags: twx.TAGS  - Tags to remove from the entity
        **/
        RemoveTags(params: RemoveTagsParams): twx.NOTHING;
        /**
         * Category: Properties 
         * Get the current property value
         * Params:
         *	propertyName: twx.STRING  - Property name
        **/
        GetNumberPropertyValue(params: GetNumberPropertyValueParams): twx.NUMBER;
        /**
         * Category: Metadata 
         * Get a list of logged properties for this thing
         * Params:
         *	type: twx.BASETYPENAME  - Type to filter on
        **/
        GetLoggedProperties(params: GetLoggedPropertiesParams): twx.INFOTABLE<twx.ds.PropertyDefinition>;
        /**
         * Category: Metadata 
         * Get avatar image
         * 
         **/
        GetAvatar(): twx.IMAGE;
        /**
         * Category: Lifecycle 
         * Enable this thing
         * 
         **/
        EnableThing(): twx.NOTHING;
        /**
         * Category: Metadata 
         * Get a service definition for this thing
         * Params:
         *	name: twx.STRING  - Name
        **/
        GetServiceDefinition(params: GetServiceDefinitionParams): twx.INFOTABLE<twx.ds.ServiceDefinition>;
        /**
         * Category: Editing 
         * Get the configuration change history
         * 
         **/
        GetConfigurationChangeHistory(): twx.INFOTABLE<twx.ds.ConfigurationChange>;
        /**
         * Category: Properties 
         * Get the current property value
         * Params:
         *	propertyName: twx.STRING  - Property name
        **/
        GetStringPropertyValue(params: GetStringPropertyValueParams): twx.STRING;
        /**
         * Category: Permissions 
         * Delete a run time permission
         * Params:
         *	principal: twx.STRING  - Principal name (name of user or group)
        *	resource: twx.STRING  - Resource name
        *	type: twx.STRING  - Permission type
        *	principalType: twx.STRING  - Principal type (User or Group)
        **/
        DeleteRunTimePermission(params: DeleteRunTimePermissionParams): twx.NOTHING;
        /**
         * Category: Configuration 
         * Get a specific configuration table row as an InfoTable
         * Params:
         *	key: twx.STRING  - Row key value
        *	tableName: twx.STRING  - Configuration table name
        **/
        GetConfigurationTableRow(params: GetConfigurationTableRowParams): twx.INFOTABLE;
        /**
         * Category: Metadata 
         * Get the instance metadata in JSON format
         * 
         **/
        GetInstanceMetadataAsJSON(): twx.JSON;
        /**
         * Category: Configuration 
         * Save any changes to configuration tables
         * 
         **/
        SaveConfigurationTables(): twx.NOTHING;
        /**
         * Category: Alerts 
         * Acknowledge an active alert
         * Params:
         *	property: twx.STRING  - Property name
        *	message: twx.STRING  - Message (optional)
        **/
        AcknowledgeAlert(params: AcknowledgeAlertParams): twx.NOTHING;
        /**
         * Category: Queries 
         * Query stream entries, along with filter and sort criteria
         * Params:
         *	oldestFirst: twx.BOOLEAN  - Search/sort from oldest to newest
        *	maxItems: twx.NUMBER  - Maximum number of items to return
        *	propertyName: twx.STRING  - Property name
        *	endDate: twx.DATETIME  - End time
        *	query: twx.QUERY  - Query definition
        *	startDate: twx.DATETIME  - Start time
        **/
        QueryLocationPropertyHistory(params: QueryLocationPropertyHistoryParams): twx.INFOTABLE<twx.ds.LocationValueStream>;
        /**
         * Category: Bindings 
         * Set the remote service binding for a service
         * Params:
         *	sourceServiceName: twx.STRING  - Source service name
        *	serviceName: twx.STRING  - Service name
        *	timeout: twx.INTEGER  - Request timeout
        **/
        SetRemoteServiceBinding(params: SetRemoteServiceBindingParams): twx.NOTHING;
        /**
         * Category: Queries 
         * Query stream entries, along with filter and sort criteria
         * Params:
         *	oldestFirst: twx.BOOLEAN  - Search/sort from oldest to newest
        *	maxItems: twx.NUMBER  - Maximum number of items to return
        *	propertyName: twx.STRING  - Property name
        *	endDate: twx.DATETIME  - End time
        *	query: twx.QUERY  - Query definition
        *	startDate: twx.DATETIME  - Start time
        **/
        QueryVec4PropertyHistory(params: QueryVec4PropertyHistoryParams): twx.INFOTABLE<twx.ds.Vec4DataShape>;
        /**
         * Category: Metadata 
         * Check to see if a thing is derived from a particular thing template
         * Params:
         *	thingTemplateName: twx.THINGTEMPLATENAME  - Thing template name
        **/
        IsDerivedFromTemplate(params: IsDerivedFromTemplateParams): twx.BOOLEAN;
        /**
         * Category: Data 
         * Store properties of this thing to a stream
         * Params:
         *	name: twx.THINGNAME  - Stream name
        *	tags: twx.TAGS  - Tags
        **/
        WritePropertiesToStream(params: WritePropertiesToStreamParams): twx.NOTHING;
        /**
         * Category: Relationships 
         * Return a list of all the things referenced by this thing
         * Params:
         *	maxDepth: twx.INTEGER  - Maximum depth to search
        **/
        GetThingRelationships(params: GetThingRelationshipsParams): twx.INFOTABLE<twx.ds.ThingRelationship>;
        /**
         * Category: Configuration 
         * Get a list of configuration tables
         * 
         **/
        GetConfigurationTables(): twx.INFOTABLE<twx.ds.EntityList>;
        /**
         * Category: StreamEntries 
         * Add a new stream entry
         * Params:
         *	propertyName: twx.STRING  - Property name
        *	value: twx.VEC4  - Data value
        *	timestamp: twx.DATETIME  - Event time (optional)
        **/
        AddVec4ValueStreamEntry(params: AddVec4ValueStreamEntryParams): twx.NOTHING;
        /**
         * Category: StreamEntries 
         * Add a new stream entry
         * Params:
         *	propertyName: twx.STRING  - Property name
        *	value: twx.DATETIME  - Data value
        *	timestamp: twx.DATETIME  - Event time (optional)
        **/
        AddDateTimeValueStreamEntry(params: AddDateTimeValueStreamEntryParams): twx.NOTHING;
        /**
         * Category: Metadata 
         * Get the current service definitions for this thing
         * Params:
         *	category: twx.STRING  - Category to filter on
        *	type: twx.BASETYPENAME  - Type to filter on
        *	dataShape: twx.DATASHAPENAME  - Data shape to filter on if InfoTable base type
        **/
        GetServiceDefinitions(params: GetServiceDefinitionsParams): twx.INFOTABLE<twx.ds.ServiceDefinition>;
        /**
         * Category: Maintenance 
         * Purge all value stream entries for a specified date range for a given list of properties
         * Params:
         *	propertiesToPurge: twx.INFOTABLE<twx.ds.PropertyList>  with datashape PropertyList - Properties to purge
        *	endDate: twx.DATETIME  - End time
        *	startDate: twx.DATETIME  - Start time
        **/
        PurgeSelectedPropertyHistory(params: PurgeSelectedPropertyHistoryParams): twx.NOTHING;
        /**
         * Category: Mashups 
         * Set home mashup
         * Params:
         *	name: twx.MASHUPNAME  - Home mashup name
        **/
        SetHomeMashup(params: SetHomeMashupParams): twx.NOTHING;
        /**
         * Category: Permissions 
         * Assign an owner to this entity
         * Params:
         *	name: twx.USERNAME  - User name
        **/
        SetOwner(params: SetOwnerParams): twx.NOTHING;
        /**
         * Category: Queries 
         * Query stream entries, along with filter and sort criteria
         * Params:
         *	oldestFirst: twx.BOOLEAN  - Search/sort from oldest to newest
        *	maxItems: twx.NUMBER  - Maximum number of items to return
        *	propertyName: twx.STRING  - Property name
        *	endDate: twx.DATETIME  - End time
        *	query: twx.QUERY  - Query definition
        *	startDate: twx.DATETIME  - Start time
        **/
        QueryNumberPropertyHistory(params: QueryNumberPropertyHistoryParams): twx.INFOTABLE<twx.ds.NumberValueStream>;
        /**
         * Category: Alerts 
         * Set a numeric alert parameter
         * Params:
         *	alertName: twx.STRING  - Alert name
        *	property: twx.STRING  - Property name
        *	parameterName: twx.STRING  - Parameter name
        *	persistent: twx.BOOLEAN  - Make it persistent
        *	value: twx.NUMBER  - Parameter value
        **/
        SetNumberAlertParameter(params: SetNumberAlertParameterParams): twx.NOTHING;
        /**
         * Category: Mashups 
         * Get home mashup
         * 
         **/
        GetHomeMashup(): twx.MASHUPNAME;
        /**
         * Category: Metadata 
         * Get the tags for an entity
         * 
         **/
        GetTags(): twx.TAGS;
        /**
         * Category: Alerts 
         * Get the Status of the given Alert
         * Params:
         *	alertName: twx.STRING  - Alert name
        *	property: twx.STRING  - Property name
        **/
        GetAlertStatus(params: GetAlertStatusParams): twx.STRING;
        /**
         * Category: Alerts 
         * Set a boolean alert parameter
         * Params:
         *	alertName: twx.STRING  - Alert name
        *	property: twx.STRING  - Property name
        *	parameterName: twx.STRING  - Parameter name
        *	persistent: twx.BOOLEAN  - Make it persistent
        *	value: twx.BOOLEAN  - Parameter value
        **/
        SetBooleanAlertParameter(params: SetBooleanAlertParameterParams): twx.NOTHING;
        /**
         * Category: Networks 
         * Get the networks associated with a thing
         * 
         **/
        GetNetworks(): twx.INFOTABLE<twx.ds.EntityList>;
        /**
         * Category: Configuration 
         * Delete an entire configuration table
         * Params:
         *	persistent: twx.BOOLEAN  - Persist these changes
        *	tableName: twx.STRING  - Configuration table name
        **/
        DeleteConfigurationTable(params: DeleteConfigurationTableParams): twx.NOTHING;
        /**
         * Category: Metadata 
         * Get the tags for an entity as an InfoTable
         * 
         **/
        GetTagsAsInfoTable(): twx.INFOTABLE<twx.ds.VocabularyTermList>;
        /**
         * Category: Permissions 
         * Get current user permissions
         * Params:
         *	name: twx.STRING  - Target name (or wildcard)
        *	permissionName: twx.STRING  - Permission name
        **/
        GetPermissionsForCurrentUser(params: GetPermissionsForCurrentUserParams): twx.INFOTABLE<twx.ds.UserPermissions>;
        /**
         * Category: Queries 
         * Query stream entries (without data), along with filter and sort criteria
         * Params:
         *	oldestFirst: twx.BOOLEAN  - Search/sort from oldest to newest
        *	maxItems: twx.NUMBER  - Maximum number of items to return
        *	endDate: twx.DATETIME  - End time
        *	query: twx.QUERY  - Query definition
        *	startDate: twx.DATETIME  - Start time
        **/
        QueryPropertyHistory(params: QueryPropertyHistoryParams): twx.INFOTABLE;
        /**
         * Category: Permissions 
         * Check to see if an entity has a specific design time permission for the current user
         * Params:
         *	type: twx.STRING  - Permission type
        **/
        CheckDesignTimePermission(params: CheckDesignTimePermissionParams): twx.BOOLEAN;
        /**
         * Category: Configuration 
         * Get a specific configuration table definition as an InfoTable
         * Params:
         *	tableName: twx.STRING  - Configuration table name
        **/
        GetConfigurationTableDefinition(params: GetConfigurationTableDefinitionParams): twx.INFOTABLE;
        /**
         * Category: Bindings 
         * Remove the local property binding for a property
         * Params:
         *	propertyName: twx.STRING  - Property name
        **/
        RemoveLocalPropertyBinding(params: RemoveLocalPropertyBindingParams): twx.NOTHING;
        /**
         * Category: Properties 
         * Get the current property value
         * Params:
         *	propertyName: twx.STRING  - Property name
        **/
        GetVec2PropertyValue(params: GetVec2PropertyValueParams): twx.VEC2;
        /**
         * Category: Queries 
         * Query stream entries, along with filter and sort criteria
         * Params:
         *	oldestFirst: twx.BOOLEAN  - Search/sort from oldest to newest
        *	maxItems: twx.NUMBER  - Maximum number of items to return
        *	propertyName: twx.STRING  - Property name
        *	endDate: twx.DATETIME  - End time
        *	query: twx.QUERY  - Query definition
        *	startDate: twx.DATETIME  - Start time
        **/
        QueryLongPropertyHistory(params: QueryLongPropertyHistoryParams): twx.INFOTABLE<twx.ds.LongValueStream>;
        /**
         * Category: Permissions 
         * Set a list of assigned design time permissions
         * Params:
         *	permissions: twx.JSON  - Permissions in JSON format
        **/
        SetDesignTimePermissionsAsJSON(params: SetDesignTimePermissionsAsJSONParams): twx.NOTHING;
        /**
         * Category: Dependencies 
         * Has outgoing dependencies
         * 
         **/
        HasOutgoingDependencies(): twx.BOOLEAN;
        /**
         * Category: Bindings 
         * Get the remote event binding for a event
         * Params:
         *	eventName: twx.STRING  - Event name
        **/
        GetRemoteEventBinding(params: GetRemoteEventBindingParams): twx.INFOTABLE<twx.ds.RemoteEventBinding>;
        /**
         * Category: Permissions 
         * Get group permissions
         * Params:
         *	name: twx.STRING  - Target name (or wildcard)
        *	group: twx.STRING  - Group name
        *	permissionName: twx.STRING  - Permission name
        **/
        GetPermissionsForGroup(params: GetPermissionsForGroupParams): twx.INFOTABLE<twx.ds.UserPermissions>;
        /**
         * Category: StreamEntries 
         * Add a new stream entry
         * Params:
         *	propertyName: twx.STRING  - Property name
        *	value: twx.INTEGER  - Data value
        *	timestamp: twx.DATETIME  - Event time (optional)
        **/
        AddIntegerValueStreamEntry(params: AddIntegerValueStreamEntryParams): twx.NOTHING;
        /**
         * Category: Bindings 
         * Get the remote property binding for a property
         * Params:
         *	propertyName: twx.STRING  - Property name
        **/
        GetRemotePropertyBinding(params: GetRemotePropertyBindingParams): twx.INFOTABLE<twx.ds.RemotePropertyBinding>;
        /**
         * Category: Metadata 
         * Get the metadata in JSON format
         * 
         **/
        GetMetadataWithPermissionsAsJSON(): twx.JSON;
        /**
         * Category: Metadata 
         * Overwrite/set the tags for an entity
         * Params:
         *	tags: twx.TAGS  - Tags for an entity
        **/
        SetTags(params: SetTagsParams): twx.NOTHING;
        /**
         * Category: Dependencies 
         * Get the incoming dependencies
         * Params:
         *	maxItems: twx.NUMBER  - Maximum number of items to return
        **/
        GetIncomingDependencies(params: GetIncomingDependenciesParams): twx.INFOTABLE<twx.ds.EntityDescriptor>;
        /**
         * Category: Metadata 
         * Get the metadata in InfoTable format
         * 
         **/
        GetMetadata(): twx.INFOTABLE;
        /**
         * Category: Metadata 
         * Get the locally implemented thing shapes for this thing
         * 
         **/
        GetLocallyImplementedShapes(): twx.INFOTABLE<twx.ds.EntityList>;
        /**
         * Category: Alerts 
         * Promote an overridden alert to the nearest parent in its heirarchy that defines it.  Currently only Anomaly type Alerts are supported.
         * Params:
         *	propertyName: twx.STRING  - Property name
        *	alertName: twx.STRING  - Alert name
        **/
        PromoteAlert(params: PromoteAlertParams): twx.NOTHING;
        /**
         * Category: Metadata 
         * Append additional tags to an entity
         * Params:
         *	tags: twx.TAGS  - Tags for an entity
        **/
        AddTags(params: AddTagsParams): twx.NOTHING;
        /**
         * Category: Permissions 
         * Get user permissions
         * Params:
         *	name: twx.STRING  - Target name (or wildcard)
        *	user: twx.STRING  - User name
        *	permissionName: twx.STRING  - Permission name
        **/
        GetPermissionsForUser(params: GetPermissionsForUserParams): twx.INFOTABLE<twx.ds.UserPermissions>;
        /**
         * Category: StreamEntries 
         * Add a new stream entry
         * Params:
         *	propertyName: twx.STRING  - Property name
        *	value: twx.BOOLEAN  - Data value
        *	timestamp: twx.DATETIME  - Event time (optional)
        **/
        AddBooleanValueStreamEntry(params: AddBooleanValueStreamEntryParams): twx.NOTHING;
        /**
         * Category: Properties 
         * Get a subset of the current property values for this thing
         * Params:
         *	propertyNames: twx.INFOTABLE<twx.ds.EntityList>  with datashape EntityList - Property names
        **/
        GetNamedPropertyValues(params: GetNamedPropertyValuesParams): twx.INFOTABLE;
        /**
         * Category: Permissions 
         * Get a list of assigned designtime permissions
         * 
         **/
        GetDesignTimePermissionsAsJSON(): twx.JSON;
        /**
         * Category: Permissions 
         * Check to see if an entity has a specific run time permission for a specific group
         * Params:
         *	name: twx.STRING  - Name of the resource (i.e. property, service, event) to check
        *	type: twx.STRING  - Permission type
        *	group: twx.GROUPNAME  - Group name
        **/
        CheckPermissionForGroup(params: CheckPermissionForGroupParams): twx.BOOLEAN;
        /**
         * Category: Identifier 
         * Set the identifier for a thing
         * Params:
         *	identifier: twx.STRING  - Thing identifier for remote things
        **/
        SetIdentifier(params: SetIdentifierParams): twx.NOTHING;
        /**
         * Category: Properties 
         * Get the current property value
         * Params:
         *	propertyName: twx.STRING  - Property name
        **/
        GetDateTimePropertyValue(params: GetDateTimePropertyValueParams): twx.DATETIME;
        /**
         * Category: Alerts 
         * Get Training Statistics for given Alert
         * Params:
         *	alertName: twx.STRING  - Alert name
        *	property: twx.STRING  - Property name
        **/
        GetAnomalyAlertTrainingStatisticsForAlert(params: GetAnomalyAlertTrainingStatisticsForAlertParams): twx.INFOTABLE<twx.ds.AnomalyAlertTrainingStatistics>;
        /**
         * Category: Subscriptions 
         * Disable Subscription
         * Params:
         *	propertyName: twx.STRING  - Property name
        *	thingName: twx.THINGNAME  - Thing name
        *	eventName: twx.STRING  - Event name
        **/
        DisableSubscription(params: DisableSubscriptionParams): twx.NOTHING;
        /**
         * Category: Properties 
         * Has any property changed since a given time
         * Params:
         *	timestamp: twx.DATETIME  - Timestamp to compare
        **/
        HavePropertiesChangedSince(params: HavePropertiesChangedSinceParams): twx.BOOLEAN;
        /**
         * Category: Identifier 
         * Get the identifier for a thing
         * 
         **/
        GetIdentifier(): twx.STRING;
        /**
         * Category: Queries 
         * Query stream entries, along with filter and sort criteria
         * Params:
         *	oldestFirst: twx.BOOLEAN  - Search/sort from oldest to newest
        *	maxItems: twx.NUMBER  - Maximum number of items to return
        *	propertyName: twx.STRING  - Property name
        *	endDate: twx.DATETIME  - End time
        *	query: twx.QUERY  - Query definition
        *	startDate: twx.DATETIME  - Start time
        **/
        QueryImagePropertyHistory(params: QueryImagePropertyHistoryParams): twx.INFOTABLE<twx.ds.ImageValueStream>;
        /**
         * Category: Permissions 
         * Set a list of assigned visibility permissions
         * Params:
         *	permissions: twx.JSON  - Permissions in JSON format
        **/
        SetVisibilityPermissionsAsJSON(params: SetVisibilityPermissionsAsJSONParams): twx.NOTHING;
        /**
         * Category: Alerts 
         * Get alert definition for a property
         * Params:
         *	alertName: twx.STRING  - Alert name
        *	property: twx.STRING  - Property name
        **/
        GetAlertDefinition(params: GetAlertDefinitionParams): twx.INFOTABLE<twx.ds.AlertDefinition>;
        /**
         * Category: Permissions 
         * Add a visibility permission
         * Params:
         *	principal: twx.STRING  - Principal name (name of organization or organization unit)
        *	principalType: twx.STRING  - Principal type (Organization or Organization Unit)
        **/
        AddVisibilityPermission(params: AddVisibilityPermissionParams): twx.NOTHING;
        /**
         * Category: Alerts 
         * Remove an alert for a property
         * Params:
         *	alertName: twx.STRING  - Alert name
        *	property: twx.STRING  - Property name
        *	persistent: twx.BOOLEAN  - Persist this change
        **/
        RemoveAlert(params: RemoveAlertParams): twx.NOTHING;
        /**
         * Category: Alerts 
         * Get a location alert parameter
         * Params:
         *	alertName: twx.STRING  - Alert name
        *	property: twx.STRING  - Property name
        *	parameterName: twx.STRING  - Parameter name
        **/
        GetLocationAlertParameter(params: GetLocationAlertParameterParams): twx.LOCATION;
        /**
         * Category: Mashups 
         * Get the mashups related to this thing
         * 
         **/
        GetMashups(): twx.INFOTABLE<twx.ds.MashupList>;
        /**
         * Category: Permissions 
         * Get a list of assigned runtime permissions
         * 
         **/
        GetRunTimePermissionsAsJSON(): twx.JSON;
        /**
         * Category: Subscriptions 
         * Add a dynamic subscription
         * Params:
         *	propertyName: twx.STRING  - Property name
        *	thingName: twx.THINGNAME  - Thing name
        *	eventName: twx.STRING  - Event name
        *	serviceName: twx.STRING  - Local service name
        **/
        AddDynamicSubscription(params: AddDynamicSubscriptionParams): twx.NOTHING;
        /**
         * Category: Alerts 
         * Get a numeric alert parameter
         * Params:
         *	alertName: twx.STRING  - Alert name
        *	property: twx.STRING  - Property name
        *	parameterName: twx.STRING  - Parameter name
        **/
        GetIntegerAlertParameter(params: GetIntegerAlertParameterParams): twx.INTEGER;
        /**
         * Category: Bindings 
         * Get incoming local bindings to this thing for the given property
         * Params:
         *	propertyName: twx.STRING  - Property name
        **/
        GetIncomingLocalPropertyBinding(params: GetIncomingLocalPropertyBindingParams): twx.INFOTABLE<twx.ds.IncomingLocalPropertyBinding>;
        /**
         * Category: DataLogging 
         * Set the value stream for a thing
         * Params:
         *	name: twx.THINGNAME  - Value stream name
        **/
        SetValueStream(params: SetValueStreamParams): twx.NOTHING;
        /**
         * Category: Metadata 
         * Remove a service definition
         * Params:
         *	name: twx.STRING  - Service name
        **/
        RemoveServiceDefinition(params: RemoveServiceDefinitionParams): twx.NOTHING;
        /**
         * Category: Alerts 
         * Get a long alert parameter
         * Params:
         *	alertName: twx.STRING  - Alert name
        *	property: twx.STRING  - Property name
        *	parameterName: twx.STRING  - Parameter name
        **/
        GetLongAlertParameter(params: GetLongAlertParameterParams): twx.LONG;
        /**
         * Category: StreamEntries 
         * Add a new stream entry
         * Params:
         *	propertyName: twx.STRING  - Property name
        *	value: twx.STRING  - Data value
        *	timestamp: twx.DATETIME  - Event time (optional)
        **/
        AddStringValueStreamEntry(params: AddStringValueStreamEntryParams): twx.NOTHING;
        /**
         * Category: Properties 
         * Get the current property values for this thing
         * 
         **/
        GetPropertyValues(): twx.INFOTABLE;
        /**
         * Category: Bindings 
         * Get the property binding for a property
         * Params:
         *	propertyName: twx.STRING  - Property name
        **/
        GetLocalPropertyBinding(params: GetLocalPropertyBindingParams): twx.INFOTABLE<twx.ds.LocalPropertyBinding>;
        /**
         * Category: Alerts 
         * Get alert summary status
         * Params:
         *	maxItems: twx.NUMBER  - Maximum number of items to return
        *	onlyUnacknowledged: twx.BOOLEAN  - Show only unacknowledged alerts
        *	onlyAcknowledged: twx.BOOLEAN  - Show only acknowledged alerts
        **/
        GetAlertSummary(params: GetAlertSummaryParams): twx.INFOTABLE<twx.ds.AlertSummary>;
        /**
         * Category: Alerts 
         * Query the alert summary
         * Params:
         *	maxItems: twx.NUMBER  - Maximum number of items to return
        *	query: twx.QUERY  - Query definition
        *	onlyUnacknowledged: twx.BOOLEAN  - Show only unacknowledged alerts
        *	onlyAcknowledged: twx.BOOLEAN  - Show only acknowledged alerts
        **/
        QueryAlertSummary(params: QueryAlertSummaryParams): twx.INFOTABLE<twx.ds.AlertSummary>;
        /**
         * Category: Alerts 
         * Set a location alert parameter
         * Params:
         *	alertName: twx.STRING  - Alert name
        *	property: twx.STRING  - Property name
        *	parameterName: twx.STRING  - Parameter name
        *	persistent: twx.BOOLEAN  - Make it persistent
        *	value: twx.LOCATION  - Parameter value
        **/
        SetLocationAlertParameter(params: SetLocationAlertParameterParams): twx.NOTHING;
        /**
         * Category: Properties 
         * Get the current property value
         * Params:
         *	propertyName: twx.STRING  - Property name
        **/
        GetLongPropertyValue(params: GetLongPropertyValueParams): twx.LONG;
        /**
         * Category: Metadata 
         * Get the current event definitions for this thing
         * Params:
         *	category: twx.STRING  - Category to filter on
        *	dataShape: twx.DATASHAPENAME  - Data shape to filter on if InfoTable base type
        **/
        GetEventDefinitions(params: GetEventDefinitionsParams): twx.INFOTABLE<twx.ds.EventDefinition>;
        /**
         * Category: Metadata 
         * Get the thing template for this thing
         * 
         **/
        GetThingTemplate(): twx.INFOTABLE<twx.ds.EntityList>;
        /**
         * Category: Queries 
         * Query stream entries (without data), along with filter and sort criteria
         * Params:
         *	oldestFirst: twx.BOOLEAN  - Search/sort from oldest to newest
        *	maxItems: twx.NUMBER  - Maximum number of items to return
        *	endDate: twx.DATETIME  - End time
        *	propertyNames: twx.INFOTABLE<twx.ds.EntityList>  with datashape EntityList - Property names
        *	query: twx.QUERY  - Query definition
        *	startDate: twx.DATETIME  - Start time
        **/
        QueryNamedPropertyHistory(params: QueryNamedPropertyHistoryParams): twx.INFOTABLE;
        /**
         * Category: Properties 
         * Get a subset of the current property values for this thing
         * Params:
         *	values: twx.INFOTABLE  - Property values
        **/
        SetPropertyValues(params: SetPropertyValuesParams): twx.NOTHING;
        /**
         * Category: Alerts 
         * Get AnomalyAlert Training Statistics for given Property
         * Params:
         *	property: twx.STRING  - Property name
        **/
        GetAnomalyAlertTrainingStatisticsForProperty(params: GetAnomalyAlertTrainingStatisticsForPropertyParams): twx.INFOTABLE<twx.ds.AnomalyAlertTrainingStatistics>;
        /**
         * Category: Queries 
         * Query stream entries, along with filter and sort criteria
         * Params:
         *	oldestFirst: twx.BOOLEAN  - Search/sort from oldest to newest
        *	maxItems: twx.NUMBER  - Maximum number of items to return
        *	propertyName: twx.STRING  - Property name
        *	endDate: twx.DATETIME  - End time
        *	query: twx.QUERY  - Query definition
        *	startDate: twx.DATETIME  - Start time
        **/
        QueryIntegerPropertyHistory(params: QueryIntegerPropertyHistoryParams): twx.INFOTABLE<twx.ds.IntegerValueStream>;
        /**
         * Category: Lifecycle 
         * Disable this thing
         * 
         **/
        DisableThing(): twx.NOTHING;
        /**
         * Category: Metadata 
         * Get the current property definitions for this thing
         * Params:
         *	name: twx.STRING  - Name
        **/
        GetPropertyDefinition(params: GetPropertyDefinitionParams): twx.INFOTABLE<twx.ds.PropertyDefinition>;
        /**
         * Category: Alerts 
         * Get alert summary for a property
         * Params:
         *	maxItems: twx.NUMBER  - Maximum number of items to return
        *	onlyUnacknowledged: twx.BOOLEAN  - Show only unacknowledged alerts
        *	property: twx.STRING  - Property name
        *	onlyAcknowledged: twx.BOOLEAN  - Show only acknowledged alerts
        **/
        GetAlertSummaryForProperty(params: GetAlertSummaryForPropertyParams): twx.INFOTABLE<twx.ds.PropertyAlertSummary>;
        /**
         * Category: StreamEntries 
         * Add a new stream entry
         * Params:
         *	propertyName: twx.STRING  - Property name
        *	value: twx.THINGCODE  - Data value
        *	timestamp: twx.DATETIME  - Event time (optional)
        **/
        AddThingCodeValueStreamEntry(params: AddThingCodeValueStreamEntryParams): twx.NOTHING;
        /**
         * Category: Properties 
         * Get the timestamp for a specific property
         * Params:
         *	propertyName: twx.STRING  - Property name
        **/
        GetPropertyTime(params: GetPropertyTimeParams): twx.DATETIME;
        /**
         * Category: Bindings 
         * Get all things and their properties that have local bindings on this thing
         * 
         **/
        GetIncomingLocalPropertyBindings(): twx.INFOTABLE<twx.ds.IncomingLocalPropertyBinding>;
        /**
         * Category: StreamEntries 
         * Add a new stream entry
         * Params:
         *	propertyName: twx.STRING  - Property name
        *	value: twx.VEC2  - Data value
        *	timestamp: twx.DATETIME  - Event time (optional)
        **/
        AddVec2ValueStreamEntry(params: AddVec2ValueStreamEntryParams): twx.NOTHING;
        /**
         * Category: Metadata 
         * Get avatar image url
         * 
         **/
        GetAvatarURL(): twx.IMAGELINK;
        /**
         * Category: StreamEntries 
         * Add a new stream entry
         * Params:
         *	propertyName: twx.STRING  - Property name
        *	value: twx.IMAGE  - Data value
        *	timestamp: twx.DATETIME  - Event time (optional)
        **/
        AddImageValueStreamEntry(params: AddImageValueStreamEntryParams): twx.NOTHING;
        /**
         * Category: Metadata 
         * Get the current property definitions for this thing
         * Params:
         *	category: twx.STRING  - Category to filter on
        *	type: twx.BASETYPENAME  - Type to filter on
        *	dataShape: twx.DATASHAPENAME  - Data shape to filter on if InfoTable base type
        **/
        GetPropertyDefinitions(params: GetPropertyDefinitionsParams): twx.INFOTABLE<twx.ds.PropertyDefinition>;
        /**
         * Category: Metadata 
         * Get summary information
         * 
         **/
        GetSummaryInformation(): twx.INFOTABLE<twx.ds.EntitySummary>;
        /**
         * Category: Queries 
         * Query stream entries, along with filter and sort criteria
         * Params:
         *	oldestFirst: twx.BOOLEAN  - Search/sort from oldest to newest
        *	maxItems: twx.NUMBER  - Maximum number of items to return
        *	propertyName: twx.STRING  - Property name
        *	endDate: twx.DATETIME  - End time
        *	query: twx.QUERY  - Query definition
        *	startDate: twx.DATETIME  - Start time
        **/
        QueryThingCodePropertyHistory(params: QueryThingCodePropertyHistoryParams): twx.INFOTABLE<twx.ds.ThingCodeDataShape>;
        /**
         * Category: Bindings 
         * Remove the remote event binding for a event
         * Params:
         *	eventName: twx.STRING  - Event name
        **/
        RemoveRemoteEventBinding(params: RemoveRemoteEventBindingParams): twx.NOTHING;
        /**
         * Category: Dependencies 
         * Get the outgoing dependencies as a network
         * Params:
         *	maxDepth: twx.NUMBER  - Maximum depth to traverse
        *	maxItems: twx.NUMBER  - Maximum number of items to return
        **/
        GetOutgoingDependenciesAsNetwork(params: GetOutgoingDependenciesAsNetworkParams): twx.INFOTABLE<twx.ds.EntityNetwork>;
        /**
         * Category: Alerts 
         * Get local alert definitions for a property
         * Params:
         *	property: twx.STRING  - Property name
        **/
        GetLocalAlertDefinitions(params: GetLocalAlertDefinitionsParams): twx.INFOTABLE<twx.ds.AlertDefinition>;
        /**
         * Category: Alerts 
         * Get the Statuses of the given Alerts
         * Params:
         *	property: twx.STRING  - Property name
        **/
        GetAlertStatusesForProperty(params: GetAlertStatusesForPropertyParams): twx.INFOTABLE;
        /**
         * Category: Alerts 
         * Get a numeric alert parameter
         * Params:
         *	alertName: twx.STRING  - Alert name
        *	property: twx.STRING  - Property name
        *	parameterName: twx.STRING  - Parameter name
        **/
        GetNumberAlertParameter(params: GetNumberAlertParameterParams): twx.NUMBER;
        /**
         * Category: Alerts 
         * Get All AnomalyAlert Training Statistics on this Thing
         * 
         **/
        GetAllAnomalyAlertTrainingStatistics(): twx.INFOTABLE<twx.ds.AnomalyAlertTrainingStatistics>;
        /**
         * Category: Properties 
         * Get the quality for a specific property
         * Params:
         *	propertyName: twx.STRING  - Property name
        **/
        GetPropertyQuality(params: GetPropertyQualityParams): twx.STRING;
        /**
         * Category: Metadata 
         * Get the instance metadata in JSON format
         * 
         **/
        GetInstanceMetadataWithPermissionsAsJSON(): twx.JSON;
        /**
         * Category: Permissions 
         * Get a list of assigned visibility permissions
         * 
         **/
        GetVisibilityPermissionsAsJSON(): twx.JSON;
        /**
         * Category: Dependencies 
         * Get the incoming dependencies as a network
         * Params:
         *	maxDepth: twx.NUMBER  - Maximum depth to traverse
        *	maxItems: twx.NUMBER  - Maximum number of items to return
        **/
        GetIncomingDependenciesAsNetwork(params: GetIncomingDependenciesAsNetworkParams): twx.INFOTABLE<twx.ds.EntityNetwork>;
        /**
         * Category: Alerts 
         * Check to see if an alert is defined for a property
         * Params:
         *	alertName: twx.STRING  - Alert name
        *	property: twx.STRING  - Property name
        **/
        HasAlert(params: HasAlertParams): twx.BOOLEAN;
        /**
         * Category: Metadata 
         * Remove a event definition
         * Params:
         *	name: twx.STRING  - Event name
        **/
        RemoveEventDefinition(params: RemoveEventDefinitionParams): twx.NOTHING;
        /**
         * Category: Permissions 
         * Set a list of assigned runtime permissions
         * Params:
         *	permissions: twx.JSON  - Permissions in JSON format
        **/
        SetRunTimePermissionsAsJSON(params: SetRunTimePermissionsAsJSONParams): twx.NOTHING;
        /**
         * Category: Subscriptions 
         * Enable Subscription
         * Params:
         *	propertyName: twx.STRING  - Property name
        *	thingName: twx.THINGNAME  - Thing name
        *	eventName: twx.STRING  - Event name
        **/
        EnableSubscription(params: EnableSubscriptionParams): twx.NOTHING;
        /**
         * Category: Editing 
         * Get the date edit was last modified
         * 
         **/
        GetLastModifiedDate(): twx.DATETIME;
        /**
         * Category: Queries 
         * Query stream entries, along with filter and sort criteria
         * Params:
         *	oldestFirst: twx.BOOLEAN  - Search/sort from oldest to newest
        *	maxItems: twx.NUMBER  - Maximum number of items to return
        *	propertyName: twx.STRING  - Property name
        *	endDate: twx.DATETIME  - End time
        *	query: twx.QUERY  - Query definition
        *	startDate: twx.DATETIME  - Start time
        **/
        QueryDateTimePropertyHistory(params: QueryDateTimePropertyHistoryParams): twx.INFOTABLE<twx.ds.DateTimeValueStream>;
        /**
         * Category: Bindings 
         * Set the remote event binding for a event
         * Params:
         *	sourceEventName: twx.STRING  - Source event name
        *	eventName: twx.STRING  - Event name
        **/
        SetRemoteEventBinding(params: SetRemoteEventBindingParams): twx.NOTHING;
        /**
         * Category: Alerts 
         * Enable alert(s) for a property. Specify alertName for a specific property alert; otherwise, all alerts are enabled.
         * Params:
         *	alertName: twx.STRING  - Alert name
        *	property: twx.STRING  - Property name
        *	persistent: twx.BOOLEAN  - Persist this change
        **/
        EnableAlertsForProperty(params: EnableAlertsForPropertyParams): twx.NOTHING;
        /**
         * Category: Alerts 
         * Get a string alert parameter
         * Params:
         *	alertName: twx.STRING  - Alert name
        *	property: twx.STRING  - Property name
        *	parameterName: twx.STRING  - Parameter name
        **/
        GetStringAlertParameter(params: GetStringAlertParameterParams): twx.STRING;
        /**
         * Category: Metadata 
         * Remove a property definition
         * Params:
         *	name: twx.STRING  - Property name
        **/
        RemovePropertyDefinition(params: RemovePropertyDefinitionParams): twx.NOTHING;
        /**
         * Category: Configuration 
         * Delete one or more rows from a multi-row configuration table
         * Params:
         *	values: twx.INFOTABLE  - Configuration table rows to modify
        *	persistent: twx.BOOLEAN  - Persist these changes
        *	tableName: twx.STRING  - Configuration table name
        **/
        DeleteConfigurationTableRows(params: DeleteConfigurationTableRowsParams): twx.NOTHING;
        /**
         * Category: Configuration 
         * Update/add one or more rows in a multi-row configuration table
         * Params:
         *	values: twx.INFOTABLE  - Configuration table rows to modify
        *	persistent: twx.BOOLEAN  - Persist these changes
        *	tableName: twx.STRING  - Configuration table name
        **/
        SetConfigurationTableRows(params: SetConfigurationTableRowsParams): twx.NOTHING;
        /**
         * Category: Alerts 
         * Set a string alert parameter
         * Params:
         *	alertName: twx.STRING  - Alert name
        *	property: twx.STRING  - Property name
        *	parameterName: twx.STRING  - Parameter name
        *	persistent: twx.BOOLEAN  - Make it persistent
        *	value: twx.STRING  - Parameter value
        **/
        SetStringAlertParameter(params: SetStringAlertParameterParams): twx.NOTHING;
        /**
         * Category: Permissions 
         * Add a design time permission
         * Params:
         *	principal: twx.STRING  - Principal name (name of user or group)
        *	allow: twx.BOOLEAN  - Permission (true = allow, false = deny)
        *	type: twx.STRING  - Permission type (Create, Read, Update, Delete)
        *	principalType: twx.STRING  - Principal type (User or Group)
        **/
        AddDesignTimePermission(params: AddDesignTimePermissionParams): twx.NOTHING;
        /**
         * Category: Permissions 
         * Check to see if an entity has a specific run time permission for the current user
         * Params:
         *	name: twx.STRING  - Name of the resource (i.e. property, service, event) to check
        *	type: twx.STRING  - Permission type
        **/
        CheckPermission(params: CheckPermissionParams): twx.BOOLEAN;
        /**
         * Category: Alerts 
         * Set a date alert parameter
         * Params:
         *	alertName: twx.STRING  - Alert name
        *	property: twx.STRING  - Property name
        *	parameterName: twx.STRING  - Parameter name
        *	persistent: twx.BOOLEAN  - Make it persistent
        *	value: twx.DATETIME  - Parameter value
        **/
        SetDateTimeAlertParameter(params: SetDateTimeAlertParameterParams): twx.NOTHING;
        /**
         * Category: Bindings 
         * Get the effective local property bindings
         * 
         **/
        GetEffectiveLocalPropertyBindings(): twx.INFOTABLE<twx.ds.LocalPropertyBinding>;
        /**
         * Category: Alerts 
         * Get a boolean alert parameter
         * Params:
         *	alertName: twx.STRING  - Alert name
        *	property: twx.STRING  - Property name
        *	parameterName: twx.STRING  - Parameter name
        **/
        GetBooleanAlertParameter(params: GetBooleanAlertParameterParams): twx.BOOLEAN;
        /**
         * Category: Metadata 
         * Get the description for an entity
         * 
         **/
        GetDescription(): twx.STRING;
        /**
         * Category: Alerts 
         * Disable all alerts for a thing
         * Params:
         *	persistent: twx.BOOLEAN  - Persist this change
        **/
        DisableAllAlerts(params: DisableAllAlertsParams): twx.NOTHING;
        /**
         * Category: Properties 
         * Get the current property value
         * Params:
         *	propertyName: twx.STRING  - Property name
        **/
        GetLocationPropertyValue(params: GetLocationPropertyValueParams): twx.LOCATION;
        /**
         * Category: Properties 
         * Get the current property values for this thing as VTQ
         * Params:
         *	propertyNames: twx.INFOTABLE<twx.ds.EntityList>  with datashape EntityList - Property names
        **/
        GetNamedPropertyValuesVTQ(params: GetNamedPropertyValuesVTQParams): twx.INFOTABLE;
        /**
         * Category: Dependencies 
         * Has incoming dependencies
         * 
         **/
        HasIncomingDependencies(): twx.BOOLEAN;
        /**
         * Category: Properties 
         * Get a subset of the current property values (VTQ) and the highest alert for this thing
         * Params:
         *	propertyNames: twx.INFOTABLE<twx.ds.EntityList>  with datashape EntityList - Property names
        **/
        GetNamedPropertyValuesVTQA(params: GetNamedPropertyValuesVTQAParams): twx.INFOTABLE;
        /**
         * Category: StreamEntries 
         * Add a new stream entry
         * Params:
         *	propertyName: twx.STRING  - Property name
        *	value: twx.INFOTABLE  - Data value
        *	timestamp: twx.DATETIME  - Event time (optional)
        **/
        AddInfoTableValueStreamEntry(params: AddInfoTableValueStreamEntryParams): twx.NOTHING;
        /**
         * Category: Properties 
         * Get the current property value
         * Params:
         *	propertyName: twx.STRING  - Property name
        **/
        GetVec4PropertyValue(params: GetVec4PropertyValueParams): twx.VEC4;
        /**
         * Category: Metadata 
         * Set the avatar icon for the entity
         * Params:
         *	content: twx.IMAGE  - Base 64 Encoded Content
        **/
        SetAvatar(params: SetAvatarParams): twx.NOTHING;
        /**
         * Category: Queries 
         * Query stream entries, along with filter and sort criteria
         * Params:
         *	oldestFirst: twx.BOOLEAN  - Search/sort from oldest to newest
        *	maxItems: twx.NUMBER  - Maximum number of items to return
        *	propertyName: twx.STRING  - Property name
        *	endDate: twx.DATETIME  - End time
        *	query: twx.QUERY  - Query definition
        *	startDate: twx.DATETIME  - Start time
        **/
        QueryInfoTablePropertyHistory(params: QueryInfoTablePropertyHistoryParams): twx.INFOTABLE<twx.ds.InfoTableValueStream>;
        /**
         * Category: Projects 
         * Set the project name of this entity
         * Params:
         *	projectName: twx.PROJECTNAME  - Project name
        **/
        SetProjectName(params: SetProjectNameParams): twx.NOTHING;
        /**
         * Category: Alerts 
         * Retrain an Anomaly Alert
         * Params:
         *	propertyName: twx.STRING  - Property name
        *	alertName: twx.STRING  - Alert name
        **/
        RetrainAlert(params: RetrainAlertParams): twx.NOTHING;
        /**
         * Category: DataLogging 
         * Get property logging status for a specific property
         * Params:
         *	propertyName: twx.STRING  - Property name
        **/
        GetPropertyLogging(params: GetPropertyLoggingParams): twx.BOOLEAN;
        /**
         * Category: Queries 
         * Query stream entries, along with filter and sort criteria
         * Params:
         *	oldestFirst: twx.BOOLEAN  - Search/sort from oldest to newest
        *	maxItems: twx.NUMBER  - Maximum number of items to return
        *	propertyName: twx.STRING  - Property name
        *	endDate: twx.DATETIME  - End time
        *	query: twx.QUERY  - Query definition
        *	startDate: twx.DATETIME  - Start time
        **/
        QueryVec3PropertyHistory(params: QueryVec3PropertyHistoryParams): twx.INFOTABLE<twx.ds.Vec3DataShape>;
        /**
         * Category: Metadata 
         * Overwrite/set the description for an entity
         * Params:
         *	description: twx.STRING  - Description for an entity
        **/
        SetDescription(params: SetDescriptionParams): twx.NOTHING;
        /**
         * Category: Configuration 
         * Get a specific configuration table as an InfoTable
         * Params:
         *	tableName: twx.STRING  - Configuration table name
        **/
        GetConfigurationTable(params: GetConfigurationTableParams): twx.INFOTABLE;
        /**
         * Category: Permissions 
         * Delete a design time permission
         * Params:
         *	principal: twx.STRING  - Principal name (name of user or group)
        *	type: twx.STRING  - Permission type
        *	principalType: twx.STRING  - Principal type (User or Group)
        **/
        DeleteDesignTimePermission(params: DeleteDesignTimePermissionParams): twx.NOTHING;
        /**
         * Category: Bindings 
         * Get the remote service binding for a service
         * Params:
         *	serviceName: twx.STRING  - Service name
        **/
        GetRemoteServiceBinding(params: GetRemoteServiceBindingParams): twx.INFOTABLE<twx.ds.RemoteServiceBinding>;
        /**
         * Category: Maintenance 
         * Purge stream entries for a specified date range
         * Params:
         *	propertyName: twx.STRING  - Property name
        *	endDate: twx.DATETIME  - End time
        *	immediate: twx.BOOLEAN  - Delete immediately
        *	startDate: twx.DATETIME  - Start time
        **/
        PurgePropertyHistory(params: PurgePropertyHistoryParams): twx.NOTHING;
        /**
         * Category: Properties 
         * Get the current property values (VTQ) and the highest alert for this thing
         * 
         **/
        GetPropertyValuesVTQA(): twx.INFOTABLE;
        /**
         * Category: Permissions 
         * Delete a visibility permission
         * Params:
         *	principal: twx.STRING  - Principal name (name of organization or organization unit)
        *	principalType: twx.STRING  - Principal type (Organization or Organization Unit)
        **/
        DeleteVisibilityPermission(params: DeleteVisibilityPermissionParams): twx.NOTHING;
        /**
         * Category: Properties 
         * Get the current property value
         * Params:
         *	propertyName: twx.STRING  - Property name
        **/
        GetIntegerPropertyValue(params: GetIntegerPropertyValueParams): twx.INTEGER;
        /**
         * Category: Bindings 
         * Get the effective local property binding for a property
         * Params:
         *	propertyName: twx.STRING  - Property name
        **/
        GetEffectiveLocalPropertyBinding(params: GetEffectiveLocalPropertyBindingParams): twx.INFOTABLE<twx.ds.LocalPropertyBinding>;
        /**
         * Category: Properties 
         * Get the current property values for this thing
         * 
         **/
        GetPropertyValuesAsMultiRowTable(): twx.INFOTABLE;
    }

    export interface ThingsInterface {
        [entityName: string]: twx.GenericThing;
    }
}
