# SaaS Monorepo Architecture & Development Rules (VietAdmin Paradigm)

Tài liệu này là chỉ dẫn cao nhất (Root Guidelines) cho các nhà phát triển và AI Assistant khi làm việc trong repository **SaaS Monorepo Boilerplate**. Nền tảng được kế thừa và chuẩn hóa từ kiến trúc **VietAdmin** — nền tảng quản trị website và kinh doanh đa ngành, cấu hình động theo module và experience. Mọi đóng góp mã nguồn mới bắt buộc phải tuân theo các quy tắc và cẩm nang bên dưới.

---

## 1. Bản Đồ Hệ Thống (Repository Map)

Dự án được quản lý dưới dạng Monorepo sử dụng **Turborepo** và **pnpm workspaces** (khuyến nghị runtime **Bun** hoặc Node 20+):

```text
saas-monorepo/
├── apps/
│   ├── site/                    # Cổng Khách Cuối (Customer Portal) - Xem nội dung, mua hàng, đặt lịch, tài khoản
│   ├── admin/                   # Cổng Quản Trị Tenant (Tenant Admin) - CRUD nội dung, đơn hàng, khách hàng, RBAC tenant
│   └── system/                  # Cổng Siêu Quản Trị (Super Admin) - Bật/tắt module, preset, seed, experience layout
│
├── packages/
│   ├── backend/                 # Convex Backend & Database (Schema, Queries, Mutations, Actions, Seeders)
│   ├── ui/                      # Shared Design System (Tailwind 4, Shadcn UI / Radix primitives, cn utility)
│   ├── core/                    # Domain Core: Module Contracts, Runtime Definitions, System Presets, Experience Configs, Types
│   ├── eslint-config/           # Cấu hình ESLint 9 Flat Config + Oxlint + Architectural Linting
│   └── typescript-config/       # Base, Next.js và Package tsconfig dùng chung
│
└── .agents/                     # Quy chuẩn mã nguồn & Hướng dẫn phát triển
    ├── AGENTS.md                # Tài liệu tổng quan (file hiện tại)
    ├── rules/                   # Các quy tắc kiến trúc và code bắt buộc
    └── guides/                  # Các bài hướng dẫn chi tiết từng bước
```

---

## 2. Công Nghệ Cốt Lõi (Core Tech Stack)

| Lớp | Công nghệ | Chi tiết |
| --- | --- | --- |
| **Monorepo Engine** | Turborepo + pnpm / Bun | Quản lý workspaces, pipeline cache tối ưu |
| **App Framework** | Next.js App Router 16+ | Server Components làm Route Adapters mỏng |
| **UI Library** | React 19 + TypeScript 5 | Strict typing, không dùng `any` |
| **Backend & Database** | Convex (1.45+) | Realtime queries, mutations, actions, internal functions, không ORM |
| **Styling & Components** | Tailwind CSS 4 + Shadcn / Radix | Design tokens chuẩn hóa, headless accessible primitives |
| **Form & Validation** | React Hook Form + Zod 4 | Type-safe form validation đồng bộ frontend & backend |
| **Auth & Sessions** | 3 bảng Session độc lập | `clientSessions`, `tenantSessions`, `superAdminSessions` |
| **Storage & Services** | Convex Storage + Resend / Rate Limiter | File upload quản trị, email transactional, rate limit |
| **Testing & Quality** | Vitest + ESLint 9 + Viet-Lint | Unit test, typecheck CI, kiểm tra ranh giới kiến trúc |

---

## 3. Nguyên Tắc Vàng (Golden Rules)

1. **Kiến Trúc 3 Tầng Bắt Buộc (vietadmin-feature-first)**:
   - **Tầng 1 - Route Adapter (`apps/*/app/.../page.tsx`)**: Luôn là Server Component mỏng, cấm `"use client"`, cấm `useQuery`/`useState`. Bọc `ModuleGuard` và khai báo docblock `@OWNER` / `@TARGET`.
   - **Tầng 2 - Feature Slice (`features/<resource>/`)**: UI, state form, custom hook, mapper. **Cấm tuyệt đối import chéo giữa các feature** (`features/A` $\rightarrow$ `features/B`).
   - **Tầng 3 - Backend Convex (`packages/backend/convex/<resource>.ts`)**: Toàn bộ backend xử lý qua Convex. 100% functions có `args` và `returns` validator. Đọc dữ liệu qua `.withIndex`. Cấm `.collect()` trên bảng lớn.
2. **Nguồn Chân Lý Duy Nhất (SSOT) & Ranh Giới Monorepo**:
   - **UI Primitives (0% nghiệp vụ)**: Nằm tại `packages/ui` (import qua alias `@ui/*`).
   - **Backend Data Layer**: Nằm tại `packages/backend` (import qua alias `@backend/*` hoặc `@backend/convex/_generated/api`).
   - **Core Domain Logic & Contracts**: Nằm tại `packages/core` (import qua alias `@core/*`).
   - **Cấm Tuyệt Đối Proxy & Backward-Compatibility Re-export**: Không tạo file trung gian re-export bắc cầu; khi di chuyển module phải trỏ thẳng về Nguồn Thật mới. Cấm import chéo giữa các app (`site`, `admin`, `system`).
3. **Quản Lý Trạng Thái Qua Convex & Realtime Flow**:
   - Mọi truy vấn và thay đổi dữ liệu máy chủ phải qua Convex hooks (`useQuery`, `useMutation`, `useAction`).
   - Không dùng `fetch` hay `axios` tùy tiện trong components.
   - Thống kê đếm dữ liệu sử dụng bảng counter (`*Stats`), tuyệt đối không full-scan bảng dữ liệu gốc.
4. **Hệ Thống Module Runtime & Experience Động**:
   - Mọi tính năng hoạt động qua 4 cấp cờ kiểm soát: `adminModules.enabled` $\rightarrow$ `moduleFeatures.enabled` $\rightarrow$ `moduleFields.enabled` $\rightarrow$ `settings[*_ui]`.
   - Giao diện public đọc layout động qua hook trải nghiệm (`useSiteConfig()`), không hard-code cấu trúc trang.
5. **Phân Quyền Bảo Mật 3 Tầng & Tách Biệt 3 Nhóm Session**:
   - Ba vai trò tách biệt cả route và bảng session: Khách (`client` - `clientSessions`), Nội bộ Tenant (`tenant` - `tenantSessions`), Quản trị SaaS (`superAdmin` - `superAdminSessions`).
   - Phân quyền tenant theo RBAC ma trận `permissions: Record<module, actions[]>`. Route admin bắt buộc bảo vệ bằng `ModuleGuard`.

---

## 4. Danh Mục Quy Tắc Chi Tiết (Rules Index - SSOT)

Đọc kỹ các quy tắc chuyên biệt trước khi triển khai hoặc chỉnh sửa mã nguồn:
- 📐 [rules/architecture.md](./rules/architecture.md): Chi tiết kiến trúc 3 vai trò, cấu trúc thư mục Feature-first, Module Contract, Experience UI động và ranh giới packages monorepo.
- 💻 [rules/coding-standards.md](./rules/coding-standards.md): Chuẩn mực viết code TypeScript 5, React 19, Server/Client Components, Next.js App Router, Tailwind CSS 4, Zod 4 và hệ thống Path Alias.
- ⚡ [rules/convex-and-data.md](./rules/convex-and-data.md): Quy ước hàm Convex (query, mutation, action), validator `args`/`returns`, index optimization, pagination, counter tables và rate-limit.
- 🛡️ [rules/authorization.md](./rules/authorization.md): Quy tắc bảo vệ 3 tầng, phân tách 3 sessions, RBAC Module + Actions và cơ chế `ModuleGuard`.

---

## 5. Danh Mục Cẩm Nang Hướng Dẫn (Guides Index)

Tham khảo quy trình thực hiện các tác vụ phát triển thường gặp:
- 🚀 [guides/create-new-feature.md](./guides/create-new-feature.md): Hướng dẫn 5 bước thêm mới một Feature Module hoàn chỉnh từ Module Contract, Convex Schema/Functions đến Feature UI và Route Adapter.
- 🎨 [guides/add-shared-ui-component.md](./guides/add-shared-ui-component.md): Hướng dẫn tạo mới UI Primitive Component trong `@ui` sử dụng Tailwind 4 và Radix.
- 🛠️ [guides/monorepo-workflow.md](./guides/monorepo-workflow.md): Hướng dẫn khởi chạy dev server 3 portal, mở mạng LAN, build, typecheck và quản lý dependencies Monorepo với pnpm/Bun.
- 🔄 [guides/manage-convex-data-flow.md](./guides/manage-convex-data-flow.md): Hướng dẫn luồng dữ liệu Convex, optimistic updates, pagination qua index và đọc cấu hình runtime module / experience UI.
- 🔐 [guides/implement-authorization.md](./guides/implement-authorization.md): Cẩm nang triển khai phân quyền, kiểm tra session, cấu hình RBAC theo module và gắn `ModuleGuard`.
