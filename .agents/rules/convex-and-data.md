# Quy Tắc Dữ Liệu & Backend: Convex Functions, Indexing & Realtime Flow

Tài liệu này quy định các tiêu chuẩn bắt buộc khi phát triển cơ sở dữ liệu và xử lý logic backend với **Convex** trong `packages/backend/convex/`.

---

## 1. Nguyên Tắc Cốt Lõi: Backend Thuần Convex

- Hệ thống **chỉ sử dụng Convex** làm Backend và Database trong `packages/backend/convex/`.
- Tuyệt đối không sử dụng ORM (Prisma, Drizzle), server REST API riêng biệt hay database bên ngoài.
- Dữ liệu client được đồng bộ theo cơ chế Realtime Reactive Queries mặc định của Convex.

---

## 2. Quy Chuẩn Khai Báo Hàm Convex (Query, Mutation, Action)

### 2.1. Phân Loại 3 Dạng Hàm
1. **`query` / `internalQuery`**:
   - Chỉ đọc dữ liệu, hoàn toàn pure, không có side-effects.
   - Kết quả được Convex tự động cache và đẩy realtime về client khi dữ liệu thay đổi.
2. **`mutation` / `internalMutation`**:
   - Ghi dữ liệu mang tính giao dịch ACID, deterministic, thực thi nhanh.
   - Cấm gọi mạng (network I/O), cấm dùng `fetch` hoặc các hàm non-deterministic như `Math.random()`, `Date.now()` không qua `ctx`.
3. **`action` / `internalAction`**:
   - Dùng cho các tác vụ có side-effects: gọi API bên thứ ba (gửi email qua Resend, cổng thanh toán, gọi AI/LLM, webhook).
   - Action không thể đọc/ghi database trực tiếp mà phải thông qua `ctx.runQuery` hoặc `ctx.runMutation`.

### 2.2. Mặc Định Sử Dụng Hàm Nội Bộ (`internal*`)
- Mọi hàm backend mặc định nên là hàm nội bộ (`internalQuery`, `internalMutation`, `internalAction`) trong `packages/backend/convex/`.
- Chỉ xuất khẩu ra hàm công khai (`query`, `mutation`, `action`) khi client thực sự cần gọi trực tiếp.

### 2.3. Bắt Buộc 100% Validator `args` và `returns`
- Mọi hàm Convex đăng ký đều bắt buộc phải định nghĩa validator đầy đủ cho cả tham số đầu vào (`args`) và giá trị trả về (`returns`) sử dụng `v` từ `convex/values`:

```typescript
// packages/backend/convex/products.ts
import { v } from 'convex/values';
import { query, mutation } from './_generated/server';

export const getById = query({
  args: {
    productId: v.id('products'),
  },
  returns: v.union(
    v.null(),
    v.object({
      _id: v.id('products'),
      _creationTime: v.number(),
      name: v.string(),
      slug: v.string(),
      price: v.number(),
      status: v.union(v.literal('draft'), v.literal('published')),
    })
  ),
  handler: async (ctx, args) => {
    return await ctx.db.get(args.productId);
  },
});
```

---

## 3. Tối Ưu Hóa Chỉ Mục (Indexing) & Cấm Full-Scan

### 3.1. Luôn Truy Vấn Bằng `.withIndex()`
- Mọi truy vấn lọc, tìm kiếm hoặc sắp xếp trên bảng dữ liệu đều phải thông qua chỉ mục được khai báo trong `schema.ts`:
```typescript
// schema.ts
export default defineSchema({
  products: defineTable({
    tenantId: v.string(),
    slug: v.string(),
    categorySlug: v.string(),
    status: v.string(),
  })
    .index('by_tenant_and_slug', ['tenantId', 'slug'])
    .index('by_category', ['tenantId', 'categorySlug']),
});

// Truy vấn chuẩn với index
const product = await ctx.db
  .query('products')
  .withIndex('by_tenant_and_slug', (q) =>
    q.eq('tenantId', tenantId).eq('slug', args.slug)
  )
  .unique();
```

### 3.2. Cấm Tuyệt Đối `.collect()` Trên Bảng Lớn
- **Nghiêm cấm** gọi `.collect()` không giới hạn trên các bảng dữ liệu người dùng (`products`, `orders`, `clients`, `posts`...).
- Với danh sách hiển thị, bắt buộc sử dụng phân trang `.paginate(args.paginationOpts)` kết hợp `usePaginatedQuery` trên client.
- Với trường hợp cần giới hạn số lượng nhỏ, dùng `.take(limit)`.

---

## 4. Bảng Thống Kê Counter (`*Stats`) Tránh Đếm Quét Bảng

- **Cấm đếm số lượng bằng cách quét bảng**: Tuyệt đối không làm `(await ctx.db.query('orders').collect()).length` để lấy tổng đơn hàng.
- **Duy trì bảng Counter**: Thiết kế bảng `*Stats` (ví dụ `orderStats`, `productStats`, `userStats`) lưu số đếm tổng hợp. Khi có mutation thêm hoặc xóa bản ghi, tự động cập nhật bộ đếm với độ phức tạp $O(1)$.

---

## 5. Giới Hạn Tần Suất (Rate Limiting) & Bảo Vệ Mutation

- Áp dụng `@convex-dev/rate-limiter` cho các mutation nhạy cảm:
  - Form liên hệ (`contactInbox`)
  - Xác thực / gửi mã OTP (`auth`, `clientSessions`)
  - Đặt hàng & thanh toán (`checkout`)
- Giúp bảo vệ hệ thống khỏi tấn công DoS, spam dữ liệu và hao hụt tài nguyên máy chủ.

---

## 6. Quy Tắc Sử Dụng Tại Frontend (Client Data Fetching)

1. **Sử Dụng Generated API**:
   - Luôn gọi API thông qua đối tượng `api` sinh bởi Convex:
     ```tsx
     import { useQuery, useMutation } from 'convex/react';
     import { api } from '@backend/convex/_generated/api';

     export const ProductDetail = ({ productId }) => {
       const product = useQuery(api.products.getById, { productId });
       const updateProduct = useMutation(api.products.update);

       if (product === undefined) return <LoadingSpinner />;
       if (product === null) return <NotFoundMessage />;
       return <div>{product.name}</div>;
     };
     ```
2. **Xử Lý Đầy Đủ Trạng Thái**:
   - `product === undefined`: Đang nạp dữ liệu (Loading).
   - `product === null` hoặc mảng rỗng: Không tìm thấy dữ liệu.
   - `product`: Đã có dữ liệu, render giao diện.
3. **Cấm Dùng `fetch` / `axios` Để Gọi Convex**:
   - Mọi kết nối với Convex phải thông qua WebSocket client của Convex React SDK để đảm bảo tính phản hồi realtime và tự động quản lý cache.

