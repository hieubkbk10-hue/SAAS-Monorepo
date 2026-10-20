import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

export const list = query({
  args: {
    tenantId: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db
      .query('adminModules')
      .withIndex('by_tenant', (q) => q.eq('tenantId', args.tenantId))
      .collect();
  },
});

export const toggleModule = mutation({
  args: {
    tenantId: v.string(),
    key: v.string(),
    enabled: v.boolean(),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db
      .query('adminModules')
      .withIndex('by_tenant_and_key', (q) =>
        q.eq('tenantId', args.tenantId).eq('key', args.key)
      )
      .unique();

    if (existing) {
      await ctx.db.patch(existing._id, { enabled: args.enabled });
      return existing._id;
    }

    return await ctx.db.insert('adminModules', {
      tenantId: args.tenantId,
      key: args.key,
      name: args.key,
      enabled: args.enabled,
    });
  },
});

