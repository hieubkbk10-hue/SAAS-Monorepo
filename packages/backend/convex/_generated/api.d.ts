import type { FunctionReference } from 'convex/server';

export declare const api: {
  adminModules: {
    list: FunctionReference<'query', 'public', { tenantId: string }, any>;
    toggleModule: FunctionReference<'mutation', 'public', { tenantId: string; key: string; enabled: boolean }, any>;
  };
  [key: string]: any;
};

export declare const internal: any;

