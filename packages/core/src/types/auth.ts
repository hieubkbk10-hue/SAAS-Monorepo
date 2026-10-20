export type UserRole = 'owner' | 'admin' | 'editor' | 'viewer';

export type ModuleAction = 'create' | 'read' | 'update' | 'delete' | 'export' | 'manage';

export type RolePermissions = {
  permissions: Record<string, ModuleAction[]>;
};

export interface ClientSession {
  _id: string;
  clientId: string;
  token: string;
  expiresAt: number;
}

export interface TenantSession {
  _id: string;
  tenantUserId: string;
  tenantId: string;
  token: string;
  expiresAt: number;
}

export interface SuperAdminSession {
  _id: string;
  email: string;
  token: string;
  expiresAt: number;
}

