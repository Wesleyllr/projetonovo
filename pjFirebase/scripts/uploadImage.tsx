import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { auth, storage } from "@/firebaseConfig"; // Importa o auth para pegar o userId

export const uploadImage = async (uri: string) => {
  try {
    // Verifica se o usuário está autenticado
    const user = auth.currentUser;
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error("Falha ao acessar a imagem. Status: " + response.status);
    }

    const blob = await response.blob();

    // Obtém o userId a partir do usuário autenticado
    const userId = user.uid; // Pega o ID do usuário autenticado
    const fileName = `encantoFotos/${userId}/${Date.now()}.jpg`; // Define o nome do arquivo com base no userId e timestamp

    // Cria a referência para o armazenamento do Firebase
    const storageRef = ref(storage, fileName);

    // Envia a imagem para o Firebase Storage
    await uploadBytes(storageRef, blob);

    // Obtém a URL de download da imagem
    const downloadURL = await getDownloadURL(storageRef);

    // Retorna a URL de download
    return downloadURL;
  } catch (error) {
    console.error("Erro ao enviar imagem:", error.message);
    throw error;
  }
};
