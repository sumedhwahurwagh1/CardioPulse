import React from 'react';
import { ShieldAlert } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-200 bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          {/* Logo & copyright */}
          <div className="flex flex-col items-center md:items-start gap-1">
            <span className="text-base font-semibold text-slate-900">
              CardioPulse Systems
            </span>
            <span className="text-xs text-slate-500">
              © {new Date().getFullYear()} CardioPulse. All rights reserved.
            </span>
          </div>

          {/* Medical disclaimer */}
          <div className="flex max-w-md items-start gap-2.5 rounded-xl bg-amber-50/80 p-3.5 border border-amber-100 text-amber-800">
            <ShieldAlert className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-semibold">Medical Disclaimer:</span> This AI tool is built for diagnostic decision support and educational research. It does NOT replace professional medical diagnosis, advice, or cardiologist consultations.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
