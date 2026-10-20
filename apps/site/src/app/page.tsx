import { Button, Card, Badge } from '@ui/primitives';
import { ShoppingBag, Sparkles } from 'lucide-react';

export default function HomePage() {
  return (
    <main className="max-w-5xl mx-auto px-4 py-16 space-y-8">
      <div className="text-center space-y-4">
        <Badge variant="primary" className="mb-2">
          <Sparkles className="w-3.5 h-3.5 mr-1" />
          Client Portal (apps/site)
        </Badge>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          SaaS Client Experience
        </h1>
        <p className="text-lg text-slate-600 max-w-2xl mx-auto">
          Cổng khách hàng công khai — xem catalog, bài viết, đặt hàng, giỏ hàng và tài khoản cá nhân.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Khách Hàng (client)</h2>
              <p className="text-sm text-slate-500">Xác thực qua clientSessions</p>
            </div>
          </div>
          <p className="text-slate-600 text-sm">
            Tách biệt hoàn toàn với tài khoản quản trị nội bộ. Dữ liệu lưu trữ trong bảng <code className="text-xs bg-slate-100 p-1 rounded font-mono">clients</code>.
          </p>
          <Button variant="primary" size="md">
            Khám phá tính năng
          </Button>
        </Card>

        <Card className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Experience UI Động</h2>
              <p className="text-sm text-slate-500">Cấu hình từ superAdmin</p>
            </div>
          </div>
          <p className="text-slate-600 text-sm">
            Layout danh sách, chi tiết và nút mua sắm được điều khiển động qua cài đặt settings <code className="text-xs bg-slate-100 p-1 rounded font-mono">*_ui</code>.
          </p>
          <Button variant="outline" size="md">
            Xem tài liệu
          </Button>
        </Card>
      </div>
    </main>
  );
}

