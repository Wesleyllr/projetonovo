import { addProduct } from "@/scripts/productService";
import { auth } from "@/firebaseConfig";

export const addNewProduct = async (productData) => {
  const user = auth.currentUser;
  if (!user) throw new Error("Usuário não autenticado");

  const {
    productName,
    productDescricao,
    precoNumerico,
    custoNumerico,
    selectedCategory,
    imageUrl,
    productCodigoBarra,
    selectedColor,
  } = productData;

  await addProduct(
    productName,
    productDescricao,
    precoNumerico,
    custoNumerico,
    selectedCategory,
    new Date().toISOString(),
    imageUrl,
    productCodigoBarra,
    selectedColor
  );
};
