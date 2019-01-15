declare class logger {
    /**
     * Log a debug warning
     */
    static debug(message: string)
    /**
     * Log a error warning
     */
    static error(message: string)
    /**
     * Log a warn warning
     */
    static warn(message: string)
    /**
     * Log a info warning
     */
    static info(message: string)
}
/** 
 * The name of the currently logged in user. 
 * Make this statically equal to System so completions on Users[principal] work.
 **/
declare const principal = "System";
declare namespace twx {
    export type STRING = string;
    export interface LOCATION {
        latitude: number
        longitude: number
        elevation?: number
        units?: string
    }
    export type NOTHING = void;
    export type NUMBER = number;
    export type INTEGER = number
    export type LONG = number
    export type BOOLEAN = boolean
    export type DASHBOADNAME = string
    export type GROUPNAME = string
    export type GUID = string
    export type HTML = string
    export type HYPERLINK = string
    export type DASHBOARDNAME = string
    export type STYLEDEFINITIONNAME = string
    export type MEDIAENTITYNAME = string
    export type APPLICATIONKEYNAME = string
    export type NETWORKNAME = string
    export type ORGANIZATIONNAME = string
    export type PERSISTENCEPROVIDERNAME = string
    export type NOTIFICATIONDEFINITIONNAME = string
    export type NOTIFICATIONCONTENTNAME = string
    export interface IMAGE { }
    export type IMAGELINK = string
    export type MASHUPNAME = string
    export type MENUNAME = string
    export type PASSWORD = string
    export type TEXT = string
    export type THINGCODE = string
    export type THINGNAME = string
    export type USERNAME = string
    export interface DATETIME extends Date { }
    export interface XML { }
    export interface JSON { }
    export interface QUERY {
        filters?: any;
        sorts?: any;
    }
    export interface TAGS { }
    export interface SCHEDULE { }
    export interface VARIANT { }
    export interface BLOB { }
    export type THINGSHAPENAME = string
    export type THINGTEMPLATENAME = string
    export type DATASHAPENAME = string
    export type PROJECTNAME = string
    export type BASETYPENAME = string
    export interface FieldDefinition {
        ordinal: number;
        baseType: string;
        name: string;
        description: string;
    }
    export interface SortDefinition {
        name: string;
        ascending: boolean;
    }
    export interface DataShape {
        fieldDefinitions: FieldDefinition;
    }
    /**
     * This is a native java value collection
     */
    export type ValueCollection<T extends {} = {}> = {
        /**
         * Clones this value collection into a new one
         */
        clone(): ValueCollection<T>;
        /**
         * Performs equality check on two value collections.
         */
        matches(valuesToCompare: ValueCollection<T>): boolean;
        /**
         * Transforms this value collection into a native Javascript JSON so it's easier to work on
         */
        toJSON(): T;
        /**
         * Transforms this value collection into a native Infotable in order to return out of a service
         */
        toInfoTable(): twx.INFOTABLE<T>;
    } & T;

    export interface InfotableJson<T = {}> {
        /**
         * An array of all the rows in the infotable
         */
        rows: T[];
        datashape: DataShape;
    }
    export type INFOTABLE<T extends {} = {}> = InfotableJson<T> & {
        /**
         * An array of all the  rows in the infotable as ValueCollection
         */
        rows: ValueCollection<T>[];
        /**
         * Adds a field to this InfoTable datashape
         */
        AddField(params: FieldDefinition);
        /**
         * Adds a row to this InfoTable given the values as a JSON
         */
        AddRow(params: T);
        /**
         * Removes a field from this InfoTable given the field name as a String
         */
        RemoveField(fieldName: String);
        /**
         * Removes a row from the InfoTable given its index
         */
        RemoveRow(index: number);
        /**
         * Removes all rows from this InfoTable
         */
        RemoveAllRows();
        /**
         * Returns the number of rows in this InfoTable as an Integer
         */
        getRowCount(): number;
        /**
         * Sorts the infotable inplace on a particular field
         */
        Sort(field: SortDefinition);
        /**
         * Filters the infotable inplace base on values
         */
        Filter(values: T);
        /**
         * Finds the first row that matches the condition based on values
         */
        Find(values: T);
        /**
         * Deletes all the rows that match the given vales
         */
        Delete(values: T);
        /**
         * Transforms the infotable into a JSON infotable
         */
        ToJSON(): InfotableJson<T>;
        /**
         * Transforms the infotable into a JSON infotable
         */
        toJSONSubset(): InfotableJson<T>;
        /**
         * Transforms the infotable into a JSON infotable
         */
        toJSONLite(): InfotableJson<T>;
        /**
         * Finds rows in this InfoTable with values that match the values given and returns them as a new InfoTable
         * @param values The values to be matched as a JSON
         * @return InfoTable Containing the rows with matching values
         * @throws Exception If an error occurs
         */
        // NOT WORKING NativeObject->JSONObject FilterToNewTable(values: any): INFOTABLE;
        /**
         * Verifies a field exists in this InfoTables DataShape given the field name as a String
         *
         * @param name String containing the name of the field to verify
         * @return Boolean True: if field exists in DataShape, False: if field does not exist in DataShape
         */
        hasField(name: string): boolean;
        /**
         * Returns a FieldDefinition from this InfoTables DataShapeDefinition, given the name of the
         * field as a String
         *
         * @param name String containing the name of the field
         * @return FieldDefinition from this InfoTables DataShape or null if not found
         */
        getField(name: String): FieldDefinition;
        /**
         * Returns a row from this InfoTable given its index as an int
         *
         * @param index Location of the row (ValueCollection) in the ValueCollectionList
         * @return ValueCollection of the row specified or null if index is out of range
         */
        getRow(index: number): ValueCollection<T>;
        /**
         * Finds and returns the index of a row from this InfoTable that matches the values of all fields given as a ValueCollection
         *
         * @param values ValueCollection containing the values that match all fields in the row
         * @return int Index of the row in this InfoTable that matches the values given or null if not found
         */
        // NOT WORKING: findIndex(values: any): number;
        /**
         * Limits the infotable to the top N items. This happens inplace
         */
        topN(maxItems: number);
        /**
         * Limits the infotable to the top N items. Returns the new infotable
         */
        topNToNewTable(maxItems: number): INFOTABLE<T>;
        /**
         * Clones the infotable into a new one
         */
        clone(): INFOTABLE<T>;
        /**
         * Returns a new empty InfoTable with the same fields defined
         *
         * @return InfoTable with matching fields
         */
        // NOT WORKING CloneStructure(): INFOTABLE;
        /**
         * Copies a row from this InfoTable, given its row number as an int, and returns it in a new InfoTable
         *
         * @param rowNumber The row to be copied from this InfoTable as an int
         * @return InfoTable containing the row copied from this InfoTable
         */
        CopyValues(rowNumber: number): INFOTABLE<T>;
        /**
         * Gets a specific row in the infotable
         */
        [key: number]: T;
    } & T;
}