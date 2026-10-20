import { FC } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Package, ShoppingCart, Users, Settings, ShieldCheck } from 'lucide-react';
import { Badge } from '@ui/primitives';

export const AdminSidebar: FC = () => {
  const navItems = [
    { label: 'Tổng quan', href: '/admin', icon: LayoutDashboard },
    { label: 'Sản phẩm', href: '/admin/products', icon: Package },
    { label: 'Đơn hàng', href: '/admin/orders', icon: ShoppingCart },
    { label: 'Khách hàng', href: '/admin/clients', icon: Users },
    { label: 'Cấu hình', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-slate-200 bg-white flex flex-col shrink-0 min-h-screen">
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-100">
        <span className="font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <ShieldCheck className="w-5 h-5 text-blue-600" />
          Tenant Admin
        </span>
        <Badge variant="primary">tenant</Badge>
      </div>

      <nav className="p-4 space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:bg-slate-50 hover:text-blue-600 transition-colors"
            >
              <Icon className="w-4 h-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100">
        <div className="bg-slate-50 rounded-xl p-3 text-xs text-slate-500">
          <p className="font-semibold text-slate-700">Phiên làm việc</p>
          <p className="mt-0.5 truncate">tenantSessions</p>
        </div>
      </div>
    </aside>
  );
};

