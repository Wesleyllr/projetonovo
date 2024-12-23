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
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não está autenticado");

  const productsRef = collection(db, `users/${user.uid}/products`);

  try {
    const querySnapshot = await getDocs(productsRef);

    if (querySnapshot.empty) {
      return [];
    }

    return querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      // Garantir que price seja um número
      value:
        typeof doc.data().value === "number"
          ? doc.data().value
          : parseFloat(doc.data().value || "0"),
    }));
  } catch (error) {
    throw new Error("Erro ao buscar produtos: " + error.message);
  }
};
