import type { GenericDatabaseReader, GenericDatabaseWriter } from 'convex/server';

export type Id<TableName extends string> = string & { __tableName: TableName };
export type Doc<TableName extends string> = Record<string, any> & { _id: Id<TableName>; _creationTime: number };

export interface QueryCtx {
  db: GenericDatabaseReader<any>;
}

export interface MutationCtx {
  db: GenericDatabaseWriter<any>;
}

export interface ActionCtx {
  runQuery: (query: any, args: any) => Promise<any>;
  runMutation: (mutation: any, args: any) => Promise<any>;
}

export declare const query: (func: { args?: any; returns?: any; handler: (ctx: QueryCtx, args: any) => any }) => any;
export declare const mutation: (func: { args?: any; returns?: any; handler: (ctx: MutationCtx, args: any) => any }) => any;
export declare const action: (func: { args?: any; returns?: any; handler: (ctx: ActionCtx, args: any) => any }) => any;
export declare const internalQuery: typeof query;
export declare const internalMutation: typeof mutation;
export declare const internalAction: typeof action;

