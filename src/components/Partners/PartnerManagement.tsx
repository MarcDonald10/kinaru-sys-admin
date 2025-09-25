import React, { useState, useMemo } from 'react';
import { Search, Plus, Edit, Eye, Trash2, Building, Phone, Mail, Calendar, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { mockPartners } from '../../data/mockData';
import { Partner } from '../../types';

export default function PartnerManagement() {
  const [partners] = useState<Partner[]>(mockPartners);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [selectedPartner, setSelectedPartner] = useState<Partner | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const filteredPartners = useMemo(() => {
    return partners.filter(partner => {
      const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           partner.email.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || partner.type === typeFilter;
      
      return matchesSearch && matchesType;
    });
  }, [partners, searchTerm, typeFilter]);

  const getContractStatus = (partner: Partner) => {
    if (!partner.contractEnd) return 'no_contract';
    
    const endDate = new Date(partner.contractEnd);
    const now = new Date();
    const daysUntilEnd = Math.ceil((endDate.getTime() - now.getTime()) / (1000 * 3600 * 24));
    
    if (daysUntilEnd < 0) return 'expired';
    if (daysUntilEnd <= 30) return 'expiring';
    return 'active';
  };

  const handlePartnerAction = (partnerId: string, action: string) => {
    console.log(`Action ${action} sur partenaire ${partnerId}`);
  };

  const PartnerCard = ({ partner }: { partner: Partner }) => {
    const contractStatus = getContractStatus(partner);
    
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className={`p-3 rounded-lg ${
              partner.type === 'banque' ? 'bg-blue-100 dark:bg-blue-900/20' :
              partner.type === 'assurance' ? 'bg-green-100 dark:bg-green-900/20' :
              'bg-purple-100 dark:bg-purple-900/20'
            }`}>
              <Building className={`w-6 h-6 ${
                partner.type === 'banque' ? 'text-blue-600' :
                partner.type === 'assurance' ? 'text-green-600' :
                'text-purple-600'
              }`} />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
                {partner.name}
              </h3>
              <div className="flex items-center space-x-2 mt-1">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  partner.type === 'banque' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                  partner.type === 'assurance' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                  'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                }`}>
                  {partner.type}
                </span>
                {contractStatus !== 'no_contract' && (
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    contractStatus === 'active' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                    contractStatus === 'expiring' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                    'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                  }`}>
                    {contractStatus === 'active' ? 'Contrat actif' :
                     contractStatus === 'expiring' ? 'Expire bientôt' : 'Expiré'}
                  </span>
                )}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedPartner(partner)}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
              title="Voir détails"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePartnerAction(partner.id, 'edit')}
              className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
              title="Modifier"
            >
              <Edit className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePartnerAction(partner.id, 'delete')}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Supprimer"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{partner.contact}</span>
          </div>
          
          <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
            <Mail className="w-4 h-4 text-gray-400" />
            <span>{partner.email}</span>
          </div>
          
          {partner.contractEnd && (
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-300">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span>Contrat jusqu'au {new Date(partner.contractEnd).toLocaleDateString()}</span>
            </div>
          )}
        </div>
        
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Services</h4>
          <div className="flex flex-wrap gap-2">
            {partner.services.map((service, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 text-xs rounded-md"
              >
                {service}
              </span>
            ))}
          </div>
        </div>
        
        {contractStatus === 'expiring' && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-yellow-600" />
              <span className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                Contrat expire dans {Math.ceil((new Date(partner.contractEnd!).getTime() - new Date().getTime()) / (1000 * 3600 * 24))} jour(s)
              </span>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Partenaires</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {filteredPartners.length} partenaire(s) trouvé(s)
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter partenaire</span>
        </button>
      </div>

      {/* Statistiques rapides */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Partenaires</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{partners.length}</p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <Building className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Banques</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {partners.filter(p => p.type === 'banque').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <Building className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Assurances</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {partners.filter(p => p.type === 'assurance').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-purple-500">
              <Building className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Contrats Expirant</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {partners.filter(p => getContractStatus(p) === 'expiring').length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500">
              <AlertTriangle className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Filtres */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            />
          </div>
          
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
          >
            <option value="all">Tous les types</option>
            <option value="banque">Banques</option>
            <option value="assurance">Assurances</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Grille des partenaires */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredPartners.map(partner => (
          <PartnerCard key={partner.id} partner={partner} />
        ))}
      </div>

      {/* Modal de détails */}
      {selectedPartner && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedPartner.name}
                </h2>
                <button
                  onClick={() => setSelectedPartner(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Informations générales</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</label>
                      <p className="text-gray-900 dark:text-white">{selectedPartner.type}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact</label>
                      <p className="text-gray-900 dark:text-white">{selectedPartner.contact}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                      <p className="text-gray-900 dark:text-white">{selectedPartner.email}</p>
                    </div>
                    {selectedPartner.contractEnd && (
                      <div>
                        <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Fin de contrat</label>
                        <p className="text-gray-900 dark:text-white">
                          {new Date(selectedPartner.contractEnd).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Services proposés</h3>
                  <div className="space-y-2">
                    {selectedPartner.services.map((service, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-gray-900 dark:text-white">{service}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-slate-700">
                <button className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
                  <Edit className="w-4 h-4" />
                  <span>Modifier</span>
                </button>
                <button className="flex items-center space-x-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                  <FileText className="w-4 h-4" />
                  <span>Voir contrat</span>
                </button>
                <button className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
                  <Phone className="w-4 h-4" />
                  <span>Contacter</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}