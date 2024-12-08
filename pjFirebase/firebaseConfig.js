// firebaseConfig.js
import { initializeApp } from "firebase/app";
import {
  getAuth,
  browserLocalPersistence,
  setPersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyCsOvBG67DfpdhNzy72bo_dG91DnSQjYfE",
  authDomain: "pjfirebase-30a91.firebaseapp.com",
  projectId: "pjfirebase-30a91",
  storageBucket: "pjfirebase-30a91.firebasestorage.app",
  messagingSenderId: "272073001168",
  appId: "1:272073001168:web:4d2e1a3b76a64f7e2176d5",
  measurementId: "G-TFVKQ9EVCD",
};

const app = initializeApp(firebaseConfig);

// Inicializa a autenticação
const auth = getAuth(app);

// Configura a persistência com AsyncStorage
setPersistence(auth, browserLocalPersistence) // ou outro tipo de persistência adequado
  .catch((error) => {
    console.error("Error setting persistence: ", error);
  });

export { auth };
