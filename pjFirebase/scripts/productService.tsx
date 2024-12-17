import { collection, addDoc, getDocs } from "firebase/firestore";
import { db, auth } from "@/firebaseConfig";

export const addProduct = async (
  title: string,
  description: string,
  value: number,
  category: string,
  date: string,
  imageUrl: string
) => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error("Usuário não autenticado.");
    }

    const productsRef = collection(db, "users", userId, "products");
    const newProduct = {
      title,
      description,
      value,
      category,
      date,
      imageUrl,
    };

    await addDoc(productsRef, newProduct);
  } catch (error) {
    console.error("Erro ao adicionar o produto:", error.message);
  }
};

export const getUserProducts = async () => {
  try {
    const userId = auth.currentUser?.uid;
    if (!userId) {
      throw new Error("Usuário não autenticado.");
    }

    const productsRef = collection(db, "users", userId, "products");
    const querySnapshot = await getDocs(productsRef);

    if (querySnapshot.empty) {
      return []; // Retorna uma lista vazia ao invés de undefined
    }

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Erro ao buscar produtos do usuário:", error.message);
    return []; // Em caso de erro, retorna lista vazia
  }
};
