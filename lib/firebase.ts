// Configuração e inicialização do Firebase
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

// Inicializar Firebase apenas uma vez (evitar múltiplas inicializações)
let app: FirebaseApp;
let analytics: Analytics | null = null;
let auth: Auth;
let db: Firestore;

// Função para inicializar o Firebase de forma segura
function initializeFirebase() {
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0];
  }
  
  return app;
}

// Inicializar app
app = initializeFirebase();

// Inicializar Analytics apenas no cliente e se suportado
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

// Inicializar Auth e Firestore (funcionam tanto no cliente quanto no servidor)
auth = getAuth(app);
db = getFirestore(app);

export { app, analytics, auth, db };
export default app;