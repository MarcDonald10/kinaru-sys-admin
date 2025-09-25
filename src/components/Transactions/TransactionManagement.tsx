import React, { useState, useMemo } from 'react';
import { Search, Filter, Plus, Eye, Download, AlertTriangle, CheckCircle, XCircle, Calendar, Euro, TrendingUp, TrendingDown } from 'lucide-react';
import { mockTransactions, mockUsers } from '../../data/mockData';
import { Transaction } from '../../types';

export default function TransactionManagement() {
  const [transactions] = useState<Transaction[]>(mockTransactions);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [showDisputeModal, setShowDisputeModal] = useState(false);
  const [disputeReason, setDisputeReason] = useState('');

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const user = mockUsers.find(u => u.id === transaction.userId);
      const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           user?.name.toLowerCase().includes(searchTerm.toLowerCase()) || '';
      const matchesType = typeFilter === 'all' || transaction.type === typeFilter;
      const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
      
      let matchesDate = true;
      if (dateFilter !== 'all') {
        const transactionDate = new Date(transaction.date);
        const now = new Date();
        const daysDiff = Math.floor((now.getTime() - transactionDate.getTime()) / (1000 * 3600 * 24));
        
        if (dateFilter === 'week' && daysDiff > 7) matchesDate = false;
        if (dateFilter === 'month' && daysDiff > 30) matchesDate = false;
        if (dateFilter === 'year' && daysDiff > 365) matchesDate = false;
      }
      
      return matchesSearch && matchesType && matchesStatus && matchesDate;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, searchTerm, typeFilter, statusFilter, dateFilter]);

  const handleTransactionAction = (transactionId: string, action: string) => {
    console.log(`Action ${action} sur transaction ${transactionId}`);
    if (action === 'dispute') {
      setSelectedTransaction(transactions.find(t => t.id === transactionId) || null);
      setShowDisputeModal(true);
    }
  };

  const generateReceipt = (transaction: Transaction) => {
    console.log('Génération du reçu pour:', transaction.id);
    // Simulation de génération de reçu
  };

  const totalRevenue = filteredTransactions
    .filter(t => t.status === 'paye')
    .reduce((sum, t) => sum + t.amount, 0);

  const pendingAmount = filteredTransactions
    .filter(t => t.status === 'en_attente')
    .reduce((sum, t) => sum + t.amount, 0);

  const TransactionCard = ({ transaction }: { transaction: Transaction }) => {
    const user = mockUsers.find(u => u.id === transaction.userId);
    
    return (
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-2">
              <h3 className="font-semibold text-gray-900 dark:text-white">
                {transaction.description}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                transaction.type === 'loyer' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300' :
                transaction.type === 'frais_reservation' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300' :
                transaction.type === 'abonnement' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
              }`}>
                {transaction.type}
              </span>
            </div>
            
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400 mb-3">
              <span>{user?.name || 'Utilisateur inconnu'}</span>
              <span>•</span>
              <span>{new Date(transaction.date).toLocaleDateString()}</span>
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Euro className="w-4 h-4 text-gray-400" />
                <span className="text-lg font-bold text-gray-900 dark:text-white">
                  {transaction.amount.toLocaleString()}€
                </span>
              </div>
              
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                transaction.status === 'paye' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300' :
                transaction.status === 'en_attente' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300' :
                'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
              }`}>
                {transaction.status === 'paye' ? 'Payé' :
                 transaction.status === 'en_attente' ? 'En attente' : 'Annulé'}
              </span>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 ml-4">
            <button
              onClick={() => setSelectedTransaction(transaction)}
              className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
              title="Voir détails"
            >
              <Eye className="w-4 h-4" />
            </button>
            <button
              onClick={() => generateReceipt(transaction)}
              className="p-2 text-gray-400 hover:text-green-500 transition-colors"
              title="Générer reçu"
            >
              <Download className="w-4 h-4" />
            </button>
            {transaction.status === 'en_attente' && (
              <button
                onClick={() => handleTransactionAction(transaction.id, 'dispute')}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Gérer litige"
              >
                <AlertTriangle className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header avec statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Revenus Totaux</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {totalRevenue.toLocaleString()}€
              </p>
            </div>
            <div className="p-3 rounded-lg bg-green-500">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">En Attente</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {pendingAmount.toLocaleString()}€
              </p>
            </div>
            <div className="p-3 rounded-lg bg-yellow-500">
              <Calendar className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
        
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Transactions</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                {filteredTransactions.length}
              </p>
            </div>
            <div className="p-3 rounded-lg bg-blue-500">
              <Euro className="w-6 h-6 text-white" />
            </div>
          </div>
        </div>
      </div>

      {/* Header principal */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Transactions</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {filteredTransactions.length} transaction(s) trouvée(s)
          </p>
        </div>
        <button className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors">
          <Plus className="w-4 h-4" />
          <span>Nouvelle transaction</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher..."
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
            <option value="loyer">Loyer</option>
            <option value="frais_reservation">Frais de réservation</option>
            <option value="abonnement">Abonnement</option>
            <option value="commission">Commission</option>
          </select>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
          >
            <option value="all">Tous les statuts</option>
            <option value="paye">Payé</option>
            <option value="en_attente">En attente</option>
            <option value="annule">Annulé</option>
          </select>
          
          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
          >
            <option value="all">Toutes les dates</option>
            <option value="week">Cette semaine</option>
            <option value="month">Ce mois</option>
            <option value="year">Cette année</option>
          </select>
        </div>
      </div>

      {/* Liste des transactions */}
      <div className="space-y-4">
        {filteredTransactions.map(transaction => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}
      </div>

      {/* Modal de détails */}
      {selectedTransaction && !showDisputeModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Détails de la transaction
                </h2>
                <button
                  onClick={() => setSelectedTransaction(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">ID Transaction</label>
                  <p className="text-gray-900 dark:text-white">{selectedTransaction.id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Montant</label>
                  <p className="text-gray-900 dark:text-white font-semibold">
                    {selectedTransaction.amount.toLocaleString()}€
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Type</label>
                  <p className="text-gray-900 dark:text-white">{selectedTransaction.type}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Statut</label>
                  <p className="text-gray-900 dark:text-white">{selectedTransaction.status}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Date</label>
                  <p className="text-gray-900 dark:text-white">
                    {new Date(selectedTransaction.date).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Utilisateur</label>
                  <p className="text-gray-900 dark:text-white">
                    {mockUsers.find(u => u.id === selectedTransaction.userId)?.name || 'Inconnu'}
                  </p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</label>
                <p className="text-gray-900 dark:text-white">{selectedTransaction.description}</p>
              </div>
              
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => generateReceipt(selectedTransaction)}
                  className="flex items-center space-x-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Download className="w-4 h-4" />
                  <span>Générer reçu</span>
                </button>
                {selectedTransaction.status === 'en_attente' && (
                  <button
                    onClick={() => setShowDisputeModal(true)}
                    className="flex items-center space-x-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                  >
                    <AlertTriangle className="w-4 h-4" />
                    <span>Gérer litige</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal de gestion de litige */}
      {showDisputeModal && selectedTransaction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Gérer le litige
              </h2>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Raison du litige
                </label>
                <textarea
                  value={disputeReason}
                  onChange={(e) => setDisputeReason(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
                  rows={4}
                  placeholder="Décrivez la raison du litige..."
                />
              </div>
              
              <div className="flex space-x-3">
                <button
                  onClick={() => {
                    console.log('Transaction annulée:', selectedTransaction.id, disputeReason);
                    setShowDisputeModal(false);
                    setSelectedTransaction(null);
                    setDisputeReason('');
                  }}
                  className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors"
                >
                  Annuler transaction
                </button>
                <button
                  onClick={() => {
                    console.log('Remboursement initié:', selectedTransaction.id, disputeReason);
                    setShowDisputeModal(false);
                    setSelectedTransaction(null);
                    setDisputeReason('');
                  }}
                  className="flex-1 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                  Rembourser
                </button>
              </div>
              
              <button
                onClick={() => {
                  setShowDisputeModal(false);
                  setDisputeReason('');
                }}
                className="w-full bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}