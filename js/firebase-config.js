// Configuração do Firebase
const firebaseConfig = {
  // Adicione suas credenciais do Firebase aqui
  apiKey: "AIzaSyCHOFjKBxvKhzLkk18vOhzmoKZyCPmevyM",
  authDomain: "waltemar-app.firebaseapp.com",
  projectId: "waltemar-app",
  storageBucket: "waltemar-app.firebasestorage.app",
  messagingSenderId: "385613786432",
  appId: "1:385613786432:web:2a98629d67efe7f4f89ea5",
  measurementId: "G-WPEEZ3H5X8"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Inicializar Analytics
const analytics = firebase.analytics();
