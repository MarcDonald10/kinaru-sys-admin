import React from 'react';
import { 
  Users, 
  Building, 
  Map, 
  CreditCard, 
  FileText, 
  MessageSquare, 
  BarChart3, 
  Handshake, 
  History,
  Settings,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

import logo from '../../assets/logo/logo-orange.png'
interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
  { id: 'users', label: 'Utilisateurs', icon: Users },
  { id: 'properties', label: 'Propriétés', icon: Building },
  { id: 'map', label: 'Carte', icon: Map },
  { id: 'transactions', label: 'Transactions', icon: CreditCard },
  { id: 'contracts', label: 'Contrats', icon: FileText },
  { id: 'messaging', label: 'Messagerie', icon: MessageSquare },
  { id: 'statistics', label: 'Statistiques', icon: BarChart3 },
  { id: 'partners', label: 'Partenaires', icon: Handshake },
  { id: 'logs', label: 'Journal', icon: History },
  { id: 'settings', label: 'Paramètres', icon: Settings }
];

export default function Sidebar({ activeSection, onSectionChange, isCollapsed, onToggleCollapse }: SidebarProps) {
  return (
    <div className={`bg-slate-900 text-white transition-all duration-300 flex flex-col ${
      isCollapsed ? 'w-16' : 'w-64'
    }`}>
      {/* Header */}
      <div className="p-4 border-b border-slate-700 flex items-center justify-between">
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            {/* <Building className="w-8 h-8 text-orange-500" /> */}
            {/* <h1 className="text-xl font-bold">Kinaru Admin</h1> */}
            <img src={logo} alt="Kinaru Logo" className="w-30 h-8 ml-2" />
          </div>
        )}
        <button
          onClick={onToggleCollapse}
          className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            
            return (
              <li key={item.id}>
                <button
                  onClick={() => onSectionChange(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-orange-700 text-white shadow-lg' 
                      : 'hover:bg-slate-800 text-slate-300 hover:text-white'
                  }`}
                  title={isCollapsed ? item.label : undefined}
                >
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  {!isCollapsed && <span className="font-medium">{item.label}</span>}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Footer */}
      {/* {!isCollapsed && (
        <div className="p-4 border-t border-slate-700">
          <div className="text-xs text-slate-400 text-center">
            Version 1.0.0
            <br />
            © 2025 Kinaru
          </div>
        </div>
      )} */}
    </div>
  );
}