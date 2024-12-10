import { doc, getDoc } from "firebase/firestore";
import { db, auth } from "@/firebaseConfig"; // Importando o Firestore e o Auth

// Função para buscar as informações do usuário
export const getUserInfo = async (field) => {
  const user = auth.currentUser;

  if (!user) {
    throw new Error("Usuário não está autenticado.");
  }

  const userRef = doc(db, "users", user.uid); // Referência ao documento do usuário
  const docSnap = await getDoc(userRef);

  if (docSnap.exists()) {
    return docSnap.data()[field]; // Retorna o campo solicitado
  } else {
    throw new Error("Usuário não encontrado.");
  }
};
