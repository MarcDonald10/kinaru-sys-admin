export interface User {
  uid: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  photoProfil: string;
  cniNumber: string;
  CNIDateDelivrer: string;
  cniExpirationDate: string;
  cniRecto: string;
  cniVerso: string;
  addresse: string;
  fcmToken: string;
  lastUpdated: string;
  etat: number;
  statut: number;
  typeUsersId: number;
  notificationPrefs: {
    messages: boolean;
    newProperties: boolean;
    payments: boolean;
    reservations: boolean;
    visits: boolean;
  };
}


export interface Property {
  id: string;
  name: string;
  description: string;
  type: 'residentiel' | 'commercial';
  status: 'libre' | 'occupe' | 'reserve';
  validationStatus: 'accepte' | 'rejete' | 'en_attente';
  price: number;
  location: string;
  coordinates: [number, number];
  surface: number;
  images: string[];
  ownerId: string;
  createdDate: string;
}

export interface Transaction {
  id: string;
  amount: number;
  type: 'loyer' | 'frais_reservation' | 'abonnement' | 'commission';
  date: string;
  status: 'paye' | 'en_attente' | 'annule';
  userId: string;
  propertyId?: string;
  description: string;
}

export interface Contract {
  id: string;
  tenantId: string;
  ownerId: string;
  propertyId: string;
  startDate: string;
  endDate: string;
  monthlyRent: number;
  status: 'actif' | 'expire' | 'resilié';
  signatureStatus: 'en_attente' | 'signe';
}

export interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  status: 'lu' | 'non_lu';
  type: 'message' | 'notification';
  flagged?: boolean;
}

export interface Partner {
  id: string;
  name: string;
  type: 'banque' | 'assurance' | 'maintenance';
  contact: string;
  email: string;
  services: string[];
  contractEnd?: string;
}

export interface ActivityLog {
  id: string;
  adminId: string;
  action: string;
  target: string;
  timestamp: string;
  details: string;
}

export interface Statistics {
  totalUsers: number;
  totalProperties: number;
  totalTransactions: number;
  totalRevenue: number;
  usersByCity: Record<string, number>;
  propertiesByType: Record<string, number>;
  monthlyRevenue: Array<{ month: string; revenue: number }>;
  conversionRate: number;
}