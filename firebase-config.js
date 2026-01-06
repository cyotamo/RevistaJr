import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyAECESMJPgsDRgJW1KSQlKXXslX_fC24ew",
  authDomain: "revista-facee.firebaseapp.com",
  projectId: "revista-facee",
  storageBucket: "revista-facee.firebasestorage.app",
  messagingSenderId: "12711898318",
  appId: "1:12711898318:web:ede6211057939a09fa749f"
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
