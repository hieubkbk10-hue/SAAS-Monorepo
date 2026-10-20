import { FC, HTMLAttributes, ReactNode } from 'react';
import { cn } from '../lib/utils';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children?: ReactNode;
}

export const Card: FC<CardProps> = ({ children, className, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white p-6 shadow-sm border border-slate-100 transition-all',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

