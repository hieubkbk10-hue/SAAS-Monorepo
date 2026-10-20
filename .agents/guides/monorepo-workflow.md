# Cẩm Nang: Vận Hành Monorepo (Workflows, Scripts & Dependencies)

Tài liệu này hướng dẫn chi tiết quy trình làm việc với **Turborepo** và **pnpm workspaces** (hoặc runtime **Bun**) trong hệ sinh thái **SaaS Monorepo Boilerplate**.

---

## 1. Khởi Chạy Môi Trường Phát Triển (Dev Server)

### 1.1. Chạy Toàn Bộ Hệ Thống Song Song
```bash
# Khởi chạy tất cả các portals và Convex dev server
pnpm dev

# Mở mạng LAN (để test trên thiết bị di động trong cùng mạng Wi-Fi)
pnpm dev:host
```

Cổng truy cập mặc định:
- **Cổng Khách Cuối (`apps/site`)**: [http://localhost:3000](http://localhost:3000)
- **Cổng Quản Trị Tenant (`apps/admin`)**: [http://localhost:3001](http://localhost:3001)
- **Cổng Siêu Quản Trị (`apps/system`)**: [http://localhost:3002](http://localhost:3002)

### 1.2. Khởi Chạy Riêng Biệt Từng Ứng Dụng Hoặc Backend
```bash
# Chỉ chạy Cổng Khách Cuối
pnpm --filter @saas/site dev

# Chỉ chạy Cổng Quản Trị Tenant
pnpm --filter @saas/admin dev

# Chỉ chạy Cổng Siêu Quản Trị
pnpm --filter @saas/system dev

# Chỉ chạy Convex Backend Dev Server
pnpm --filter @saas/backend dev
```

---

## 2. Kiểm Tra Chất Lượng Mã Nguồn (Validation Pipeline)

Luôn chạy các lệnh kiểm tra sau trước khi tạo commit hoặc mở pull request:

```bash
# 1. Kiểm tra 100% lỗi TypeScript trên toàn bộ apps và packages
pnpm type-check

# 2. Biên dịch toàn bộ mã nguồn ra bundle production (qua Turbo Pipeline Cache)
pnpm build

# 3. Kiểm tra chất lượng code và ranh giới kiến trúc với ESLint 9 + Viet-Lint
pnpm lint

# 4. Tự động sửa lỗi lint và định dạng code
pnpm lint:fix
```

---

## 3. Quản Lý Dependencies (Thêm / Xóa Thư Viện)

> [!NOTE]
> Mặc dù trong mã nguồn (câu lệnh `import`) luôn sử dụng Path Alias chuẩn (`@ui/*`, `@backend/*`, `@core/*`), khi thao tác với package manager pnpm, bạn sử dụng cờ `--filter` theo đúng tên package khai báo trong `package.json`.

Luôn đứng tại thư mục gốc Monorepo và sử dụng cờ `--filter`:

### 3.1. Thêm Thư Viện Vào Ứng Dụng Cụ Thể
```bash
# Cài đặt thư viện vào apps/admin
pnpm add <package-name> --filter @saas/admin

# Cài đặt devDependencies vào apps/site
pnpm add -D <package-name> --filter @saas/site
```

### 3.2. Thêm Thư Viện Vào Packages Dùng Chung
```bash
# Cài đặt vào packages/ui (Design System)
pnpm add <package-name> --filter @saas/ui

# Cài đặt vào packages/core (Contracts, Types, Presets)
pnpm add <package-name> --filter @saas/core

# Cài đặt vào packages/backend (Convex functions, helpers)
pnpm add <package-name> --filter @saas/backend
```

### 3.3. Thêm Thư Viện Toàn Cục (Root Monorepo Tooling)
Chỉ dùng cho các công cụ tooling dùng chung cho cả repo (như Turbo, TypeScript, Prettier):
```bash
pnpm add -D -w <tool-name>
```

---

## 4. Xóa Cache Khi Gặp Xung Đột (Troubleshooting)

Khi gặp lỗi không đồng bộ cache của Turbo hoặc node_modules:
```bash
# Xóa build cache của turbo
pnpm clean

# Xóa toàn bộ node_modules và cài đặt lại sạch
pnpm install --force
```
