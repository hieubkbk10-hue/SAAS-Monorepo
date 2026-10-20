import { defineSchema, defineTable } from 'convex/server';
import { v } from 'convex/values';

export default defineSchema({
  // 1. Phân hệ Khách cuối (Client Portal)
  clients: defineTable({
    tenantId: v.string(),
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    status: v.union(v.literal('active'), v.literal('inactive')),
  })
    .index('by_tenant', ['tenantId'])
    .index('by_tenant_and_email', ['tenantId', 'email']),

  clientSessions: defineTable({
    clientId: v.id('clients'),
    token: v.string(),
    expiresAt: v.number(),
  }).index('by_token', ['token']),

  // 2. Phân hệ Nội bộ Tenant (Tenant Admin Portal)
  tenantUsers: defineTable({
    tenantId: v.string(),
    email: v.string(),
    name: v.string(),
    role: v.string(),
    permissions: v.optional(v.any()),
    status: v.union(v.literal('active'), v.literal('suspended')),
  })
    .index('by_tenant', ['tenantId'])
    .index('by_tenant_and_email', ['tenantId', 'email']),

  tenantSessions: defineTable({
    tenantUserId: v.id('tenantUsers'),
    tenantId: v.string(),
    token: v.string(),
    expiresAt: v.number(),
  }).index('by_token', ['token']),

  // 3. Phân hệ Quản trị Hệ thống SaaS (Super Admin Portal)
  superAdminSessions: defineTable({
    email: v.string(),
    token: v.string(),
    expiresAt: v.number(),
  }).index('by_token', ['token']),

  // 4. Cấu hình Runtime Modules & Experience UI
  adminModules: defineTable({
    tenantId: v.string(),
    key: v.string(),
    name: v.string(),
    enabled: v.boolean(),
  })
    .index('by_tenant', ['tenantId'])
    .index('by_tenant_and_key', ['tenantId', 'key']),

  settings: defineTable({
    tenantId: v.string(),
    key: v.string(),
    value: v.any(),
  })
    .index('by_tenant', ['tenantId'])
    .index('by_tenant_and_key', ['tenantId', 'key']),
});

