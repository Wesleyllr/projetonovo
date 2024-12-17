import { collection, addDoc } from "firebase/firestore";
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

    const docRef = await addDoc(productsRef, newProduct);
    console.log("Produto adicionado com ID:", docRef.id);
  } catch (error) {
    console.error("Erro ao adicionar o produto:", error.message);
  }
};
