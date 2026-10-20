import type { Id, Doc } from './server';

export type { Id, Doc };

export interface DataModel {
  clients: Doc<'clients'>;
  clientSessions: Doc<'clientSessions'>;
  tenantUsers: Doc<'tenantUsers'>;
  tenantSessions: Doc<'tenantSessions'>;
  superAdminSessions: Doc<'superAdminSessions'>;
  adminModules: Doc<'adminModules'>;
  settings: Doc<'settings'>;
}

