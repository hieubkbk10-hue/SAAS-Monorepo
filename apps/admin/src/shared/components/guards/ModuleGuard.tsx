import { FC, ReactNode } from 'react';
import { notFound } from 'next/navigation';
import { ModuleAction } from '@core/domain';

export interface ModuleGuardProps {
  module: string;
  action?: ModuleAction;
  children: ReactNode;
}

export const ModuleGuard: FC<ModuleGuardProps> = ({
  module,
  action = 'read',
  children,
}) => {
  // Skeleton logic: Trong môi trường thực tế, đọc trạng thái module từ Convex hoặc context
  // Ví dụ: const isEnabled = checkModuleEnabled(module);
  const isEnabled = true;
  const isAuthorized = true;

  if (!isEnabled) {
    notFound();
  }

  if (!isAuthorized) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center p-6">
        <h2 className="text-2xl font-bold text-slate-900">403 - Không Có Quyền Truy Cập</h2>
        <p className="mt-2 text-sm text-slate-500">
          Bạn không có quyền <code className="font-mono font-semibold">{action}</code> trên module{' '}
          <code className="font-mono font-semibold">{module}</code>.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

