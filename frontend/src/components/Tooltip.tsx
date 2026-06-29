import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';

interface TooltipProps {
  content: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
}

export const Tooltip: React.FC<TooltipProps> = ({ content, position = 'top' }) => {
  const [active, setActive] = useState(false);

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2',
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-slate-800 border-x-transparent border-b-transparent -mt-1',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-slate-800 border-x-transparent border-t-transparent -mb-1',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-slate-800 border-y-transparent border-r-transparent -ml-1',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-slate-800 border-y-transparent border-l-transparent -mr-1',
  };

  return (
    <div
      className="relative inline-block ml-1"
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <HelpCircle className="h-4 w-4 text-slate-400 hover:text-brand-500 cursor-help transition-colors" />
      {active && (
        <div className={`absolute z-50 w-52 rounded-lg bg-slate-800 p-2.5 text-xs text-white shadow-md leading-relaxed ${positionClasses[position]}`}>
          {content}
          <div className={`absolute border-4 ${arrowClasses[position]}`} />
        </div>
      )}
    </div>
  );
};
export default Tooltip;
