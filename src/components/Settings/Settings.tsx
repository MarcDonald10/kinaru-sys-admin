import React, { useState } from 'react';
import { Save, Bell, Shield, Globe, Palette, Database, Mail, Key, Users, Building, CreditCard, AlertTriangle, CheckCircle } from 'lucide-react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('general');
  const [settings, setSettings] = useState({
    general: {
      siteName: 'Kinaru',
      siteDescription: 'Plateforme immobilière moderne',
      language: 'fr',
      timezone: 'Europe/Paris',
      maintenanceMode: false
    },
    notifications: {
      emailNotifications: true,
      pushNotifications: true,
      smsNotifications: false,
      weeklyReports: true,
      securityAlerts: true
    },
    security: {
      twoFactorAuth: true,
      sessionTimeout: 30,
      passwordExpiry: 90,
      loginAttempts: 5,
      ipWhitelist: ''
    },
    appearance: {
      theme: 'light',
      primaryColor: '#F05A25',
      secondaryColor: '#192A3F',
      logoUrl: '',
      favicon: ''
    },
    integrations: {
      stripeEnabled: false,
      stripePublicKey: '',
      stripeSecretKey: '',
      emailProvider: 'smtp',
      smtpHost: '',
      smtpPort: 587,
      smtpUser: '',
      smtpPassword: ''
    },
    business: {
      companyName: 'Kinaru SAS',
      companyAddress: '123 Rue de la Paix, 75001 Paris',
      companyPhone: '+33 1 23 45 67 89',
      companyEmail: 'contact@kinaru.com',
      vatNumber: 'FR12345678901',
      commissionRate: 5
    }
  });

  const handleSettingChange = (category: string, key: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category as keyof typeof prev],
        [key]: value
      }
    }));
  };

  const saveSettings = () => {
    console.log('Sauvegarde des paramètres:', settings);
    // Simulation de sauvegarde
  };

  const tabs = [
    { id: 'general', label: 'Général', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Sécurité', icon: Shield },
    { id: 'appearance', label: 'Apparence', icon: Palette },
    { id: 'integrations', label: 'Intégrations', icon: Database },
    { id: 'business', label: 'Entreprise', icon: CreditCard }
  ];

  const SettingCard = ({ title, description, children }: any) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <SettingCard
        title="Informations générales"
        description="Configuration de base de votre plateforme"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom du site
            </label>
            <input
              type="text"
              value={settings.general.siteName}
              onChange={(e) => handleSettingChange('general', 'siteName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Langue par défaut
            </label>
            <select
              value={settings.general.language}
              onChange={(e) => handleSettingChange('general', 'language', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="es">Español</option>
            </select>
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description du site
            </label>
            <textarea
              value={settings.general.siteDescription}
              onChange={(e) => handleSettingChange('general', 'siteDescription', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              rows={3}
            />
          </div>
        </div>
      </SettingCard>

      <SettingCard
        title="Mode maintenance"
        description="Activer le mode maintenance pour effectuer des mises à jour"
      >
        <label className="flex items-center space-x-3">
          <input
            type="checkbox"
            checked={settings.general.maintenanceMode}
            onChange={(e) => handleSettingChange('general', 'maintenanceMode', e.target.checked)}
            className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
          />
          <span className="text-gray-700 dark:text-gray-300">
            Activer le mode maintenance
          </span>
        </label>
        {settings.general.maintenanceMode && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Le site sera inaccessible aux utilisateurs
              </span>
            </div>
          </div>
        )}
      </SettingCard>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <SettingCard
        title="Préférences de notification"
        description="Configurez comment vous souhaitez être notifié"
      >
        <div className="space-y-4">
          {Object.entries(settings.notifications).map(([key, value]) => (
            <label key={key} className="flex items-center justify-between">
              <div>
                <span className="text-gray-700 dark:text-gray-300 font-medium">
                  {key === 'emailNotifications' ? 'Notifications par email' :
                   key === 'pushNotifications' ? 'Notifications push' :
                   key === 'smsNotifications' ? 'Notifications SMS' :
                   key === 'weeklyReports' ? 'Rapports hebdomadaires' :
                   'Alertes de sécurité'}
                </span>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {key === 'emailNotifications' ? 'Recevoir les notifications par email' :
                   key === 'pushNotifications' ? 'Notifications dans le navigateur' :
                   key === 'smsNotifications' ? 'Notifications par SMS (facturation supplémentaire)' :
                   key === 'weeklyReports' ? 'Rapport d\'activité hebdomadaire' :
                   'Alertes en cas de problème de sécurité'}
                </p>
              </div>
              <input
                type="checkbox"
                checked={value as boolean}
                onChange={(e) => handleSettingChange('notifications', key, e.target.checked)}
                className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
              />
            </label>
          ))}
        </div>
      </SettingCard>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <SettingCard
        title="Authentification"
        description="Paramètres de sécurité et d'authentification"
      >
        <div className="space-y-4">
          <label className="flex items-center justify-between">
            <div>
              <span className="text-gray-700 dark:text-gray-300 font-medium">
                Authentification à deux facteurs
              </span>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Sécurité renforcée avec un code de vérification
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.security.twoFactorAuth}
              onChange={(e) => handleSettingChange('security', 'twoFactorAuth', e.target.checked)}
              className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
          </label>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Timeout de session (minutes)
              </label>
              <input
                type="number"
                value={settings.security.sessionTimeout}
                onChange={(e) => handleSettingChange('security', 'sessionTimeout', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tentatives de connexion max
              </label>
              <input
                type="number"
                value={settings.security.loginAttempts}
                onChange={(e) => handleSettingChange('security', 'loginAttempts', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      </SettingCard>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <SettingCard
        title="Thème et couleurs"
        description="Personnalisez l'apparence de votre plateforme"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Thème par défaut
            </label>
            <select
              value={settings.appearance.theme}
              onChange={(e) => handleSettingChange('appearance', 'theme', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            >
              <option value="light">Clair</option>
              <option value="dark">Sombre</option>
              <option value="auto">Automatique</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Couleur principale
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.appearance.primaryColor}
                  onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 dark:border-slate-600 rounded-lg"
                />
                <input
                  type="text"
                  value={settings.appearance.primaryColor}
                  onChange={(e) => handleSettingChange('appearance', 'primaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Couleur secondaire
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={settings.appearance.secondaryColor}
                  onChange={(e) => handleSettingChange('appearance', 'secondaryColor', e.target.value)}
                  className="w-12 h-10 border border-gray-300 dark:border-slate-600 rounded-lg"
                />
                <input
                  type="text"
                  value={settings.appearance.secondaryColor}
                  onChange={(e) => handleSettingChange('appearance', 'secondaryColor', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
          </div>
        </div>
      </SettingCard>
    </div>
  );

  const renderIntegrationSettings = () => (
    <div className="space-y-6">
      <SettingCard
        title="Paiements Stripe"
        description="Configuration des paiements en ligne"
      >
        <div className="space-y-4">
          <label className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={settings.integrations.stripeEnabled}
              onChange={(e) => handleSettingChange('integrations', 'stripeEnabled', e.target.checked)}
              className="rounded border-gray-300 text-orange-500 focus:ring-orange-500"
            />
            <span className="text-gray-700 dark:text-gray-300">
              Activer les paiements Stripe
            </span>
          </label>
          
          {settings.integrations.stripeEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Clé publique Stripe
                </label>
                <input
                  type="text"
                  value={settings.integrations.stripePublicKey}
                  onChange={(e) => handleSettingChange('integrations', 'stripePublicKey', e.target.value)}
                  placeholder="pk_test_..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Clé secrète Stripe
                </label>
                <input
                  type="password"
                  value={settings.integrations.stripeSecretKey}
                  onChange={(e) => handleSettingChange('integrations', 'stripeSecretKey', e.target.value)}
                  placeholder="sk_test_..."
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                />
              </div>
            </div>
          )}
        </div>
      </SettingCard>

      <SettingCard
        title="Configuration Email"
        description="Paramètres pour l'envoi d'emails"
      >
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Serveur SMTP
              </label>
              <input
                type="text"
                value={settings.integrations.smtpHost}
                onChange={(e) => handleSettingChange('integrations', 'smtpHost', e.target.value)}
                placeholder="smtp.gmail.com"
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Port SMTP
              </label>
              <input
                type="number"
                value={settings.integrations.smtpPort}
                onChange={(e) => handleSettingChange('integrations', 'smtpPort', parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      </SettingCard>
    </div>
  );

  const renderBusinessSettings = () => (
    <div className="space-y-6">
      <SettingCard
        title="Informations de l'entreprise"
        description="Détails de votre entreprise pour les factures et contrats"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Nom de l'entreprise
            </label>
            <input
              type="text"
              value={settings.business.companyName}
              onChange={(e) => handleSettingChange('business', 'companyName', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Numéro de TVA
            </label>
            <input
              type="text"
              value={settings.business.vatNumber}
              onChange={(e) => handleSettingChange('business', 'vatNumber', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            />
          </div>
          
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Adresse
            </label>
            <textarea
              value={settings.business.companyAddress}
              onChange={(e) => handleSettingChange('business', 'companyAddress', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              rows={3}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Téléphone
            </label>
            <input
              type="tel"
              value={settings.business.companyPhone}
              onChange={(e) => handleSettingChange('business', 'companyPhone', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email
            </label>
            <input
              type="email"
              value={settings.business.companyEmail}
              onChange={(e) => handleSettingChange('business', 'companyEmail', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            />
          </div>
        </div>
      </SettingCard>

      <SettingCard
        title="Paramètres financiers"
        description="Configuration des commissions et frais"
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Taux de commission (%)
          </label>
          <input
            type="number"
            min="0"
            max="100"
            step="0.1"
            value={settings.business.commissionRate}
            onChange={(e) => handleSettingChange('business', 'commissionRate', parseFloat(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
          />
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Commission prélevée sur chaque transaction
          </p>
        </div>
      </SettingCard>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'general': return renderGeneralSettings();
      case 'notifications': return renderNotificationSettings();
      case 'security': return renderSecuritySettings();
      case 'appearance': return renderAppearanceSettings();
      case 'integrations': return renderIntegrationSettings();
      case 'business': return renderBusinessSettings();
      default: return renderGeneralSettings();
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Paramètres</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Configuration de votre plateforme Kinaru
          </p>
        </div>
        <button
          onClick={saveSettings}
          className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Save className="w-4 h-4" />
          <span>Sauvegarder</span>
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Navigation des onglets */}
        <div className="lg:w-64">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 p-2">
            <nav className="space-y-1">
              {tabs.map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-3 rounded-lg transition-colors text-left ${
                      activeTab === tab.id
                        ? 'bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400'
                        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>
        </div>

        {/* Contenu des onglets */}
        <div className="flex-1">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}