# VietAdmin — Tổng quan dự án

VietAdmin là nền tảng quản trị website + bán hàng, cấu hình theo ngành. Một codebase phục vụ nhiều loại hình kinh doanh: blog, landing, catalog, shop, dịch vụ, khóa học, đặt lịch.

Nguồn: `package.json`, `convex/schema.ts`, `convex/seeders/adminModules.seeder.ts`, `convex/seeders/systemPresets.seeder.ts`, `features/*/module.contract.ts`, `lib/seed-templates/index.ts`, `AGENTS.md`.

---

## Công nghệ đang dùng

| Lớp | Công nghệ | Phiên bản (package.json) |
| --- | --- | --- |
| App | Next.js App Router | 16.2.7 |
| UI | React | 19.2.3 |
| Ngôn ngữ | TypeScript | 5.x |
| Backend + DB | Convex (realtime query/mutation/action) | 1.45.0 |
| CSS | Tailwind CSS | 4.x |
| Component | Shadcn UI / Radix | — |
| Runtime cài đặt | Bun (khuyến nghị), Node 20+ | — |
| Form / validate | react-hook-form, Zod 4 | — |
| Editor | Lexical | 0.39 |
| Auth mật khẩu | bcryptjs | — |
| Email | Resend (`@convex-dev/resend`), Nodemailer | — |
| Rate limit | `@convex-dev/rate-limiter` | — |
| File | Convex storage + `@gilhrpenner/convex-files-control` | — |
| Test | Vitest 4 | — |
| Lint | ESLint 9, oxlint, viet-lint (kiến trúc) | — |

Backend **chỉ** Convex trong `convex/`. Không ORM, API server hay database ngoài.

Thư viện chuyên biệt khác: Leaflet (bản đồ), Three.js, PDF (`react-pdf` / pdfjs / jsPDF), flipbook (`react-pageflip`), ExcelJS, Recharts, Motion, Embla carousel, APCA (`apca-w3`) cho contrast màu.

---

## Cách chia theo khách hàng

Có **hai trục**: vai trò người dùng trên hệ thống, và loại hình kinh doanh khi triển khai.

### 1. Ba vai trò trên sản phẩm

```text
Khách cuối          Admin tenant           Super admin hệ thống
/(site)             /admin                 /system
─────────────────────────────────────────────────────────────
Xem nội dung        CRUD nội dung          Bật/tắt module
Mua / đặt lịch      Đơn hàng, khách        Preset + experience
Tài khoản cá nhân   RBAC trong tenant      Seed, SEO hệ thống
```

| Vai trò | Route | Session | Việc chính |
| --- | --- | --- | --- |
| Khách cuối | `app/(site)/` | `customerSessions` | Duyệt site, giỏ hàng, checkout, tài khoản, wishlist, khóa học, đặt lịch |
| Admin tenant | `app/admin/` | `userSessions` + `roles.permissions` | Soạn nội dung, đơn hàng, khách hàng, homepage, media |
| Super admin | `app/system/` | `systemSessions` (env `SYSTEM_EMAIL` / `SYSTEM_PASSWORD`) | Module, experience UI, preset, seed, tích hợp, mini-app |

Ba nhóm **tách bảng và session**. `users` ≠ `customers`. Admin không dùng session khách; `/system` không dùng RBAC tenant.

### 2. Gói triển khai theo loại hình (preset)

`systemPresets` — bật sẵn tổ hợp module:

| Preset | Key | Module bật | Phù hợp |
| --- | --- | --- | --- |
| Blog / News | `blog` | posts, comments, media, customers, users, roles, settings, menus, homepage, analytics | Tin tức, blog |
| Landing Page | `landing` | posts, media, users, roles, settings, menus, homepage | Trang giới thiệu |
| Catalog | `catalog` | products, media, customers, users, roles, settings, menus, homepage, notifications, analytics | Trưng bày, không giỏ |
| eCommerce Basic | `ecommerce-basic` | catalog + orders + cart | Shop tối thiểu |
| eCommerce Full (mặc định) | `ecommerce-full` | basic + posts, comments, wishlist, promotions | Shop đủ voucher + yêu thích |

Module `isCore` luôn giữ: `users`, `settings`. Module khác bật/tắt theo preset hoặc tay trong `/system/modules`.

### 3. Mẫu ngành (industry template)

44 template trong `lib/seed-templates/industries/` — seed dữ liệu + asset `/seed_mau/`:

| Nhóm | Template |
| --- | --- |
| Thời trang / làm đẹp | fashion, cosmetics, jewelry, perfume, lingerie, beauty-spa, massage, hair-salon |
| Công nghệ | tech, electronics, ai-accounts, gaming-accounts, appliances |
| F&B | restaurant, cafe, food, seafood, bakery |
| Sức khỏe | healthcare, pharmacy, fitness, gym, yoga, vet |
| Nhà / trẻ / văn phòng | home-furniture, baby-care, books, stationery, gifts, handicraft |
| Xe / nhạc | auto, auto-parts, music-instruments |
| Du lịch | travel, hotel |
| B2B / xây dựng | business, manufacturing, construction, real-estate, design-services, environment |
| Giáo dục / khác | courses, affiliate-shop, multi-category |

Một khách triển khai = 1 preset module + 1 industry template + cấu hình experience (layout list/detail).

---

## Chức năng đã có

### A. Site công khai (`app/(site)/`)

| Nhóm | Route | Việc khách làm được |
| --- | --- | --- |
| Trang chủ | `/` | Render `homeComponents` theo thứ tự |
| Bài viết | `/posts`, `/posts/[slug]` | Danh sách + chi tiết, comment |
| Sản phẩm | `/products`, `/products/[slug]` | Lọc, variant, so sánh `/compare` |
| Dịch vụ | `/services`, `/services/[slug]` | Catalog dịch vụ |
| Dự án | `/projects`, `/projects/[slug]` | Portfolio |
| Khóa học | `/khoa-hoc`, `/courses` + bài học | Curriculum, lock wall, tiến độ |
| Tài nguyên | `/resources`, `/resources/[slug]` | Tài liệu / download |
| Catalog PDF | `/catalogs`, `/catalogs/[slug]` | Flipbook |
| Thương mại | `/cart`, `/checkout`, `/wishlist`, `/promotions` | Giỏ, thanh toán, yêu thích, voucher |
| Đặt lịch | `/book` | Booking theo experience `booking_ui` |
| Tài khoản | `/account/login`, `register`, `profile`, `orders` | Hồ sơ + đơn |
| Tra cứu | `/tra-cuu-don-hang`, `/search` | Đơn không login, tìm kiếm |
| Tin cậy | `/about`, `/faq`, `/terms`, `/privacy`, `/shipping`, `/payment`, `/return-policy` | 7 trang `pages` |
| Liên hệ / cửa hàng | `/contact`, `/stores` | Form inbox + địa điểm |
| Marketing site | `/features`, `/solutions`, `/use-cases`, `/guides`, `/integrations`, `/templates` | Trang sản phẩm VietAdmin |
| Mini-app | `/pokemon-champions` | Game tách khỏi core |
| Lỗi | `/errors/[code]` | Experience `error_pages_ui` |

Routing IA: unified slug `[categorySlug]/[recordSlug]` hoặc namespaced, cấu hình trong system.

### B. 39 feature module admin (`features/*/`)

Mỗi feature có `module.contract.ts` + `*Dashboard.tsx`. Products/Variants là mẫu chuẩn (`AGENTS.md` §11).

**Nội dung**

| Feature | Việc làm |
| --- | --- |
| `posts` + `post-categories` | Bài viết, danh mục cây, SEO, FAQ, markdown/html |
| `services` + `service-categories` | Dịch vụ |
| `projects` + `project-categories` | Dự án, gallery, video |
| `courses` + `course-categories` | Khóa, chapter, lesson, học viên, filter |
| `resources` + `resource-categories` | Tài nguyên, quyền tải |
| `catalogs` | PDF flipbook |
| `comments` + `reviews` | Bình luận polymorphic (post/product/service/course) + rating |
| `media` | Thư viện file, folder, usage, draft upload |
| `trust-pages` | 7 trang tin cậy (`pages`) |
| `categories` | Danh mục dùng chung (khi module gom) |

**Thương mại**

| Feature | Việc làm |
| --- | --- |
| `products` | Sản phẩm, combo, digital delivery, SEO, tồn kho |
| `product-categories` | Danh mục cây + FAQ/suffix theo category |
| `product-options` | Option + value (swatch, dropdown, input) |
| `product-types` | Loại sản phẩm + khoảng giá |
| `attribute-groups` | Nhóm thuộc tính + term (lọc) |
| `orders` | Đơn, trạng thái preset, tracking |
| `cart` | Giỏ admin-view, expiry/note (feature flag) |
| `wishlist` | Yêu thích, note, notification |
| `promotions` | Voucher: percent, fixed, buy_x_get_y |
| `bookings` | Lịch hẹn + timezone |
| `subscriptions` | Gia hạn subscription khách |

**Người dùng & hệ thống**

| Feature | Việc làm |
| --- | --- |
| `customers` | Khách, địa chỉ 2/3 cấp VN, chi tiêu |
| `users` | Admin tenant, status, trial super-admin |
| `roles` | RBAC `permissions: Record<module, actions[]>` |
| `profile` | Hồ sơ admin đang đăng nhập |
| `dashboard` | Tổng quan admin |
| `settings` | General / contact / SEO / advanced |
| `menus` | Menu header/footer cây |
| `homepage` + `home-components` | Block trang chủ + snapshot demo |
| `notifications` | Thông báo draft/schedule/sent |
| `contact-inbox` | Tin nhắn form liên hệ |
| `mini-apps` | App phụ (Telegram bot, Pokemon, mini-game) |

### C. Module bật/tắt (`adminModules` seeder — 24 key)

`posts`, `comments`, `media`, `products`, `orders`, `cart`, `wishlist`, `customers`, `users`, `roles`, `settings`, `menus`, `homepage`, `contactInbox`, `notifications`, `promotions`, `analytics`, `services`, `projects`, `courses`, `resources`, `miniApps`, `catalogs`, `subscriptions`.

`bookings` đã có feature + `/system/modules/bookings` + `lib/modules/configs/bookings.config.ts`, chưa nằm trong danh sách seeder 24 key.

Mỗi module có:

- `moduleFields` — field động (text, price, image, …)
- `moduleFeatures` — flag tính năng (sale price, gallery, SKU, …)
- `moduleSettings` — số trang, timezone, …

Cấu hình TypeScript: `lib/modules/configs/*.config.ts`.

### D. Experience UI (`/system/experiences`)

Layout list/detail **không hard-code**. Super admin chỉnh, site đọc `settings` key `*_ui`:

| Experience | Key settings |
| --- | --- |
| Bài viết list/detail | `posts_list_ui`, `posts_detail_ui` |
| Sản phẩm list + product-detail | `products_list_ui` |
| Dịch vụ / dự án / khóa / tài nguyên list+detail | `services_*`, `projects_*`, `courses_*`, `resources_*`, `lesson_detail_ui` |
| Search | `search_filter_ui` |
| Cart / checkout / wishlist | `cart_ui`, `checkout_ui`, `wishlist_ui` |
| Booking | `booking_ui` |
| Account orders / profile | `account_orders_ui`, `account_profile_ui` |
| Error pages, menu, contact, comments, promotions | các page tương ứng trong `app/system/experiences/` |

Hook đọc: `lib/experiences/useSiteConfig.ts`. Nút giỏ/wishlist/badge khuyến mãi **AND** với module `enabled`.

### E. Home components (35 loại)

Tạo/sửa tại `/admin/home-components/create/<type>`:

about, benefits, blog, career, case-study, category-products, clients, contact, countdown, cta, custom-home, faq, features, footer, gallery, hero, homepage-category-hero, marquee, partners, pokemon-champions, popup, pricing, process, product-categories, product-grid, product-list, service-list, services, speed-dial, stats, team, testimonials, trust-badges, video, voucher-promotions.

Preview admin và runtime site dùng renderer chung (parity màu dual-brand, APCA). Snapshot (`homeComponentSnapshots`) để demo layout.

### F. Super admin `/system` — ngoài module/experience

- `/system/modules` — bật module, field, feature
- `/system/data` — seed (số lượng, preset, industry, force)
- `/system/admin-config` — cấu hình admin UI
- `/system/seo` — SEO hệ thống
- `/system/integrations` — tích hợp
- `/system/ia` — information architecture / routing
- `/system/mini-apps` — registry mini-app
- `/system/home-components` — quản trị block cấp hệ thống
- `/system/huong-dan` — hướng dẫn vận hành

### G. Năng lực kỹ thuật đi kèm chức năng

- RBAC theo module + action; `ModuleGuard` trên route admin
- SEO per-record: metaTitle, metaDescription, focusKeyword, FAQ
- Dual-brand color + APCA contrast trên home components
- Digital product: account / license / download / custom
- Variant + attribute filter (kiểu rượu/ngành hàng)
- Email dispatch log + quota ngày/tháng
- Rate limit mutation
- Counter tables (`*Stats`) tránh full scan
- Seed tiếng Việt, dependency graph, batch insert

---

## Kiến trúc codebase

### 1. Ba tầng bắt buộc (vietadmin-feature-first)

```text
app/admin/<resource>/page.tsx     Route adapter — Server Component, không hook
        │  ModuleGuard + params
        ▼
features/<resource>/              UI, state, form, hook, mapper
        │  chỉ import @/convex/_generated/api
        ▼
convex/<resource>.ts              Query / mutation / action + schema
```

- Route adapter: cấm `"use client"`, cấm `useQuery`/`useState`. Docblock `@OWNER` / `@TARGET`.
- Feature: cấm import chéo `features/A` → `features/B`. Create/Edit dùng chung `components/form/`.
- Convex: `args` + `returns` validator; mặc định `internal*`; đọc bằng `.withIndex`; cấm `.collect()` bảng lớn; I/O ngoài chỉ trong action.

Mẫu chuẩn: `features/products` + `app/admin/products`.

Site public (`app/(site)`) đang mỏng hóa theo cùng hướng (Phase 6): page mỏng, renderer trong `components/site/` và shared section của từng home-component.

### 2. Cây thư mục

```text
app/
  (site)/          Khách cuối
  admin/           Admin tenant (route mỏng + ui shadcn)
  system/          Super admin
features/          39 module UI
convex/            schema, functions, seeders
lib/
  modules/         defineModule + configs + runtime
  experiences/     hook đọc *_ui
  seed-templates/  44 ngành
  home-components/ color-system dùng chung
components/site/   renderer runtime
core/              domain thuần (orders statuses, product aspect, …)
.factory/          standards + skills (không phải runtime)
```

### 3. Module runtime

Luồng bật tính năng:

1. `adminModules.enabled` — module có mặt trên admin/site hay không
2. `moduleFeatures.enabled` — flag nhỏ trong module (SKU, note giỏ, …)
3. `settings[key=*_ui]` — layout experience
4. Feature hook AND các cờ trên trước khi hiện nút (ví dụ Add to cart cần `cart` + `orders`)

`defineModuleWithRuntime` trong `lib/modules/define-module.ts` khai báo field/feature/setting; seeder đẩy vào Convex.

### 4. Schema Convex — 3 mức

**Level 1 — cấu hình hệ thống:** `adminModules`, `moduleFields`, `moduleFeatures`, `moduleSettings`, `systemPresets`, `systemSessions`, `rateLimitBuckets`, `usageStats`, `convexDashboard`.

**Level 2 — dữ liệu tenant:** `users`/`roles`, `customers` + session/OTP, products + variants + attributes, posts/pages/comments, media, menus, `homeComponents` + snapshots, orders/cart/wishlist, promotions, services/projects/courses/resources, bookings, catalogs, notifications, contact inbox, mini-apps (telegram, pokemon, mini-games), analytics pageviews, email logs, seedProgress.

**Thống kê:** các bảng `*Stats` (user, product, media, promotion, …) giữ counter, không scan bảng gốc.

### 5. Hợp đồng & chất lượng

- Contract: `features/<x>/module.contract.ts` (owner, route, permission).
- Convex: 100% registered function có `args`/`returns` (phase 8).
- Design token: cấm arbitrary color; radius 4 token; z-index 5 tầng (phase 7).
- Gate CI: `bun run lint:arch` (viet-lint preset ci), typecheck, vitest coverage (phase 9).
- Source of truth agent: `AGENTS.md` — KISS, surgical diff, không tự commit/push.

### 6. Luồng request điển hình

```text
Khách /products
  → Server page (site)
  → Client list đọc useProductsListConfig()
  → settings.products_list_ui + adminModules.wishlist/promotions/cart
  → convex products.paginate by index
  → UI ẩn/hiện nút theo cờ

Admin /admin/products
  → Route adapter + ModuleGuard(products)
  → ProductsDashboard (feature)
  → useQuery(api.products.*)

System /system/modules/products
  → bật field/feature/setting
  → ghi moduleFields / moduleFeatures
  → admin form và site ẩn field tương ứng
```

---

## Ranh giới cố ý

- Một deployment Convex = một tenant website. Multi-tenant DB chưa tách.
- `/system` là cửa siêu quản trị, không phải CMS nội dung hàng ngày.
- Mini-app (Pokemon, Telegram bot) cố ý ngoài module core để thử nghiệm không làm phình schema chính.
- Harmony màu homepage là nội bộ (normalize mặc định), không phải knob admin.

Số liệu inventory (2026-09-20, `reports/phase0-inventory.md`): 39 feature, ~58 page site, ~194 page admin, ~60 page system. Số page đổi theo thời gian; danh sách module/feature ở trên lấy từ contract + seeder hiện tại.
