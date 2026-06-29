import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

export const NotFound: React.FC = () => {
  return (
    <div className="flex flex-1 items-center justify-center bg-slate-50 px-4 py-16">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="max-w-md text-center"
      >
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-rose-100 text-rose-600">
          <ShieldAlert className="h-8 w-8" />
        </div>
        <h1 className="mt-6 text-3xl font-bold tracking-tight text-slate-900">404 - Page Not Found</h1>
        <p className="mt-3 text-base text-slate-500">
          The page you are looking for doesn't exist, was moved, or was temporarily disabled.
        </p>
        <div className="mt-8">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  );
};
export default NotFound;
