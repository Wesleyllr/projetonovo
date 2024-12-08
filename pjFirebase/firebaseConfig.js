import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
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

// Inicializa o Auth com persistência
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export { auth };
