// Importações do Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-firestore.js";

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCHOFjKBxvKhzLkk18vOhzmoKZyCPmevyM",
  authDomain: "waltemar-app.firebaseapp.com",
  projectId: "waltemar-app",
  storageBucket: "waltemar-app.firebasestorage.app",
  messagingSenderId: "385613786432",
  appId: "1:385613786432:web:2a98629d67efe7f4f89ea5",
  measurementId: "G-WPEEZ3H5X8"
};

// Inicialização do Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db, analytics };