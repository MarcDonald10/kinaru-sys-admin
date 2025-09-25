import {
  collection,
  doc,
  addDoc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  onSnapshot,
  runTransaction,
  writeBatch,
  serverTimestamp,
  DocumentReference,
  QueryDocumentSnapshot,
} from "firebase/firestore";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendPasswordResetEmail,
  updateProfile,
  onAuthStateChanged,
  signOut,
  getIdToken,
  User,
  UserCredential,
} from "firebase/auth";
import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  StorageReference,
  UploadTask,
  UploadTaskSnapshot,
} from "firebase/storage";
import { auth, db, storage, googleProvider, Timestamp, arrayUnion, arrayRemove, increment } from "./firebaseConfig";

// Interface pour les conditions de requête Firestore
interface QueryCondition {
  field: string;
  op: string;
  value: any;
}

// Interface pour les options de tri
interface OrderOption {
  field: string;
  direction: "asc" | "desc";
}

// Interface pour les options de requête
interface QueryOptions {
  collectionName: string;
  conditions?: QueryCondition[];
  orders?: OrderOption[];
  pageSize?: number;
  startAfterDoc?: QueryDocumentSnapshot;
}

// Interface pour les opérations de batch
interface BatchOperation {
  type: "set" | "update" | "delete";
  ref: DocumentReference;
  data?: any;
  merge?: boolean;
}

// Interface pour la progression du téléchargement
interface UploadProgress {
  progress: number;
  state: string;
  transferred: number;
  total: number;
}

// Fonction utilitaire pour valider le format d'un email
const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Fonction utilitaire pour valider une chaîne de caractères
const isValidString = (str: string): boolean =>
  typeof str === "string" && str.trim().length > 0;

/* =========================
 * AUTHENTIFICATION
 * ========================= */

/**
 * Crée un compte utilisateur avec email et mot de passe, avec un nom d'affichage optionnel.
 * @param email - Adresse email de l'utilisateur.
 * @param password - Mot de passe (doit respecter les exigences de Firebase).
 * @param displayName - Nom d'affichage optionnel.
 * @returns Objet utilisateur Firebase créé.
 * @throws Error si l'email ou le mot de passe est invalide ou si l'inscription échoue.
 */
export const signUpWithEmail = async (
  email: string,
  password: string,
  displayName?: string
): Promise<User> => {
  if (!isValidEmail(email)) throw new Error("Format d'email invalide");
  if (!isValidString(password)) throw new Error("Le mot de passe ne peut pas être vide");

  try {
    const { user } = await createUserWithEmailAndPassword(auth, email, password);
    if (isValidString(displayName)) {
      await updateProfile(user, { displayName });
    }
    return user;
  } catch (error: any) {
    throw new Error(`Échec de l'inscription : ${error.message}`);
  }
};

/**
 * Connecte un utilisateur avec email et mot de passe.
 * @param email - Adresse email de l'utilisateur.
 * @param password - Mot de passe de l'utilisateur.
 * @returns Objet UserCredential de Firebase.
 * @throws Error si l'email ou le mot de passe est invalide ou si la connexion échoue.
 */
export const signInWithEmail = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  if (!isValidEmail(email)) throw new Error("Format d'email invalide");
  if (!isValidString(password)) throw new Error("Le mot de passe ne peut pas être vide");

  try {
    return await signInWithEmailAndPassword(auth, email, password);
  } catch (error: any) {
    throw new Error(`Échec de la connexion : ${error.message}`);
  }
};

/**
 * Connecte un utilisateur via Google OAuth avec une fenêtre popup.
 * @returns Objet UserCredential de Firebase.
 * @throws Error si la connexion Google échoue.
 */
export const signInWithGoogle = async (): Promise<UserCredential> => {
  try {
    return await signInWithPopup(auth, googleProvider);
  } catch (error: any) {
    throw new Error(`Échec de la connexion Google : ${error.message}`);
  }
};

/**
 * Déconnecte l'utilisateur actuel.
 * @returns Résolu lorsque la déconnexion est terminée.
 * @throws Error si la déconnexion échoue.
 */
export const logout = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(`Échec de la déconnexion : ${error.message}`);
  }
};

/**
 * Écoute les changements d'état d'authentification.
 * @param callback - Fonction appelée avec l'utilisateur actuel ou null.
 * @returns Fonction pour arrêter l'écoute.
 * @throws Error si le callback n'est pas une fonction.
 */
export const onAuthChanged = (
  callback: (user: User | null) => void
): (() => void) => {
  if (typeof callback !== "function") throw new Error("Le callback doit être une fonction");
  return onAuthStateChanged(auth, callback);
};

/**
 * Envoie un email de réinitialisation de mot de passe.
 * @param email - Adresse email de l'utilisateur.
 * @returns Résolu lorsque l'email est envoyé.
 * @throws Error si l'email est invalide ou si l'envoi échoue.
 */
export const sendReset = async (email: string): Promise<void> => {
  if (!isValidEmail(email)) throw new Error("Format d'email invalide");
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    throw new Error(`Échec de la réinitialisation du mot de passe : ${error.message}`);
  }
};

/**
 * Met à jour le nom d'affichage de l'utilisateur actuel.
 * @param displayName - Nouveau nom d'affichage.
 * @returns Résolu si mis à jour, null si aucun utilisateur connecté.
 * @throws Error si la mise à jour échoue ou si l'entrée est invalide.
 */
export const updateUserDisplayName = async (
  displayName: string
): Promise<void | null> => {
  if (!auth.currentUser) return null;
  if (!isValidString(displayName)) throw new Error("Le nom d'affichage ne peut pas être vide");
  try {
    await updateProfile(auth.currentUser, { displayName });
  } catch (error: any) {
    throw new Error(`Échec de la mise à jour du nom d'affichage : ${error.message}`);
  }
};

/**
 * Récupère le jeton d'identification de l'utilisateur actuel.
 * @returns Le jeton ou null si aucun utilisateur connecté.
 * @throws Error si la récupération du jeton échoue.
 */
export const getCurrentUserToken = async (): Promise<string | null> => {
  if (!auth.currentUser) return null;
  try {
    return await getIdToken(auth.currentUser, true);
  } catch (error: any) {
    throw new Error(`Échec de la récupération du jeton : ${error.message}`);
  }
};

/* =========================
 * FIRESTORE - CRUD de base
 * ========================= */

/**
 * Ajoute un nouveau document à une collection Firestore avec des horodatages.
 * @param collectionName - Nom de la collection Firestore.
 * @param data - Données à stocker dans le document.
 * @returns ID du document créé.
 * @throws Error si le nom de la collection est invalide ou si l'opération échoue.
 */
export const addDocument = async (
  collectionName: string,
  data: any
): Promise<string> => {
  if (!isValidString(collectionName)) throw new Error("Nom de collection invalide");
  if (!data || typeof data !== "object") throw new Error("Les données doivent être un objet");

  try {
    const colRef = collection(db, collectionName);
    const docRef = await addDoc(colRef, {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });
    return docRef.id;
  } catch (error: any) {
    throw new Error(`Échec de l'ajout du document : ${error.message}`);
  }
};

/**
 * Définit ou fusionne un document avec un ID spécifique dans une collection.
 * @param collectionName - Nom de la collection Firestore.
 * @param id - ID du document.
 * @param data - Données à stocker ou fusionner.
 * @param merge - Fusionner avec les données existantes ou remplacer.
 * @returns ID du document.
 * @throws Error si les entrées sont invalides ou si l'opération échoue.
 */
export const setDocument = async (
  collectionName: string,
  id: string,
  data: any,
  merge: boolean = true
): Promise<string> => {
  if (!isValidString(collectionName)) throw new Error("Nom de collection invalide");
  if (!isValidString(id)) throw new Error("ID de document invalide");
  if (!data || typeof data !== "object") throw new Error("Les données doivent être un objet");

  try {
    const docRef = doc(db, collectionName, id);
    await setDoc(
      docRef,
      {
        ...data,
        updatedAt: serverTimestamp(),
        createdAt: data.createdAt ?? serverTimestamp(),
      },
      { merge }
    );
    return id;
  } catch (error: any) {
    throw new Error(`Échec de la définition du document : ${error.message}`);
  }
};

/**
 * Récupère un document par son ID.
 * @param collectionName - Nom de la collection Firestore.
 * @param id - ID du document.
 * @returns Données du document avec ID, ou null si non trouvé.
 * @throws Error si les entrées sont invalides ou si l'opération échoue.
 */
export const getDocumentById = async (
  collectionName: string,
  id: string
): Promise<any | null> => {
  if (!isValidString(collectionName)) throw new Error("Nom de collection invalide");
  if (!isValidString(id)) throw new Error("ID de document invalide");

  try {
    const docSnap = await getDoc(doc(db, collectionName, id));
    return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
  } catch (error: any) {
    throw new Error(`Échec de la récupération du document : ${error.message}`);
  }
};

/**
 * Récupère tous les documents d'une collection.
 * @param collectionName - Nom de la collection Firestore.
 * @returns Tableau de documents avec leurs IDs.
 * @throws Error si le nom de la collection est invalide ou si l'opération échoue.
 */
export const getCollection = async (collectionName: string): Promise<any[]> => {
  if (!isValidString(collectionName)) throw new Error("Nom de collection invalide");

  try {
    const snapshot = await getDocs(collection(db, collectionName));
    return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
  } catch (error: any) {
    throw new Error(`Échec de la récupération de la collection : ${error.message}`);
  }
};

/**
 * Met à jour un document avec les données fournies.
 * @param collectionName - Nom de la collection Firestore.
 * @param id - ID du document.
 * @param data - Données à mettre à jour.
 * @returns ID du document.
 * @throws Error si les entrées sont invalides ou si l'opération échoue.
 */
export const updateDocument = async (
  collectionName: string,
  id: string,
  data: any
): Promise<string> => {
  if (!isValidString(collectionName)) throw new Error("Nom de collection invalide");
  if (!isValidString(id)) throw new Error("ID de document invalide");
  if (!data || typeof data !== "object") throw new Error("Les données doivent être un objet");

  try {
    await updateDoc(doc(db, collectionName, id), {
      ...data,
      updatedAt: serverTimestamp(),
    });
    return id;
  } catch (error: any) {
    throw new Error(`Échec de la mise à jour du document : ${error.message}`);
  }
};

/**
 * Supprime un document par son ID.
 * @param collectionName - Nom de la collection Firestore.
 * @param id - ID du document.
 * @returns Résolu lorsque la suppression est terminée.
 * @throws Error si les entrées sont invalides ou si l'opération échoue.
 */
export const deleteDocumentById = async (
  collectionName: string,
  id: string
): Promise<void> => {
  if (!isValidString(collectionName)) throw new Error("Nom de collection invalide");
  if (!isValidString(id)) throw new Error("ID de document invalide");

  try {
    await deleteDoc(doc(db, collectionName, id));
  } catch (error: any) {
    throw new Error(`Échec de la suppression du document : ${error.message}`);
  }
};

/* =========================
 * FIRESTORE - Requêtes avancées
 * ========================= */

/**
 * Requête une collection Firestore avec conditions, tri et pagination.
 * @param options - Options de la requête.
 * @returns Résultats et dernier document visible.
 * @throws Error si les entrées sont invalides ou si la requête échoue.
 */
export const queryCollection = async ({
  collectionName,
  conditions = [],
  orders = [],
  pageSize,
  startAfterDoc,
}: QueryOptions): Promise<{ data: any[]; lastVisible: QueryDocumentSnapshot | null }> => {
  if (!isValidString(collectionName)) throw new Error("Nom de collection invalide");
  if (pageSize && (!Number.isInteger(pageSize) || pageSize <= 0)) {
    throw new Error("Taille de page invalide");
  }
  if (conditions.some((c) => !isValidString(c.field) || !isValidString(c.op))) {
    throw new Error("Conditions de requête invalides");
  }
  if (orders.some((o) => !isValidString(o.field) || !["asc", "desc"].includes(o.direction))) {
    throw new Error("Conditions de tri invalides");
  }

  try {
    let q = collection(db, collectionName);

    // Applique les clauses where
    if (conditions.length) {
      const whereClauses = conditions.map((c) => where(c.field, c.op, c.value));
      q = query(q, ...whereClauses);
    }

    // Applique les clauses orderBy
    if (orders.length) {
      const orderClauses = orders.map((o) => orderBy(o.field, o.direction || "asc"));
      q = query(q, ...orderClauses);
    }

    // Applique la limite
    if (pageSize) {
      q = query(q, limit(pageSize));
    }

    // Applique la pagination
    if (startAfterDoc) {
      q = query(q, startAfter(startAfterDoc));
    }

    const snap = await getDocs(q);
    const data = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
    const lastVisible = snap.docs[snap.docs.length - 1] || null;

    return { data, lastVisible };
  } catch (error: any) {
    throw new Error(`Échec de la requête de collection : ${error.message}`);
  }
};

/* =========================
 * FIRESTORE - Écouteurs en temps réel
 * ========================= */

/**
 * Écoute les mises à jour en temps réel d'une collection Firestore.
 * @param collectionName - Nom de la collection Firestore.
 * @param options - Options de requête (conditions, tri, taille de page).
 * @param callback - Fonction appelée avec les documents mis à jour.
 * @param errorCallback - Fonction appelée en cas d'erreur.
 * @returns Fonction pour arrêter l'écoute.
 * @throws Error si les entrées sont invalides.
 */
export const listenToCollection = (
  collectionName: string,
  { conditions = [], orders = [], pageSize }: Partial<QueryOptions> = {},
  callback: (docs: any[]) => void,
  errorCallback?: (error: Error) => void
): (() => void) => {
  if (!isValidString(collectionName)) throw new Error("Nom de collection invalide");
  if (typeof callback !== "function") throw new Error("Le callback doit être une fonction");
  if (pageSize && (!Number.isInteger(pageSize) || pageSize <= 0)) {
    throw new Error("Taille de page invalide");
  }

  let q = collection(db, collectionName);

  if (conditions.length) {
    const whereClauses = conditions.map((c) => where(c.field, c.op, c.value));
    q = query(q, ...whereClauses);
  }

  if (orders.length) {
    const orderClauses = orders.map((o) => orderBy(o.field, o.direction || "asc"));
    q = query(q, ...orderClauses);
  }

  if (pageSize) {
    q = query(q, limit(pageSize));
  }

  return onSnapshot(
    q,
    (snapshot) => {
      const docs = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      callback(docs);
    },
    (error) =>
      errorCallback?.(new Error(`Échec de l'écoute de la collection : ${error.message}`))
  );
};

/**
 * Écoute les mises à jour en temps réel d'un document spécifique.
 * @param collectionName - Nom de la collection Firestore.
 * @param id - ID du document.
 * @param callback - Fonction appelée avec le document mis à jour ou null.
 * @param errorCallback - Fonction appelée en cas d'erreur.
 * @returns Fonction pour arrêter l'écoute.
 * @throws Error si les entrées sont invalides.
 */
export const listenToDocument = (
  collectionName: string,
  id: string,
  callback: (doc: any | null) => void,
  errorCallback?: (error: Error) => void
): (() => void) => {
  if (!isValidString(collectionName)) throw new Error("Nom de collection invalide");
  if (!isValidString(id)) throw new Error("ID de document invalide");
  if (typeof callback !== "function") throw new Error("Le callback doit être une fonction");

  const docRef = doc(db, collectionName, id);
  return onSnapshot(
    docRef,
    (docSnap) => {
      callback(docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null);
    },
    (error) => errorCallback?.(new Error(`Échec de l'écoute du document : ${error.message}`))
  );
};

/* =========================
 * FIRESTORE - Batch & Transactions
 * ========================= */

/**
 * Exécute un lot d'opérations d'écriture Firestore.
 * @param operations - Opérations du lot.
 * @returns Résolu lorsque le lot est validé.
 * @throws Error si les opérations sont invalides ou si la validation échoue.
 */
export const runBatch = async (operations: BatchOperation[]): Promise<void> => {
  if (!Array.isArray(operations) || !operations.length) {
    throw new Error("Les opérations doivent être un tableau non vide");
  }

  const batch = writeBatch(db);
  operations.forEach((op) => {
    if (!["set", "update", "delete"].includes(op.type)) {
      throw new Error(`Type d'opération invalide : ${op.type}`);
    }
    if (op.type === "set") {
      if (!op.data || typeof op.data !== "object")
        throw new Error("Les données doivent être un objet pour set");
      batch.set(op.ref, op.data, { merge: !!op.merge });
    }
    if (op.type === "update") {
      if (!op.data || typeof op.data !== "object")
        throw new Error("Les données doivent être un objet pour update");
      batch.update(op.ref, op.data);
    }
    if (op.type === "delete") batch.delete(op.ref);
  });

  try {
    await batch.commit();
  } catch (error: any) {
    throw new Error(`Échec de l'opération de lot : ${error.message}`);
  }
};

/**
 * Exécute une transaction Firestore.
 * @param transactionFn - Fonction de transaction.
 * @returns Résultat de la transaction.
 * @throws Error si la transaction échoue ou si l'entrée est invalide.
 */
export const runFsTransaction = async (
  transactionFn: (transaction: any) => Promise<any>
): Promise<any> => {
  if (typeof transactionFn !== "function")
    throw new Error("Une fonction de transaction doit être fournie");

  try {
    return await runTransaction(db, transactionFn);
  } catch (error: any) {
    throw new Error(`Échec de la transaction : ${error.message}`);
  }
};

/* =========================
 * STORAGE
 * ========================= */

/**
 * Télécharge un fichier vers Firebase Storage et renvoie son URL de téléchargement.
 * @param path - Chemin de stockage du fichier.
 * @param fileOrBlob - Fichier ou Blob à télécharger.
 * @returns URL de téléchargement du fichier.
 * @throws Error si les entrées sont invalides ou si le téléchargement échoue.
 */
export const uploadFile = async (path: string, fileOrBlob: File | Blob): Promise<string> => {
  if (!isValidString(path)) throw new Error("Chemin de stockage invalide");
  if (!(fileOrBlob instanceof File || fileOrBlob instanceof Blob)) {
    throw new Error("Un fichier ou Blob est requis");
  }

  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, fileOrBlob);
    return await getDownloadURL(storageRef);
  } catch (error: any) {
    throw new Error(`Échec du téléchargement du fichier : ${error.message}`);
  }
};

/**
 * Télécharge un fichier vers Firebase Storage avec suivi de la progression.
 * @param path - Chemin de stockage du fichier.
 * @param fileOrBlob - Fichier ou Blob à télécharger.
 * @param onProgress - Callback de progression.
 * @returns Tâche de téléchargement et promesse résolue avec l'URL.
 * @throws Error si les entrées sont invalides ou si le téléchargement échoue.
 */
export const uploadFileWithProgress = (
  path: string,
  fileOrBlob: File | Blob,
  onProgress?: (progress: UploadProgress) => void
): { task: UploadTask; promise: Promise<string> } => {
  if (!isValidString(path)) throw new Error("Chemin de stockage invalide");
  if (!(fileOrBlob instanceof File || fileOrBlob instanceof Blob)) {
    throw new Error("Un fichier ou Blob est requis");
  }
  if (onProgress && typeof onProgress !== "function") {
    throw new Error("onProgress doit être une fonction");
  }

  const storageRef = ref(storage, path);
  const task = uploadBytesResumable(storageRef, fileOrBlob);

  task.on(
    "state_changed",
    (snapshot: UploadTaskSnapshot) => {
      if (onProgress) {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        onProgress({
          progress,
          state: snapshot.state,
          transferred: snapshot.bytesTransferred,
          total: snapshot.totalBytes,
        });
      }
    },
    (error: any) => {
      throw new Error(`Échec de la progression du téléchargement : ${error.message}`);
    }
  );

  const promise = new Promise<string>((resolve, reject) => {
    task.on(
      "state_changed",
      null,
      reject,
      async () => {
        try {
          const url = await getDownloadURL(task.snapshot.ref);
          resolve(url);
        } catch (error: any) {
          reject(new Error(`Échec de la récupération de l'URL : ${error.message}`));
        }
      }
    );
  });

  return { task, promise };
};

/**
 * Récupère l'URL de téléchargement d'un fichier dans Firebase Storage.
 * @param path - Chemin de stockage du fichier.
 * @returns URL de téléchargement du fichier.
 * @throws Error si le chemin est invalide ou si la récupération échoue.
 */
export const getFileURL = async (path: string): Promise<string> => {
  if (!isValidString(path)) throw new Error("Chemin de stockage invalide");

  try {
    return await getDownloadURL(ref(storage, path));
  } catch (error: any) {
    throw new Error(`Échec de la récupération de l'URL du fichier : ${error.message}`);
  }
};

/**
 * Supprime un fichier de Firebase Storage.
 * @param path - Chemin de stockage du fichier.
 * @returns Résolu lorsque la suppression est terminée.
 * @throws Error si le chemin est invalide ou si la suppression échoue.
 */
export const deleteFile = async (path: string): Promise<void> => {
  if (!isValidString(path)) throw new Error("Chemin de stockage invalide");

  try {
    await deleteObject(ref(storage, path));
  } catch (error: any) {
    throw new Error(`Échec de la suppression du fichier : ${error.message}`);
  }
};

// Export des utilitaires Firestore
export { serverTimestamp, Timestamp, arrayUnion, arrayRemove, increment };