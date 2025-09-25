import { User, Property, Transaction, Contract, Message, Partner, ActivityLog, Statistics } from '../types';

export const mockUsers: User[] = [
  {
    uid: '1',
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@email.com',
    telephone: '+33612345678',
    photoProfil: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=150&h=150&fit=crop',
    cniNumber: 'FR123456789',
    CNIDateDelivrer: '2020-01-15',
    cniExpirationDate: '2030-01-15',
    cniRecto: 'cni-recto-1.jpg',
    cniVerso: 'cni-verso-1.jpg',
    addresse: '123 rue de Paris, 75001 Paris',
    fcmToken: 'fcm-token-1',
    lastUpdated: '2025-01-27',
    etat: 1,
    statut: 1,
    typeUsersId: 1,
    notificationPrefs: {
      messages: true,
      newProperties: true,
      payments: true,
      reservations: true,
      visits: true
    }
  }
];

// Générer plus d'utilisateurs
for (let i = 2; i <= 40; i++) {
  mockUsers.push({
    uid: i.toString(),
    nom: `Nom${i}`,
    prenom: `Prenom${i}`,
    email: `user${i}@email.com`,
    telephone: `+336${Math.floor(10000000 + Math.random() * 90000000)}`,
    photoProfil: `https://images.pexels.com/photos/${220453 + i}/pexels-photo-${220453 + i}.jpeg?w=150&h=150&fit=crop`,
    cniNumber: `FR${Math.floor(100000000 + Math.random() * 900000000)}`,
    CNIDateDelivrer: '2020-01-15',
    cniExpirationDate: '2030-01-15',
    cniRecto: `cni-recto-${i}.jpg`,
    cniVerso: `cni-verso-${i}.jpg`,
    addresse: `${i} rue de Paris, 75001 Paris`,
    fcmToken: `fcm-token-${i}`,
    lastUpdated: `2025-01-${Math.floor(Math.random() * 27) + 1}`,
    etat: Math.floor(Math.random() * 3),
    statut: Math.floor(Math.random() * 3),
    typeUsersId: Math.floor(Math.random() * 3) + 1,
    notificationPrefs: {
      messages: Math.random() > 0.5,
      newProperties: Math.random() > 0.5,
      payments: Math.random() > 0.5,
      reservations: Math.random() > 0.5,
      visits: Math.random() > 0.5
    }
  });
}

export const mockProperties: Property[] = [
  {
    id: '1',
    name: 'Appartement Centre Paris',
    description: 'Magnifique appartement 3 pièces au cœur de Paris',
    type: 'residentiel',
    status: 'libre',
    validationStatus: 'accepte',
    price: 2500,
    location: 'Paris 1er',
    coordinates: [48.8566, 2.3522],
    surface: 75,
    images: ['https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?w=300&h=200&fit=crop'],
    ownerId: '2',
    createdDate: '2025-01-15'
  },
  {
    id: '2',
    name: 'Bureau Lyon Part-Dieu',
    description: 'Espace de bureau moderne dans quartier d\'affaires',
    type: 'commercial',
    status: 'occupe',
    validationStatus: 'accepte',
    price: 3500,
    location: 'Lyon 3ème',
    coordinates: [45.7640, 4.8357],
    surface: 120,
    images: ['https://images.pexels.com/photos/276724/pexels-photo-276724.jpeg?w=300&h=200&fit=crop'],
    ownerId: '2',
    createdDate: '2025-01-10'
  }
];

// Générer plus de propriétés
for (let i = 3; i <= 25; i++) {
  const types = ['residentiel', 'commercial'];
  const statuses = ['libre', 'occupe', 'reserve'];
  const validationStatuses = ['accepte', 'rejete', 'en_attente'];
  const locations = ['Paris', 'Lyon', 'Marseille', 'Toulouse', 'Nice', 'Bordeaux'];
  const coords = {
    'Paris': [48.8566, 2.3522],
    'Lyon': [45.7640, 4.8357],
    'Marseille': [43.2965, 5.3698],
    'Toulouse': [43.6047, 1.4442],
    'Nice': [43.7102, 7.2620],
    'Bordeaux': [44.8378, -0.5792]
  };
  
  const location = locations[Math.floor(Math.random() * locations.length)];
  
  mockProperties.push({
    id: i.toString(),
    name: `Propriété ${i}`,
    description: `Description de la propriété ${i}`,
    type: types[Math.floor(Math.random() * types.length)] as any,
    status: statuses[Math.floor(Math.random() * statuses.length)] as any,
    validationStatus: validationStatuses[Math.floor(Math.random() * validationStatuses.length)] as any,
    price: Math.floor(Math.random() * 5000) + 500,
    location,
    coordinates: coords[location as keyof typeof coords] as [number, number],
    surface: Math.floor(Math.random() * 200) + 30,
    images: [`https://images.pexels.com/photos/${271624 + i}/pexels-photo-${271624 + i}.jpeg?w=300&h=200&fit=crop`],
    ownerId: Math.floor(Math.random() * 40) + 1 + '',
    createdDate: `2025-01-${Math.floor(Math.random() * 27) + 1}`
  });
}

export const mockTransactions: Transaction[] = [];
for (let i = 1; i <= 50; i++) {
  const types = ['loyer', 'frais_reservation', 'abonnement', 'commission'];
  const statuses = ['paye', 'en_attente', 'annule'];
  
  mockTransactions.push({
    id: i.toString(),
    amount: Math.floor(Math.random() * 5000) + 100,
    type: types[Math.floor(Math.random() * types.length)] as any,
    date: `2025-01-${Math.floor(Math.random() * 27) + 1}`,
    status: statuses[Math.floor(Math.random() * statuses.length)] as any,
    userId: Math.floor(Math.random() * 40) + 1 + '',
    propertyId: Math.floor(Math.random() * 25) + 1 + '',
    description: `Transaction ${i}`
  });
}

export const mockContracts: Contract[] = [];
for (let i = 1; i <= 20; i++) {
  const statuses = ['actif', 'expire', 'resilié'];
  
  mockContracts.push({
    id: i.toString(),
    tenantId: Math.floor(Math.random() * 40) + 1 + '',
    ownerId: Math.floor(Math.random() * 40) + 1 + '',
    propertyId: Math.floor(Math.random() * 25) + 1 + '',
    startDate: `2025-01-${Math.floor(Math.random() * 27) + 1}`,
    endDate: `2025-12-${Math.floor(Math.random() * 27) + 1}`,
    monthlyRent: Math.floor(Math.random() * 3000) + 500,
    status: statuses[Math.floor(Math.random() * statuses.length)] as any,
    signatureStatus: Math.random() > 0.5 ? 'signe' : 'en_attente'
  });
}

export const mockMessages: Message[] = [];
for (let i = 1; i <= 150; i++) {
  const statuses = ['lu', 'non_lu'];
  const types = ['message', 'notification'];
  
  mockMessages.push({
    id: i.toString(),
    senderId: Math.floor(Math.random() * 40) + 1 + '',
    receiverId: Math.floor(Math.random() * 40) + 1 + '',
    content: `Contenu du message ${i}`,
    timestamp: `2025-01-${Math.floor(Math.random() * 27) + 1}T${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}:00`,
    status: statuses[Math.floor(Math.random() * statuses.length)] as any,
    type: types[Math.floor(Math.random() * types.length)] as any,
    flagged: Math.random() > 0.8
  });
}

export const mockPartners: Partner[] = [
  {
    id: '1',
    name: 'Banque Populaire',
    type: 'banque',
    contact: '+33 1 23 45 67 89',
    email: 'partenariat@banquepop.fr',
    services: ['Prêts immobiliers', 'Garanties locatives'],
    contractEnd: '2025-12-31'
  },
  {
    id: '2',
    name: 'Assurance Habitat',
    type: 'assurance',
    contact: '+33 1 23 45 67 90',
    email: 'pro@assurhabitat.fr',
    services: ['Assurance habitation', 'Assurance propriétaire'],
    contractEnd: '2025-11-30'
  }
];

// Générer plus de partenaires
for (let i = 3; i <= 10; i++) {
  const types = ['banque', 'assurance', 'maintenance'];
  
  mockPartners.push({
    id: i.toString(),
    name: `Partenaire ${i}`,
    type: types[Math.floor(Math.random() * types.length)] as any,
    contact: `+33 1 23 45 67 ${80 + i}`,
    email: `contact@partenaire${i}.fr`,
    services: ['Service 1', 'Service 2'],
    contractEnd: `2025-${Math.floor(Math.random() * 12) + 1}-30`
  });
}

export const mockActivityLogs: ActivityLog[] = [];
for (let i = 1; i <= 100; i++) {
  const actions = ['Création utilisateur', 'Modification propriété', 'Validation contrat', 'Suppression message'];
  
  mockActivityLogs.push({
    id: i.toString(),
    adminId: '4',
    action: actions[Math.floor(Math.random() * actions.length)],
    target: `Target ${i}`,
    timestamp: `2025-01-${Math.floor(Math.random() * 27) + 1}T${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}:00`,
    details: `Détails de l'action ${i}`
  });
}

export const mockStatistics: Statistics = {
  totalUsers: 40,
  totalProperties: 25,
  totalTransactions: 50,
  totalRevenue: 125000,
  usersByCity: {
    'Paris': 15,
    'Lyon': 8,
    'Marseille': 6,
    'Toulouse': 5,
    'Nice': 4,
    'Bordeaux': 2
  },
  propertiesByType: {
    'residentiel': 15,
    'commercial': 10
  },
  monthlyRevenue: [
    { month: 'Jan', revenue: 8000 },
    { month: 'Feb', revenue: 12000 },
    { month: 'Mar', revenue: 10000 },
    { month: 'Apr', revenue: 15000 },
    { month: 'May', revenue: 18000 },
    { month: 'Jun', revenue: 22000 }
  ],
  conversionRate: 68.5
};