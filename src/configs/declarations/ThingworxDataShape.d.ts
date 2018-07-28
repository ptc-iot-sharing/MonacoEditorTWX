declare namespace twx.DataShapeParams {
    export interface AddFieldDefinitionParams {
        /** 
         * Property name 
         */
        name: STRING;
        /** 
         * Property description 
         */
        description: STRING;
        /** 
         * Data type 
         */
        type: BASETYPENAME;
        /** 
         * Ordinal/order 
         */
        ordinal: INTEGER;
        /** 
         * Is Primary Key 
         */
        primaryKey: BOOLEAN;
        /** 
         * Data shape 
         */
        dataShape: DATASHAPENAME;
    }
    export interface GetFieldDefinitionParams {
        /** 
         * Field name 
         */
        name: STRING;
    }
    export interface GetRelatedEntitiesParams {
        /** 
         * Maximum number of items to return 
         */
        maxItems: NUMBER;
    }
    export interface GetEffectiveFieldDefinitionParams {
        /** 
         * Field name 
         */
        name: STRING;
    }
    export interface RemoveFieldDefinitionParams {
        /** 
         * Property name 
         */
        name: STRING;
    }
    export interface CreateValuesWithDataParams<T> {
        /** 
         * Data values (JSON Object) 
         */
        values: T;
    }
    export interface UpdateFieldDefinitionParams {
        /** 
         * Property name 
         */
        name: STRING;
        /** 
         * Property description 
         */
        description: STRING;
        /** 
         * Data type 
         */
        type: BASETYPENAME;
        /** 
         * Ordinal/order 
         */
        ordinal: INTEGER;
        /** 
         * Is Primary Key 
         */
        primaryKey: BOOLEAN;
        /** 
         * Data shape 
         */
        dataShape: DATASHAPENAME;
    }
}
declare namespace twx {
    export interface ds<T> {
        /** 
         * Category: Fields
         * Add a field definition
         * Params: 
         *     name: STRING - Property name
         *     description: STRING - Property description
         *     type: BASETYPENAME - Data type
         *     ordinal: INTEGER - Ordinal/order
         *     primaryKey: BOOLEAN - Is Primary Key
         *     dataShape: DATASHAPENAME - Data shape
          **/
        AddFieldDefinition(params: twx.DataShapeParams.AddFieldDefinitionParams): NOTHING;
        /** 
         * Category: Fields
         * Get a field definition by name for this data shape
         * Params: 
         *     name: STRING - Field name
          **/
        GetFieldDefinition(params: twx.DataShapeParams.GetFieldDefinitionParams): INFOTABLE<twx.ds.FieldDefinition>;
        /** 
         * Category: Fields
         * Get the effective fields for this data shape
         * 
         **/
        GetEffectiveFieldDefinitions(): INFOTABLE<twx.ds.FieldDefinition>;
        /** 
         * Category: Metadata
         * Get the metadata for this data shape as JSON
         * 
         **/
        GetDataShapeMetadataAsJSON(): JSON;
        /** 
         * Category: Queries
         * Get the entities that use this data shape
         * Params: 
         *     maxItems: NUMBER - Maximum number of items to return
          **/
        GetRelatedEntities(params: twx.DataShapeParams.GetRelatedEntitiesParams): INFOTABLE<twx.ds.EntityDescriptor>;
        /** 
         * Category: Fields
         * Get the fields for this data shape
         * 
         **/
        GetFieldDefinitions(): INFOTABLE<twx.ds.FieldDefinition>;
        /** 
         * Category: Fields
         * Get an effective field definition by name for this data shape
         * Params: 
         *     name: STRING - Field name
          **/
        GetEffectiveFieldDefinition(params: twx.DataShapeParams.GetEffectiveFieldDefinitionParams): INFOTABLE<twx.ds.FieldDefinition>;
        /** 
         * Category: Values
         * Create an empty info table of the correct datashape for this data table
         * 
         **/
        CreateValues(): INFOTABLE<T>;
        /** 
         * Category: Metadata
         * Get the effective metadata for this data shape as JSON
         * 
         **/
        GetEffectiveDataShapeMetadataAsJSON(): JSON;
        /** 
         * Category: Fields
         * Remove a field definition
         * Params: 
         *     name: STRING - Property name
          **/
        RemoveFieldDefinition(params: twx.DataShapeParams.RemoveFieldDefinitionParams): NOTHING;
        /** 
         * Category: Crawl
         * Create an info table of the correct datashape for this stream and include data values
         * Params: 
         *     values: JSON - Data values (JSON Object)
          **/
        CreateValuesWithData(params: twx.DataShapeParams.CreateValuesWithDataParams<T>): INFOTABLE<T>;
        /** 
         * Category: Fields
         * Update a field definition
         * Params: 
         *     name: STRING - Property name
         *     description: STRING - Property description
         *     type: BASETYPENAME - Data type
         *     ordinal: INTEGER - Ordinal/order
         *     primaryKey: BOOLEAN - Is Primary Key
         *     dataShape: DATASHAPENAME - Data shape
          **/
        UpdateFieldDefinition(params: twx.DataShapeParams.UpdateFieldDefinitionParams): NOTHING;
    }
}
