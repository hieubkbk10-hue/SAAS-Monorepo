import { ModuleAction } from '../types/auth';

export interface ModuleContract<TFeatures = Record<string, { default: boolean; label: string }>> {
  key: string;
  name: string;
  route: string;
  owner: string;
  actions: readonly ModuleAction[];
  isCore?: boolean;
  features?: TFeatures;
}

export function defineModuleContract<T extends ModuleContract>(contract: T): T {
  return contract;
}

