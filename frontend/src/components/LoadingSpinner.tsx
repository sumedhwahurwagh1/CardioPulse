import React from 'react';
import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  label = 'Processing...',
  size = 'md',
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <Loader2 className={`animate-spin text-brand-600 ${sizeClasses[size]}`} />
      {label && <p className="text-sm font-medium text-slate-500 animate-pulse">{label}</p>}
    </div>
  );
};
export default LoadingSpinner;
