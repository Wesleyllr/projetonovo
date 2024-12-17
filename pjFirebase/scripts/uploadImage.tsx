import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "@/firebaseConfig";

export const uploadImage = async (uri: string) => {
  try {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error("Falha ao acessar a imagem. Status: " + response.status);
    }
    const blob = await response.blob();
    const userId = "userIdExample"; // Replace with the actual user ID
    const fileName = `encantoFotos/${userId}/${Date.now()}.jpg`;
    const storageRef = ref(storage, fileName);

    await uploadBytes(storageRef, blob);
    const downloadURL = await getDownloadURL(storageRef);
    return downloadURL;
  } catch (error) {
    console.error("Erro ao enviar imagem:", error.message);
    throw error;
  }
};
