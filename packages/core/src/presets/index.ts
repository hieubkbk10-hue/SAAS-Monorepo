export interface SystemPreset {
  key: string;
  name: string;
  description: string;
  enabledModules: string[];
}

export const SYSTEM_PRESETS: Record<string, SystemPreset> = {
  blog: {
    key: 'blog',
    name: 'Blog / Tin Tức',
    description: 'Xuất bản nội dung bài viết và tương tác người đọc',
    enabledModules: ['posts', 'media', 'clients', 'settings'],
  },
  landing: {
    key: 'landing',
    name: 'Landing Page',
    description: 'Trang giới thiệu doanh nghiệp và thu thập khách hàng',
    enabledModules: ['posts', 'media', 'settings'],
  },
  catalog: {
    key: 'catalog',
    name: 'Catalog Sản Phẩm',
    description: 'Trưng bày danh mục sản phẩm không giỏ hàng',
    enabledModules: ['products', 'media', 'clients', 'settings'],
  },
  'ecommerce-basic': {
    key: 'ecommerce-basic',
    name: 'eCommerce Basic',
    description: 'Bán hàng trực tuyến cơ bản có giỏ hàng và đặt hàng',
    enabledModules: ['products', 'orders', 'cart', 'media', 'clients', 'settings'],
  },
  'ecommerce-full': {
    key: 'ecommerce-full',
    name: 'eCommerce Full',
    description: 'Thương mại điện tử toàn diện với khuyến mãi và yêu thích',
    enabledModules: ['products', 'orders', 'cart', 'wishlist', 'promotions', 'media', 'clients', 'settings'],
  },
};

