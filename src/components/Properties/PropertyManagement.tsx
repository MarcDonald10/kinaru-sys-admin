import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Edit, Check, X, Eye, MapPin, Euro } from 'lucide-react';
import { mockProperties } from '../../data/mockData';
import { Property } from '../../types';

export default function PropertyManagement() {
  const [properties] = useState<Property[]>(mockProperties);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [validationFilter, setValidationFilter] = useState('all');
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);

  const filteredProperties = useMemo(() => {
    return properties.filter(property => {
      const matchesSearch = property.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           property.location.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === 'all' || property.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || property.status === statusFilter;
      const matchesValidation = validationFilter === 'all' || property.validationStatus === validationFilter;
      
      return matchesSearch && matchesType && matchesStatus && matchesValidation;
    });
  }, [properties, searchTerm, typeFilter, statusFilter, validationFilter]);

  const handlePropertyAction = (propertyId: string, action: string) => {
    console.log(`Action ${action} sur propriété ${propertyId}`);
  };

  const PropertyCard = ({ property }: { property: Property }) => (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative">
        <img
          src={property.images[0]}
          alt={property.name}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-4 left-4 flex space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            property.type === 'residentiel' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800'
          }`}>
            {property.type}
          </span>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            property.status === 'libre' ? 'bg-green-100 text-green-800' :
            property.status === 'occupe' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {property.status}
          </span>
        </div>
        <div className="absolute top-4 right-4">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            property.validationStatus === 'accepte' ? 'bg-green-100 text-green-800' :
            property.validationStatus === 'rejete' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {property.validationStatus === 'accepte' ? 'Validé' :
             property.validationStatus === 'rejete' ? 'Rejeté' : 'En attente'}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white text-lg">
              {property.name}
            </h3>
            <div className="flex items-center text-gray-500 dark:text-gray-400 text-sm mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {property.location}
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center text-orange-600 font-bold text-xl">
              <Euro className="w-5 h-5 mr-1" />
              {property.price.toLocaleString()}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {property.surface}m²
            </div>
          </div>
        </div>
        
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
          {property.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Créé le {new Date(property.createdDate).toLocaleDateString()}
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedProperty(property)}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
              title="Voir détails"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => handlePropertyAction(property.id, 'edit')}
              className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
              title="Modifier"
            >
              <Edit className="w-4 h-4" />
            </button>
            {property.validationStatus === 'en_attente' && (
              <>
                <button
                  onClick={() => handlePropertyAction(property.id, 'approve')}
                  className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                  title="Valider"
                >
                  <Check className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handlePropertyAction(property.id, 'reject')}
                  className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  title="Rejeter"
                >
                  <X className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Propriétés</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {filteredProperties.length} propriété(s) trouvée(s)
          </p>
        </div>
        <button className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Ajouter propriété</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par nom ou lieu..."
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
            <option value="residentiel">Résidentiel</option>
            <option value="commercial">Commercial</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
          >
            <option value="all">Tous les statuts</option>
            <option value="libre">Libre</option>
            <option value="occupe">Occupé</option>
            <option value="reserve">Réservé</option>
          </select>
          
          <select
            value={validationFilter}
            onChange={(e) => setValidationFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
          >
            <option value="all">Toutes validations</option>
            <option value="accepte">Validé</option>
            <option value="en_attente">En attente</option>
            <option value="rejete">Rejeté</option>
          </select>
        </div>
      </div>

      {/* Grille des propriétés */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProperties.map(property => (
          <PropertyCard key={property.id} property={property} />
        ))}
      </div>

      {/* Modal de détails */}
      {selectedProperty && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  {selectedProperty.name}
                </h2>
                <button
                  onClick={() => setSelectedProperty(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedProperty.images[0]}
                    alt={selectedProperty.name}
                    className="w-full h-64 object-cover rounded-lg"
                  />
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                      Informations générales
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Type:</span>
                        <span className="text-gray-900 dark:text-white">{selectedProperty.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Statut:</span>
                        <span className="text-gray-900 dark:text-white">{selectedProperty.status}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Prix:</span>
                        <span className="text-gray-900 dark:text-white font-semibold">
                          {selectedProperty.price.toLocaleString()}€
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Surface:</span>
                        <span className="text-gray-900 dark:text-white">{selectedProperty.surface}m²</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Localisation:</span>
                        <span className="text-gray-900 dark:text-white">{selectedProperty.location}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-2">Actions</h4>
                    <div className="space-y-2">
                      <button className="w-full text-left px-3 py-2 text-sm text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors">
                        Modifier la propriété
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                        Voir sur la carte
                      </button>
                      <button className="w-full text-left px-3 py-2 text-sm text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors">
                        Valider la propriété
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">Description</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                  {selectedProperty.description}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}