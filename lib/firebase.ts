// Configuração e inicialização do Firebase
// IMPORTANTE: Este módulo só deve ser usado em componentes client-side ('use client')

import { initializeApp, getApps, FirebaseApp } from "firebase/app";
import { getAnalytics, Analytics, isSupported } from "firebase/analytics";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyDbnDRLC546eE0fcBzFfEA0MSZeigeHE-Y",
  authDomain: "taverna-rpg-store.firebaseapp.com",
  projectId: "taverna-rpg-store",
  storageBucket: "taverna-rpg-store.firebasestorage.app",
  messagingSenderId: "692023501572",
  appId: "1:692023501572:web:7d3916f66b65c299ec2651",
  measurementId: "G-KWLLLCK147"
};

// Inicializar Firebase apenas no cliente
let firebaseApp: FirebaseApp | null = null;
let firebaseAnalytics: Analytics | null = null;
let firebaseAuth: Auth | null = null;
let firebaseDb: Firestore | null = null;

function initializeFirebase() {
  // Só inicializar no cliente
  if (typeof window === "undefined") {
    return;
  }

  if (!firebaseApp) {
    if (getApps().length === 0) {
      firebaseApp = initializeApp(firebaseConfig);
    } else {
      firebaseApp = getApps()[0];
    }

    firebaseAuth = getAuth(firebaseApp);
    firebaseDb = getFirestore(firebaseApp);

    // Inicializar Analytics assincronamente
    isSupported().then((supported) => {
      if (supported && firebaseApp) {
        firebaseAnalytics = getAnalytics(firebaseApp);
      }
    });
  }
}

// Inicializar quando o módulo for carregado no cliente
if (typeof window !== "undefined") {
  initializeFirebase();
}

// Exportar instâncias (só disponíveis no cliente quando importado em 'use client')
// TypeScript pode reclamar que podem ser null, mas em componentes 'use client' nunca serão
export const app = firebaseApp as FirebaseApp | null;
export const auth = firebaseAuth as Auth | null;
export const db = firebaseDb as Firestore | null;
export const analytics = firebaseAnalytics as Analytics | null;

export default firebaseApp as FirebaseApp | null;
