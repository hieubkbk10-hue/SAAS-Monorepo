/**
 * @OWNER features/dashboard
 * @TARGET DashboardView
 */
import { ModuleGuard } from '@/shared/components/guards/ModuleGuard';
import { Card, Badge, Button } from '@ui/primitives';
import { BarChart3, Plus, ArrowUpRight } from 'lucide-react';

export default async function AdminDashboardPage() {
  return (
    <ModuleGuard module="dashboard" action="read">
      <div className="space-y-8 max-w-6xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              Quản Trị Doanh Nghiệp (Tenant)
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Quản lý tài nguyên, sản phẩm, đơn hàng và phân quyền nhân sự nội bộ tenant.
            </p>
          </div>
          <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
            Thêm mới
          </Button>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <Card className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Phiên Làm Việc
            </span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-slate-900">tenantSessions</span>
              <Badge variant="primary">Active</Badge>
            </div>
            <p className="text-xs text-slate-500">
              Bảo mật 3 tầng tách rời khỏi clientSessions và superAdminSessions.
            </p>
          </Card>

          <Card className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Phân Quyền RBAC
            </span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-slate-900">roles.permissions</span>
              <Badge variant="success">Enforced</Badge>
            </div>
            <p className="text-xs text-slate-500">
              Kiểm tra quyền động trên từng module qua ModuleGuard.
            </p>
          </Card>

          <Card className="space-y-2">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Convex Realtime
            </span>
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold text-slate-900">WebSocket</span>
              <Badge variant="slate">Connected</Badge>
            </div>
            <p className="text-xs text-slate-500">
              Đồng bộ dữ liệu tức thời không cần reload hay refetch thủ công.
            </p>
          </Card>
        </div>
      </div>
    </ModuleGuard>
  );
}

