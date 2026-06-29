import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { apiService } from '../services/api';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const [healthStatus, setHealthStatus] = useState<'online' | 'degraded' | 'offline' | 'checking'>('checking');

  useEffect(() => {
    const checkBackendHealth = async () => {
      try {
        const health = await apiService.checkHealth();
        if (health.status === 'healthy') {
          setHealthStatus('online');
        } else if (health.status === 'degraded') {
          setHealthStatus('degraded');
        } else {
          setHealthStatus('offline');
        }
      } catch {
        setHealthStatus('offline');
      }
    };

    checkBackendHealth();
    const interval = setInterval(checkBackendHealth, 15000); // Check every 15s
    return () => clearInterval(interval);
  }, []);

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <Heart className="h-7 w-7 text-brand-600 animate-pulse" fill="currentColor" />
          <span className="text-xl font-bold tracking-tight text-slate-900">
            Cardio<span className="text-brand-600">Pulse</span>
          </span>
        </Link>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-brand-600 ${
              isActive('/') ? 'text-brand-600 font-semibold' : 'text-slate-600'
            }`}
          >
            Home
          </Link>
          <Link
            to="/predict"
            className={`text-sm font-medium transition-colors hover:text-brand-600 ${
              isActive('/predict') ? 'text-brand-600 font-semibold' : 'text-slate-600'
            }`}
          >
            Assess Risk
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-colors hover:text-brand-600 ${
              isActive('/about') ? 'text-brand-600 font-semibold' : 'text-slate-600'
            }`}
          >
            About System
          </Link>
        </nav>

        {/* Health Check and Action Button */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs">
            {healthStatus === 'online' && (
              <>
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 absolute"></span>
                <span className="text-slate-600 pl-1">Server Online</span>
              </>
            )}
            {healthStatus === 'degraded' && (
              <>
                <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                <span className="text-slate-600">Model Offline</span>
              </>
            )}
            {healthStatus === 'offline' && (
              <>
                <span className="h-2 w-2 rounded-full bg-rose-500"></span>
                <span className="text-slate-600">Server Offline</span>
              </>
            )}
            {healthStatus === 'checking' && (
              <>
                <span className="h-2 w-2 rounded-full bg-slate-400 animate-pulse"></span>
                <span className="text-slate-600">Checking API...</span>
              </>
            )}
          </div>

          <Link
            to="/predict"
            className="hidden sm:inline-flex h-9 items-center justify-center rounded-xl bg-brand-600 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-brand-700 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2"
          >
            Start Assessment
          </Link>
        </div>
      </div>
    </header>
  );
};
