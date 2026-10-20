# LMS Monorepo Frontend System

Kiến trúc **Monorepo** chuẩn doanh nghiệp cho hệ thống Đào tạo & Quản lý Học tập trực tuyến (**Learning Management System - LMS**), được xây dựng bằng **Turborepo**, **pnpm workspaces**, **Vite**, **React 19**, **TypeScript** và **Tailwind CSS**.

---

## 🏗️ Cấu trúc Kiến trúc (Project Structure)

```text
lms-system-fe/
├── .agents/                     # Quy chuẩn kiến trúc & Cẩm nang phát triển (Rules & Guides)
│   ├── AGENTS.md                # Tài liệu quy định tổng quan
│   ├── rules/                   # Quy chuẩn bắt buộc (Architecture, Coding Standards, State & API)
│   └── guides/                  # Hướng dẫn chi tiết (Create Feature, Add UI, Monorepo Workflow)
│
├── apps/
│   ├── web/                     # Cổng Học Viên (Student / Learner Portal - Port 5173)
│   │   ├── src/features/        # Feature-based: home, courses, learning
│   │   ├── src/components/      # Layout components: Header, Footer
│   │   └── vite.config.ts
│   │
│   └── admin/                   # Cổng Nhân Sự Hệ Thống (Staff & Admin Portal - Port 5174)
│       ├── src/features/        # Feature-based: dashboard, courses, students, staff
│       ├── src/components/      # Layout components: AdminLayout, AdminSidebar, AdminHeader
│       └── vite.config.ts
│
├── packages/
│   ├── ui/                      # Shared Design System (Button, Badge, Card, Input, Avatar, ProgressBar, utils)
│   ├── types/                   # Shared TypeScript Types & Models (Roles, Course, Lesson, Quiz, Progress, API)
│   ├── api-client/              # Redux Toolkit Base API, RTK Query Services & Mock Data
│   ├── tailwind-config/         # Shared Tailwind CSS Design Tokens & Palette
│   ├── typescript-config/       # Base, React & Node TSConfigs
│   └── eslint-config/           # Cấu hình chuẩn hóa code
│
├── package.json                 # Root scripts & workspace definitions
├── pnpm-workspace.yaml          # Quản lý danh sách package trong monorepo
├── turbo.json                   # Pipeline caching cấu hình Turborepo
└── README.md
```

---

## 👥 Phân quyền Vai trò Hệ thống (Role-Based Access Control)

Cổng `apps/admin` tích hợp thanh chuyển đổi vai trò (Role Switcher) cho phép kiểm thử trực tiếp trải nghiệm của:
1. **Quản trị viên (ADMIN)**: Toàn quyền quản trị tài khoản, khóa học và số liệu doanh thu.
2. **Giảng viên (INSTRUCTOR)**: Soạn bài giảng, giáo trình, theo dõi lớp học.
3. **Phòng Đào tạo (TRAINING_STAFF)**: Duyệt bài giảng, kiểm duyệt ngân hàng câu hỏi, tổ chức kỳ thi.
4. **Tư vấn viên (ADVISOR)**: Tiếp nhận học viên mới, tư vấn lộ trình học tập.

Trong khi đó, `apps/web` là không gian học tập trực quan của **Học viên (STUDENT)** với trải nghiệm học bài giảng video, đánh dấu tiến độ và quản lý khóa học cá nhân.

---

## 🚀 Hướng dẫn Cài đặt & Khởi chạy

### 1. Yêu cầu môi trường
- **Node.js**: >= 20.x (đã kiểm thử trên Node v24)
- **pnpm**: >= 9.x (khuyến nghị pnpm 10+)

### 2. Cài đặt dependencies
```powershell
pnpm install
```

### 3. Khởi chạy toàn bộ môi trường phát triển (Chạy song song cả 2 App)
```powershell
pnpm dev
# hoặc
pnpm turbo run dev
```

Sau khi chạy lệnh:
- **Cổng Học Viên (apps/web)**: Mở trình duyệt tại [http://localhost:5173](http://localhost:5173)
- **Cổng Nhân Sự / Admin (apps/admin)**: Mở trình duyệt tại [http://localhost:5174](http://localhost:5174)

---

## 🛠️ Các lệnh hữu ích (Workspace Scripts)

| Lệnh | Ý nghĩa |
| :--- | :--- |
| `pnpm dev` | Chạy dev server đồng thời cho cả `web` và `admin` |
| `pnpm build` | Biên dịch bundle tối ưu cho production qua Turborepo cache |
| `pnpm type-check` | Kiểm tra lỗi TypeScript nghiêm ngặt trên toàn bộ 7 packages |
| `pnpm --filter @lms/web dev` | Chỉ chạy riêng ứng dụng học viên |
| `pnpm --filter @lms/admin dev` | Chỉ chạy riêng ứng dụng quản trị |
| `pnpm --filter @lms/ui type-check` | Kiểm tra type riêng cho thư viện UI |

---

## 📦 Cách sử dụng Shared Packages

### Sử dụng Shared UI Components:
```tsx
import { Button, Card, Badge, ProgressBar } from '@lms/ui';

export function Example() {
  return (
    <Card className="p-4">
      <Badge variant="success">Hoàn thành</Badge>
      <ProgressBar value={75} showLabel />
      <Button variant="primary">Tiếp tục học</Button>
    </Card>
  );
}
```

### Sử dụng Shared Types & Enums:
```typescript
import { UserRole, Course, LessonType } from '@lms/types';

const role: UserRole = UserRole.INSTRUCTOR;
```

### Sử dụng RTK Query Hooks:
```tsx
import { useGetCoursesQuery, useGetCourseBySlugQuery, useCreateCourseMutation } from '@lms/api-client';

export function CourseList() {
  const { data: courses, isLoading, isError } = useGetCoursesQuery();

  if (isLoading) return <div>Đang tải khóa học...</div>;
  if (isError) return <div>Lỗi tải dữ liệu</div>;

  return (
    <ul>
      {courses?.map(course => (
        <li key={course.id}>{course.title}</li>
      ))}
    </ul>
  );
}
```

### Sử dụng Typed Redux Hooks (trong apps/web hoặc apps/admin):
```tsx
import { useAppDispatch, useAppSelector } from './store';
```
