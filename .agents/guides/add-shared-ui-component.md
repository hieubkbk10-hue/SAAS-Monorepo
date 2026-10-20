# Cẩm Nang: Thêm Component Dùng Chung Vào `@ui/*`

Tài liệu này hướng dẫn quy trình tạo Component giao diện dùng chung trong Monorepo và cách xác định đúng vị trí lưu trữ theo nguyên tắc phân tầng kiến trúc.

---

## 1. Nguyên Tắc Phân Loại: Đặt Ở Đâu?

Trước khi tạo một component giao diện mới, hãy phân loại theo các tiêu chí sau:

| Loại Component | Đặc điểm | Nơi lưu trữ | Cách Import |
| --- | --- | --- | --- |
| **UI Primitive (Nguyên tử)** | Hoàn toàn phi nghiệp vụ (0% domain), headless accessible primitives (Radix UI), nút bấm, dialog, input, badge, drawer, switch | `packages/ui/src/components/` | `import { ... } from '@ui/components'` |
| **App Shell / Layout** | Khung sườn tổng thể của từng ứng dụng (Sidebar, Header, Footer) | `apps/<app>/src/shared/components/layout/` | `import { ... } from '@/shared'` |
| **Feature Component** | Giao diện gắn liền với một nghiệp vụ cụ thể (ProductCard, OrderStatusBadge, UserForm) | `features/<resource>/components/` | `import { ... } from '@/features/<resource>'` |

> [!IMPORTANT]
> **Tuyệt đối không đưa nghiệp vụ vào `@ui/*`**:
> Thư mục `packages/ui` chỉ chứa các UI components nguyên tử, không chứa bất kỳ logic gọi API Convex, không import contracts từ `@core`, và không phụ thuộc vào bất kỳ feature nào.

---

## 2. Quy Trình Thêm Primitive UI Vào `@ui/*`

### Bước 1: Tạo File Component
Tạo file tại `packages/ui/src/components/<ComponentName>.tsx` (ví dụ `Modal.tsx`):

```tsx
// packages/ui/src/components/Modal.tsx
import { FC, ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@ui/lib/utils';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export const Modal: FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Content */}
      <div
        className={cn(
          'relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl transition-all border border-slate-100',
          className
        )}
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          {title && <h3 className="text-lg font-bold text-slate-900">{title}</h3>}
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="pt-4">{children}</div>
      </div>
    </div>
  );
};
```

### Bước 2: Export Trong Barrel File
Mở `packages/ui/src/components/index.ts` và thêm export:
```typescript
export * from './Modal';
```

### Bước 3: Xác Minh & Sử Dụng
Kiểm tra type-check cho package UI:
```bash
pnpm --filter @saas/ui type-check
```

Sau khi hoàn tất, component có thể được import trực tiếp trong bất kỳ portal nào (`site`, `admin`, `system`):
```tsx
import { Modal, Button } from '@ui/components';
```
