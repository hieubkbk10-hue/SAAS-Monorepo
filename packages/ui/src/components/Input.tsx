import { FC, InputHTMLAttributes } from 'react';
import { cn } from '../lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

export const Input: FC<InputProps> = ({ className, error, ...props }) => {
  return (
    <div className="w-full">
      <input
        className={cn(
          'flex h-10 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50 transition-colors',
          error && 'border-rose-500 focus-visible:ring-rose-500',
          className
        )}
        {...props}
      />
      {error && <p className="mt-1.5 text-xs text-rose-500">{error}</p>}
    </div>
  );
};

