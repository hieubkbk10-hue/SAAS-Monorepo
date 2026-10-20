import { FC } from 'react';
import Link from 'next/link';
import { Sliders, Cpu, Database, Palette, Key, Terminal } from 'lucide-react';
import { Badge } from '@ui/primitives';

export const SystemSidebar: FC = () => {
  const navItems = [
    { label: 'Tổng quan hệ thống', href: '/system', icon: Cpu },
    { label: 'Quản lý Modules', href: '/system/modules', icon: Sliders },
    { label: 'System Presets', href: '/system/presets', icon: Terminal },
    { label: 'Experience UI', href: '/system/experiences', icon: Palette },
    { label: 'Dữ liệu & Seeder', href: '/system/data', icon: Database },
  ];

  return (
    <aside className="w-64 border-r border-slate-800 bg-slate-900 flex flex-col shrink-0 min-h-screen text-slate-200">
      <div className="h-16 flex items-center justify-between px-6 border-b border-slate-800">
        <span className="font-bold text-white tracking-tight flex items-center gap-2">
          <Key className="w-5 h-5 text-purple-400" />
          Super Admin
        </span>
        <Badge variant="primary" className="bg-purple-950 text-purple-300 border-purple-800">
          superAdmin
        </Badge>
      </div>

      <nav className="p-4 space-y-1 flex-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Icon className="w-4 h-4 text-purple-400" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="bg-slate-950/60 rounded-xl p-3 text-xs text-slate-400 border border-slate-800">
          <p className="font-semibold text-slate-300">Xác thực hệ thống</p>
          <p className="mt-0.5 truncate text-purple-300 font-mono">superAdminSessions</p>
        </div>
      </div>
    </aside>
  );
};

