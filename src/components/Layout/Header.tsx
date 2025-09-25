import React from 'react';
import { Bell, Moon, Sun, LogOut, Globe, User } from 'lucide-react';

interface HeaderProps {
  darkMode: boolean;
  onToggleDarkMode: () => void;
  language: 'fr' | 'en';
  onToggleLanguage: () => void;
}

export default function Header({ darkMode, onToggleDarkMode, language, onToggleLanguage }: HeaderProps) {
  return (
    <header className="bg-white dark:bg-slate-800 border-b border-gray-200 dark:border-slate-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Administration Kinaru
          </h2>
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
            <Bell className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-orange-500 rounded-full"></span>
          </button>

          {/* Language Toggle */}
          <button
            onClick={onToggleLanguage}
            className="flex items-center space-x-1 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            <Globe className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            <span className="text-sm font-medium text-gray-600 dark:text-gray-300 uppercase">
              {language}
            </span>
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={onToggleDarkMode}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            ) : (
              <Moon className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* User Menu */}
          <div className="flex items-center space-x-3 pl-4 border-l border-gray-200 dark:border-slate-700">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-gray-900 dark:text-white">Admin Principal</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Super Administrateur</p>
              </div>
            </div>
            
            <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors">
              <LogOut className="w-5 h-5 text-gray-600 dark:text-gray-300" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}