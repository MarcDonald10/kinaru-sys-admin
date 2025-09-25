import React, { useState, useEffect, useMemo } from 'react';
import { Search, Plus, Edit, Ban, Check, X, Eye } from 'lucide-react';
import { User } from '../../types';
import { getCollection, updateDocument } from '../../firebase/firebaseService';

// Interface User pour un typage strict


// Fonction fetchUsers avec gestion des erreurs
export const fetchUsers = async (): Promise<User[]> => {
  try {
    const users = await getCollection('Users');
    return users.map((user: any) => ({
      uid: user.id,
      nom: user.nom || '',
      prenom: user.prenom || '',
      email: user.email || '',
      telephone: user.telephone || '',
      photoProfil: user.photoProfil || '',
      cniNumber: user.cniNumber || '',
      CNIDateDelivrer: user.CNIDateDelivrer || '',
      cniExpirationDate: user.cniExpirationDate || '',
      cniRecto: user.cniRecto || '',
      cniVerso: user.cniVerso || '',
      addresse: user.addresse || '',
      fcmToken: user.fcmToken || '',
      lastUpdated: user.lastUpdated || '',
      etat: user.etat ?? 1,
      statut: user.statut ?? 1,
      typeUsersId: user.typeUsersId ?? 3,
      notificationPrefs: {
        messages: user.notificationPrefs?.messages ?? true,
        newProperties: user.notificationPrefs?.newProperties ?? true,
        payments: user.notificationPrefs?.payments ?? true,
        reservations: user.notificationPrefs?.reservations ?? true,
        visits: user.notificationPrefs?.visits ?? true,
      },
    })) as User[];
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    throw error;
  }
};

// Mappage des rôles et statuts 
const roleMap: { [key: number]: string } = {
  1: 'Visiteurs',
  2: 'Locataires',
  3: 'Proprietaire',
  4: 'Administrateur',
  6: 'Agence immobilière',
};

const statusMap: { [key: number]: string } = {
  1: 'actif',
  0: 'banni',
  2: 'en_attente',
};

// Fonctions utilitaires
const getRoleLabel = (typeUsersId: number) => roleMap[typeUsersId] || 'Inconnu';
const getStatusLabel = (statut: number) => statusMap[statut] || 'Inconnu';
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toString() !== 'Invalid Date' ? date.toLocaleDateString() : 'Non spécifié';
};

export default function UserManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('lastUpdated');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [editUser, setEditUser] = useState<User | null>(null);
  const [newUser, setNewUser] = useState<Partial<User>>({
    nom: '',
    prenom: '',
    email: '',
    typeUsersId: 3,
    statut: 1,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Charger les utilisateurs
  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true);
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);
      } catch (err) {
        setError('Erreur lors du chargement des utilisateurs. Veuillez réessayer plus tard.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadUsers();
  }, []);

  // Filtrer et trier les utilisateurs avec useMemo
  const filteredUsers = useMemo(() => {
    return users
      .filter(user => {
        const matchesSearch =
          `${user.nom} ${user.prenom}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || getRoleLabel(user.typeUsersId) === roleFilter;
        const matchesStatus = statusFilter === 'all' || getStatusLabel(user.statut) === statusFilter;
        return matchesSearch && matchesRole && matchesStatus;
      })
      .sort((a, b) => {
        if (sortBy === 'lastUpdated') {
          const dateA = new Date(a.lastUpdated);
          const dateB = new Date(b.lastUpdated);
          if (dateA.toString() === 'Invalid Date') return 1;
          if (dateB.toString() === 'Invalid Date') return -1;
          return dateB.getTime() - dateA.getTime();
        }
        if (sortBy === 'name') {
          return `${a.nom} ${a.prenom}`.localeCompare(`${b.nom} ${b.prenom}`);
        }
        return 0;
      });
  }, [users, searchTerm, roleFilter, statusFilter, sortBy]);

  // Gérer les actions sur les utilisateurs
  const handleUserAction = async (userId: string, action: string) => {
    try {
      setActionLoading(userId);
      let updateData: Partial<User> = {};
      switch (action) {
        case 'approve':
          updateData = { statut: 1 };
          break;
        case 'reject':
          updateData = { statut: 2 };
          break;
        case 'ban':
          updateData = { statut: 0 };
          break;
        case 'edit':
          const user = users.find(u => u.uid === userId);
          if (user) setEditUser(user);
          return;
        default:
          return;
      }
      await updateDocument('Users', userId, updateData);
      setUsers(users.map(user => (user.uid === userId ? { ...user, ...updateData } : user)));
    } catch (error) {
      console.error(`Erreur lors de l'action ${action} pour l'utilisateur ${userId}:`, error);
      setError(`Erreur lors de l'action ${action}. Veuillez réessayer.`);
    } finally {
      setActionLoading(null);
    }
  };

  // Composant UserCard
  const UserCard = ({ user }: { user: User }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold">
           
            {user.photoProfil ? (
            <img
              src={user.photoProfil}
              alt={`Photo de profil de ${user.prenom} ${user.nom}`}
              className="w-12 h-12 rounded-full object-cover"
              onError={(e) => {
                // En cas d'erreur de chargement de l'image, on peut forcer l'affichage de l'avatar par défaut
                e.currentTarget.style.display = 'none';
                e.currentTarget.nextElementSibling?.classList.remove('hidden');
              }}
            />
          ) : `${user.prenom[0]}${user.nom[0]}`.toUpperCase()}
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">{`${user.prenom} ${user.nom}`}</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  getRoleLabel(user.typeUsersId) === 'Visiteurs'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                    : getRoleLabel(user.typeUsersId) === 'Locataires'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                    : getRoleLabel(user.typeUsersId) === 'Proprietaire'
                    ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                    : getRoleLabel(user.typeUsersId) === 'Administrateur'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : getRoleLabel(user.typeUsersId) === 'Agence immobilière'
                    ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                    : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
                }`}
              >
                {getRoleLabel(user.typeUsersId)}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  getStatusLabel(user.statut) === 'actif'
                    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                    : getStatusLabel(user.statut) === 'banni'
                    ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300'
                    : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                }`}
              >
                {getStatusLabel(user.statut)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setSelectedUser(user)}
            className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
            title="Voir profil"
            aria-label="Voir le profil de l'utilisateur"
            disabled={actionLoading === user.uid}
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleUserAction(user.uid, 'edit')}
            className="p-2 text-gray-400 hover:text-orange-500 transition-colors"
            title="Modifier"
            aria-label="Modifier l'utilisateur"
            disabled={actionLoading === user.uid}
          >
            <Edit className="w-4 h-4" />
          </button>
          {getStatusLabel(user.statut) === 'en_attente' && (
            <>
              <button
                onClick={() => handleUserAction(user.uid, 'approve')}
                className="p-2 text-gray-400 hover:text-green-500 transition-colors"
                title="Valider"
                aria-label="Valider l'utilisateur"
                disabled={actionLoading === user.uid}
              >
                <Check className="w-4 h-4" />
              </button>
              <button
                onClick={() => handleUserAction(user.uid, 'reject')}
                className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                title="Rejeter"
                aria-label="Rejeter l'utilisateur"
                disabled={actionLoading === user.uid}
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
          {getStatusLabel(user.statut) !== 'banni' && (
            <button
              onClick={() => handleUserAction(user.uid, 'ban')}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
              title="Bannir"
              aria-label="Bannir l'utilisateur"
              disabled={actionLoading === user.uid}
            >
              <Ban className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>
          <span className="text-gray-500 dark:text-gray-400">Localisation:</span>
          <p className="font-medium text-gray-900 dark:text-white">{user.addresse}</p>
        </div>
        <div>
          <span className="text-gray-500 dark:text-gray-400">Dernière mise à jour:</span>
          <p className="font-medium text-gray-900 dark:text-white">{formatDate(user.lastUpdated)}</p>
        </div>
      </div>

      {(user.cniRecto || user.cniVerso) && (
        <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
          <p className="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
            Documents en attente de validation
          </p>
          <div className="flex space-x-2 mt-2">
            {user.cniRecto && (
              <span className="text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                CNI Recto
              </span>
            )}
            {user.cniVerso && (
              <span className="text-xs bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-200 px-2 py-1 rounded">
                CNI Verso
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return <div className="p-6">Chargement des utilisateurs...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">{error}</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gestion des Utilisateurs</h1>
          <p className="text-gray-500 dark:text-gray-400">
            {filteredUsers.length} utilisateur(s) trouvé(s)
          </p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition-colors"
          aria-label="Ajouter un nouvel utilisateur"
        >
          <Plus className="w-4 h-4" />
          <span>Ajouter utilisateur</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Rechercher par nom ou email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
              aria-label="Rechercher des utilisateurs par nom ou email"
            />
          </div>

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            aria-label="Filtrer par rôle"
          >
            <option value="all">Tous les rôles</option>
            <option value="Visiteurs">Visiteurs</option>
            <option value="Locataires">Locataires</option>
            <option value="Proprietaire">Propriétaire</option>
            <option value="Agence immobilière">Agence immobilière</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            aria-label="Filtrer par statut"
          >
            <option value="all">Tous les statuts</option>
            <option value="actif">Actif</option>
            <option value="en_attente">En attente</option>
            <option value="banni">Banni</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent dark:bg-slate-700 dark:text-white"
            aria-label="Trier par"
          >
            <option value="lastUpdated">Dernière mise à jour</option>
            <option value="name">Nom</option>
          </select>
        </div>
      </div>

      {/* Liste des utilisateurs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredUsers.map(user => (
          <UserCard key={user.uid} user={user} />
        ))}
      </div>

      {/* Modal de profil utilisateur */}
      {selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200 dark:border-slate-700">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                  Profil de {`${selectedUser.prenom} ${selectedUser.nom}`}
                </h2>
                <button
                  onClick={() => setSelectedUser(null)}
                  className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                  aria-label="Fermer le profil"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-xl">
                  {`${selectedUser.prenom[0]}${selectedUser.nom[0]}`.toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {`${selectedUser.prenom} ${selectedUser.nom}`}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">{selectedUser.email}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        getRoleLabel(selectedUser.typeUsersId) === 'Visiteurs'
                          ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300'
                          : getRoleLabel(selectedUser.typeUsersId) === 'Locataires'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          : getRoleLabel(selectedUser.typeUsersId) === 'Administrateur'
                          ? 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
                          : getRoleLabel(selectedUser.typeUsersId) === 'Proprietaire'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          : getRoleLabel(selectedUser.typeUsersId) === 'Agence immobilière'
                          ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-300'
                          : 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-300'
                      }`}
                    >
                      {getRoleLabel(selectedUser.typeUsersId)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        getStatusLabel(selectedUser.statut) === 'actif'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300'
                          : getStatusLabel(selectedUser.statut) === 'banni'
                          ? 'bg-red-100 text-red-800 dark:bg red-900/20 dark:text-red-300'
                          : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300'
                      }`}
                    >
                      {getStatusLabel(selectedUser.statut)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Informations</h4>
                  <div className="space-y-2 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Localisation:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{selectedUser.addresse}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Dernière mise à jour:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{formatDate(selectedUser.lastUpdated)}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Téléphone:</span>
                      <span className="ml-2 text-gray-900 dark:text-white">{selectedUser.telephone}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-2">Actions</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => handleUserAction(selectedUser.uid, 'edit')}
                      className="w-full text-left px-3 py-2 text-sm text-orange-600 hover:bg-orange-50 dark:hover:bg-orange-900/20 rounded-lg transition-colors"
                      aria-label="Modifier les informations de l'utilisateur"
                      disabled={actionLoading === selectedUser.uid}
                    >
                      Modifier les informations
                    </button>
                    <button
                      className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      aria-label="Voir l'historique de l'utilisateur"
                      disabled
                    >
                      Voir l'historique
                    </button>
                    <button
                      onClick={() => handleUserAction(selectedUser.uid, 'ban')}
                      className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      aria-label="Suspendre le compte de l'utilisateur"
                      disabled={actionLoading === selectedUser.uid}
                    >
                      Suspendre le compte
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {editUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Modifier l'utilisateur</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  await updateDocument('Users', editUser.uid, {
                    nom: editUser.nom,
                    prenom: editUser.prenom,
                    email: editUser.email,
                    typeUsersId: editUser.typeUsersId,
                    statut: editUser.statut,
                  });
                  setUsers(users.map(user => (user.uid === editUser.uid ? editUser : user)));
                  setEditUser(null);
                } catch (error) {
                  console.error('Erreur lors de la mise à jour :', error);
                  setError('Erreur lors de la mise à jour de l’utilisateur. Veuillez réessayer.');
                }
              }}
            >
              <input
                type="text"
                value={editUser.nom}
                onChange={(e) => setEditUser({ ...editUser, nom: e.target.value })}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-white"
                placeholder="Nom"
                required
                aria-label="Nom de l'utilisateur"
              />
              <input
                type="text"
                value={editUser.prenom}
                onChange={(e) => setEditUser({ ...editUser, prenom: e.target.value })}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-white"
                placeholder="Prénom"
                required
                aria-label="Prénom de l'utilisateur"
              />
              <input
                type="email"
                value={editUser.email}
                onChange={(e) => setEditUser({ ...editUser, email: e.target.value })}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-white"
                placeholder="Email"
                required
                aria-label="Email de l'utilisateur"
              />
              <select
                value={editUser.typeUsersId}
                onChange={(e) => setEditUser({ ...editUser, typeUsersId: Number(e.target.value) })}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-white"
                aria-label="Rôle de l'utilisateur"
              >
                <option value={1}>Client</option>
                <option value={2}>Propriétaire</option>
                <option value={3}>Agent</option>
                <option value={4}>Agence</option>
              </select>
              <select
                value={editUser.statut}
                onChange={(e) => setEditUser({ ...editUser, statut: Number(e.target.value) })}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-white"
                aria-label="Statut de l'utilisateur"
              >
                <option value={1}>Actif</option>
                <option value={0}>Banni</option>
                <option value={2}>En attente</option>
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  aria-label="Annuler la modification"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  aria-label="Enregistrer les modifications"
                >
                  Enregistrer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'ajout */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full p-6">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ajouter un utilisateur</h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const userData = {
                    ...newUser,
                    uid: newUser.email || Date.now().toString(), // À ajuster selon votre logique Firestore
                    lastUpdated: new Date().toISOString(),
                    notificationPrefs: {
                      messages: true,
                      newProperties: true,
                      payments: true,
                      reservations: true,
                      visits: true,
                    },
                  };
                  await updateDocument('Users', userData.uid, userData);
                  setUsers([...users, userData as User]);
                  setShowAddModal(false);
                  setNewUser({ nom: '', prenom: '', email: '', typeUsersId: 3, statut: 1 });
                } catch (error) {
                  console.error('Erreur lors de la création de l’utilisateur :', error);
                  setError('Erreur lors de la création de l’utilisateur. Veuillez réessayer.');
                }
              }}
            >
              <input
                type="text"
                value={newUser.nom || ''}
                onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-white"
                placeholder="Nom"
                required
                aria-label="Nom du nouvel utilisateur"
              />
              <input
                type="text"
                value={newUser.prenom || ''}
                onChange={(e) => setNewUser({ ...newUser, prenom: e.target.value })}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-white"
                placeholder="Prénom"
                required
                aria-label="Prénom du nouvel utilisateur"
              />
              <input
                type="email"
                value={newUser.email || ''}
                onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-white"
                placeholder="Email"
                required
                aria-label="Email du nouvel utilisateur"
              />
              <select
                value={newUser.typeUsersId}
                onChange={(e) => setNewUser({ ...newUser, typeUsersId: Number(e.target.value) })}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-white"
                aria-label="Rôle du nouvel utilisateur"
              >
                <option value={1}>Client</option>
                <option value={2}>Propriétaire</option>
                <option value={3}>Agent</option>
                <option value={4}>Agence</option>
              </select>
              <select
                value={newUser.statut}
                onChange={(e) => setNewUser({ ...newUser, statut: Number(e.target.value) })}
                className="w-full p-2 mb-4 border border-gray-300 rounded-lg dark:bg-slate-700 dark:text-white"
                aria-label="Statut du nouvel utilisateur"
              >
                <option value={1}>Actif</option>
                <option value={0}>Banni</option>
                <option value={2}>En attente</option>
              </select>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                  aria-label="Annuler l'ajout"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
                  aria-label="Ajouter l'utilisateur"
                >
                  Ajouter
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}