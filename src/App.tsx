import React, { useState, useEffect } from 'react';
import Sidebar from './components/Layout/Sidebar';
import Header from './components/Layout/Header';
import Dashboard from './components/Dashboard/Dashboard';
import UserManagement from './components/Users/UserManagement';
import PropertyManagement from './components/Properties/PropertyManagement';
import TransactionManagement from './components/Transactions/TransactionManagement';
import ContractManagement from './components/Contracts/ContractManagement';
import MessagingSystem from './components/Messaging/MessagingSystem';
import PartnerManagement from './components/Partners/PartnerManagement';
import ActivityLogs from './components/Logs/ActivityLogs';
import Settings from './components/Settings/Settings';

function App() {
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState<'fr' | 'en'>('fr');

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const renderContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'properties':
        return <PropertyManagement />;
      case 'map':
        return (
          <div className="p-6">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Carte Interactive</h2>
              <p className="text-gray-500 dark:text-gray-400">
                La carte interactive des propriétés sera disponible prochainement.
              </p>
            </div>
          </div>
        );
      case 'transactions':
        return <TransactionManagement />;
      case 'contracts':
        return <ContractManagement />;
      case 'messaging':
        return <MessagingSystem />;
      case 'statistics':
        return (
          <div className="p-6">
            <div className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 text-center">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Statistiques Avancées</h2>
              <p className="text-gray-500 dark:text-gray-400">
                Tableau de bord statistiques en cours de développement.
              </p>
            </div>
          </div>
        );
      case 'partners':
        return <PartnerManagement />;
      case 'logs':
        return <ActivityLogs />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          darkMode={darkMode}
          onToggleDarkMode={() => setDarkMode(!darkMode)}
          language={language}
          onToggleLanguage={() => setLanguage(language === 'fr' ? 'en' : 'fr')}
        />
        
        <main className="flex-1 overflow-y-auto">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;