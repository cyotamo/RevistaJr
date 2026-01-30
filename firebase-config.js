import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyB2tYaLoS4VgdQzVuE3620UL0NRbniFnnM",
  authDomain: "econogest360.firebaseapp.com",
  projectId: "econogest360",
  storageBucket: "econogest360.firebasestorage.app",
  messagingSenderId: "708803473748",
  appId: "1:708803473748:web:24d56e9576006b7971d8c1"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Função para login
window.loginFirebase = function(email, senha) {
  return signInWithEmailAndPassword(auth, email, senha);
};

// Função para logout
window.logoutFirebase = function() {
  return signOut(auth);
};

// Verificar estado do utilizador
window.verificarAuth = function(callback) {
  onAuthStateChanged(auth, callback);
};
