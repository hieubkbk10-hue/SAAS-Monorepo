import { Card, Badge, Button } from '@ui/primitives';
import { Sliders, Terminal, Database, Sparkles } from 'lucide-react';
import { SYSTEM_PRESETS } from '@core/domain';

export default function SystemDashboardPage() {
  const presetsList = Object.values(SYSTEM_PRESETS);

  return (
    <div className="space-y-8 max-w-6xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2">
            Cổng Siêu Quản Trị Hệ Thống (Super Admin)
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Điều phối cấu hình cấp cao, bật/tắt module runtime, nạp preset và trải nghiệm giao diện.
          </p>
        </div>
        <Badge variant="primary" className="bg-purple-900/60 text-purple-300 border-purple-700">
          Super Admin Session
        </Badge>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="bg-slate-900 border-slate-800 text-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Xác thực Root
            </span>
            <Sparkles className="w-4 h-4 text-purple-400" />
          </div>
          <div className="text-xl font-bold text-white font-mono">superAdminSessions</div>
          <p className="text-xs text-slate-400">
            Đăng nhập qua biến môi trường SUPER_ADMIN_EMAIL. Không phụ thuộc DB tenant.
          </p>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Module Runtime
            </span>
            <Sliders className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-xl font-bold text-white">adminModules</div>
          <p className="text-xs text-slate-400">
            Điều khiển cờ bật/tắt tính năng theo 4 cấp độ kiểm soát độc lập.
          </p>
        </Card>

        <Card className="bg-slate-900 border-slate-800 text-slate-100 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              System Presets
            </span>
            <Terminal className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-xl font-bold text-white">{presetsList.length} Gói Cấu Hình</div>
          <p className="text-xs text-slate-400">
            Bật sẵn tổ hợp module theo loại hình: blog, landing, catalog, eCommerce.
          </p>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Danh Sách Presets Khởi Tạo Nhanh</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {presetsList.map((preset) => (
            <Card key={preset.key} className="bg-slate-900/80 border-slate-800 p-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-white">{preset.name}</span>
                <code className="text-xs bg-slate-950 px-2 py-0.5 rounded text-purple-400 font-mono">
                  {preset.key}
                </code>
              </div>
              <p className="text-xs text-slate-400">{preset.description}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {preset.enabledModules.map((m) => (
                  <span
                    key={m}
                    className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

