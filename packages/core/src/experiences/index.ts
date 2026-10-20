export interface ExperienceConfig {
  key: string;
  name: string;
  settingsKey: string;
}

export interface ProductsListUIExperience {
  layout: 'grid' | 'list';
  columns: 2 | 3 | 4;
  showPrice: boolean;
  showAddToCart: boolean;
  showWishlist: boolean;
}

export const DEFAULT_EXPERIENCES: Record<string, unknown> = {
  products_list_ui: {
    layout: 'grid',
    columns: 4,
    showPrice: true,
    showAddToCart: true,
    showWishlist: true,
  } satisfies ProductsListUIExperience,
};

