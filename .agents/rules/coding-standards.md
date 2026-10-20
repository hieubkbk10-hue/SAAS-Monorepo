# Chuẩn Mực Viết Code: TypeScript 5, React 19, Next.js & Tailwind CSS 4

Tài liệu này quy định các tiêu chuẩn kỹ thuật khi viết code trong hệ sinh thái **SaaS Monorepo Boilerplate**.

---

## 1. Tiêu Chuẩn TypeScript 5

### 1.1. Strict Typing - Cấm Sử Dụng `any`
- Tuyệt đối **không dùng `any`** trong khai báo type, parameters, returns hoặc generic constraints.
- Khi dữ liệu chưa xác định rõ cấu trúc, dùng `unknown` kết hợp type narrowing (type guards) hoặc định nghĩa schema với Zod.
- Tái sử dụng tối đa các kiểu dữ liệu dùng chung từ `@core/types` và các generated types từ `@backend/convex/_generated/dataModel`.

### 1.2. Tiêu Chuẩn Đường Dẫn Tương Đối & Hệ Thống Path Alias
- **Quy tắc độ sâu đường dẫn tương đối (Import Depth Rule)**:
  - **Được phép (Shallow Relative)**: Chỉ cho phép `./` (cùng thư mục) hoặc tối đa **1 cấp** `../` (thư mục cha trực tiếp) cho các file có quan hệ cục bộ trực tiếp (ví dụ: `import { ProductFilter } from './ProductFilter';` hoặc `import { formatCurrency } from '../mappers';`).
  - **Cấm tuyệt đối (Deep Relative)**: Nghiêm cấm dùng `../../` hoặc sâu hơn (`../../../`). Khi cần nhảy cấp hoặc gọi sang module khác, bắt buộc dùng **Path Alias**.
- **Hệ thống Path Alias chuẩn hóa toàn Monorepo**:
  - **Trong các ứng dụng (`apps/site`, `apps/admin`, `apps/system`)**:
    - Dùng `@/*` cho nội bộ ứng dụng: `import { ModuleGuard } from '@/shared/components/guards';`, `import { ProductsDashboard } from '@/features/products';`.
    - Dùng `@backend/*` cho Convex Backend: `import { api } from '@backend/convex/_generated/api';`, `import { Id } from '@backend/convex/_generated/dataModel';`.
    - Dùng `@ui/*` cho UI Primitives & Design System: `import { Button, Dialog, Badge } from '@ui/components';`, `import { cn } from '@ui/lib/utils';`.
    - Dùng `@core/*` cho Domain Contracts & Types: `import { PRODUCT_MODULE_CONTRACT } from '@core/modules';`, `import { Product } from '@core/types';`.
  - **Trong packages**:
    - `packages/core`: dùng `@core/*` cho nội bộ package.
    - `packages/ui`: dùng `@ui/*` cho nội bộ package.
    - `packages/backend`: dùng `@backend/*` cho nội bộ package.
  - **Cấm tuyệt đối** dùng tên package npm (như `@lms/shared`, `@lms/business`, v.v.) trong các câu lệnh `import`.

### 1.3. Chuẩn Mực Import: Tuân Thủ Triệt Để SSOT
- Luôn import trực tiếp từ Nguồn Thật (True Origin) qua Path Alias.
- Cấm tạo Proxy Re-export trung gian hoặc giữ lại Shim để "tương thích ngược" khi di chuyển vị trí file.

### 1.4. Khai Báo Props & Generics
- Khai báo interface rõ ràng cho Props, import trực tiếp `FC` và `ReactNode`:
```typescript
import { FC, ReactNode } from 'react';
import { Product } from '@core/types';

export interface ProductCardProps {
  product: Product;
  onSelect?: (id: string) => void;
  children?: ReactNode;
  className?: string;
}

export const ProductCard: FC<ProductCardProps> = ({
  product,
  onSelect,
  children,
  className,
}) => {
  // ...
};
```

---

## 2. Tiêu Chuẩn React 19 & Next.js App Router

### 2.1. Phân Tách Server Components & Client Components
- **Route Adapters (`app/.../page.tsx`)**:
  - Bắt buộc là **Server Component**.
  - Cấm khai báo `"use client"`.
  - Cấm dùng React hooks (`useState`, `useEffect`, `useQuery`).
  - Nhiệm vụ: Gắn docblock `@OWNER`/`@TARGET`, bọc `ModuleGuard`, nhận URL params và render Feature Dashboard.
- **Feature UI Components (`features/<resource>/...`)**:
  - Khai báo `"use client"` ở đầu file khi cần xử lý tương tác, form input, state hoặc gọi Convex hooks (`useQuery`, `useMutation`).

### 2.2. Cấm Tuyệt Đối Namespace `React.` (Bắt Buộc Dùng Named Imports)
- **Cấm tuyệt đối sử dụng tiền tố `React.`**: Cấm `React.FC`, `React.ReactNode`, `React.useState`, `React.useEffect`, `React.useMemo`, `React.useCallback`, `React.forwardRef`...
- **Luôn import trực tiếp các elements / types tương ứng**:
  - `import { FC, ReactNode, useState, useMemo, useCallback } from 'react';`
- **Không import `React` mặc định**: Không viết `import React from 'react';` dư thừa.

### 2.3. Trách Nhiệm Đơn Lẻ (Single Responsibility) & Cấm File Nguyên Khối
- Mỗi file chỉ chứa 1 component chính.
- Cấm gom code thành các file 200 - 300 dòng; luôn chia nhỏ thành sub-components trong thư mục `components/` của feature.
- Bảng biểu, form, thanh lọc phải được tách riêng: `<Resource>Table.tsx`, `<Resource>Filter.tsx`, `form/<Resource>Form.tsx`.

### 2.4. Form Validation: React Hook Form + Zod 4
- Mọi form nhập liệu đều phải validate qua schema Zod được định nghĩa rõ ràng:
```tsx
import { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, Input } from '@ui/components';

export const productSchema = z.object({
  name: z.string().min(2, 'Tên tối thiểu 2 ký tự'),
  price: z.number().positive('Giá phải lớn hơn 0'),
  sku: z.string().optional(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

export const ProductForm: FC<{ onSubmit: (data: ProductFormValues) => void }> = ({ onSubmit }) => {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: '', price: 0 },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      <Input {...form.register('name')} placeholder="Tên sản phẩm" />
      <Input type="number" {...form.register('price', { valueAsNumber: true })} placeholder="Giá" />
      <Button type="submit">Lưu sản phẩm</Button>
    </form>
  );
};
```

---

## 3. Tiêu Chuẩn Styling & Tailwind CSS 4

### 3.1. Nhất Quán Design Tokens & Cấm Arbitrary Colors
- Dự án sử dụng hệ thống Design Tokens từ `@ui`:
  - **Radius**: Sử dụng các token định sẵn (`rounded-lg`, `rounded-xl`, `rounded-2xl`).
  - **Màu sắc ngữ nghĩa**: `primary`, `slate`, `emerald` (Success), `amber` (Warning), `rose` (Danger/Error).
- **Cấm viết mã hex tùy tiện** (như `bg-[#1a2b3c]`) trong JSX; mọi màu sắc phải tuân thủ tokens hệ thống.
- **Phân tầng Z-Index (5 tầng quy chuẩn)**:
  1. Base content: `z-0`
  2. Sticky headers / Nav: `z-10`
  3. Dropdowns / Popovers: `z-20`
  4. Modals / Dialogs / Backdrops: `z-50`
  5. Toasts / Tooltips: `z-60`

### 3.2. Tiện Ích Merge ClassName `cn()`
- Luôn sử dụng hàm `cn()` từ `@ui/lib/utils` khi nối chuỗi className hoặc ghi đè style qua props:
```tsx
import { FC, ReactNode } from 'react';
import { cn } from '@ui/lib/utils';

export const CardWrapper: FC<{ className?: string; children?: ReactNode }> = ({ className, children }) => {
  return (
    <div className={cn('rounded-2xl bg-white p-6 shadow-sm border border-slate-100', className)}>
      {children}
    </div>
  );
};
```

---

## 4. Biểu Tượng (Icons)

- Sử dụng thư viện **`lucide-react`** làm chuẩn biểu tượng toàn hệ thống.
- Quy chuẩn kích thước icon đồng bộ:
  - `h-4 w-4`: Nút bấm, tags, badge, dropdown items.
  - `h-5 w-5`: Tiêu đề danh mục, section headings, card headers.
  - `h-6 w-6`: Hero banner, splash screen, top-level navigation indicators.
