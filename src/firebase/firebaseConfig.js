import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBQA7SLvpPiaJJOleQuf7el5zBTzMPGSnM",
  authDomain: "matricula-estudiantes-840dc.firebaseapp.com",
  projectId: "matricula-estudiantes-840dc",
  storageBucket: "matricula-estudiantes-840dc.firebasestorage.app",
  messagingSenderId: "932558281154",
  appId: "1:932558281154:web:6f40ba437e281a0f659e5b"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Obtén una referencia a Firestore
const db = getFirestore(app);

export { db };