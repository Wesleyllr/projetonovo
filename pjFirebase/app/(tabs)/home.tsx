import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "@/firebaseConfig";
import { uploadImage } from "@/scripts/uploadImage";
import { addProduct } from "@/scripts/productService";
import CustomButton from "@/components/CustomButton";
import CardProduto1 from "@/components/CardProduto1";
import CardProduto2 from "@/components/CardProduto2";
import { pickImagem } from "@/scripts/selecionarImagem";

const Home = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false); // Adiciona estado de carregamento para a imagem

  // Função para buscar informações do usuário
  const getUserInfo = async (field: string) => {
    try {
      // Suponha que você tenha o 'displayName' do usuário
      const user = auth.currentUser;
      if (user) {
        return user[field] || null; // Retorna o valor do campo
      }
      return null; // Retorna null se o usuário não estiver autenticado
    } catch (error) {
      console.error("Erro ao obter informações do usuário:", error);
      throw error;
    }
  };

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const username = await getUserInfo("displayName");
        setUserInfo(username);
      } catch (error) {
        Alert.alert("Erro", "Falha ao carregar informações do usuário.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, []);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        Alert.alert("Sucesso", "Você foi deslogado.");
        router.push("/login");
      })
      .catch((error) => {
        Alert.alert("Erro", error.message);
      });
  };

  const handleSelectImage = async () => {
    const uri = await pickImagem();
    if (uri) {
      setSelectedImage(uri);
    }
  };

  const handleAddProduct = async () => {
    if (!selectedImage) {
      Alert.alert("Erro", "Selecione uma imagem antes de adicionar o produto.");
      return;
    }
    setIsUploading(true); // Inicia o carregamento da imagem
    try {
      const imageUrl = await uploadImage(selectedImage);
      await addProduct(
        "Produto de Teste",
        "Descrição",
        150.0,
        "Eletrônicos",
        "2024-12-16",
        imageUrl
      );
      Alert.alert("Sucesso", "Produto adicionado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Falha ao adicionar o produto.");
    } finally {
      setIsUploading(false); // Finaliza o carregamento da imagem
    }
  };

  const handleEnviarFoto = async () => {
    if (!selectedImage) {
      Alert.alert("Erro", "Nenhuma imagem selecionada.");
      return;
    }

    setIsUploading(true); // Inicia o carregamento da imagem
    try {
      const imageUrl = await uploadImage(selectedImage);
      Alert.alert("Sucesso", "Imagem enviada para o Firebase Storage!");
      console.log("URL da imagem:", imageUrl);
    } catch (error) {
      Alert.alert("Erro", "Falha ao enviar a imagem.");
    } finally {
      setIsUploading(false); // Finaliza o carregamento da imagem
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primaria flex-col">
      <Text>Bem-vindo!</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" /> // Exibe o indicador enquanto o username está carregando
      ) : (
        <Text>Username do usuário: {userInfo}</Text>
      )}
      <TouchableOpacity
        className="bg-blue-500 p-3 rounded"
        onPress={handleLogout}
      >
        <Text className="text-white text-center">Sair</Text>
      </TouchableOpacity>
      <View className="flex-row flex-wrap justify-between px-4">
        <CardProduto1
          imageSource={require("../../assets/images/teste1.jpg")}
          price="R$ 18,00"
          title="Frappuccino"
          onPress={handleAddProduct}
        />
        <CardProduto2
          imageSource={require("../../assets/images/teste1.jpg")}
          price="R$ 12,00"
          title="Frappuccino"
        />
      </View>
      <CustomButton title="selecionar foto" handlePress={handleSelectImage} />
      {selectedImage && (
        <View className="w-28 h-28 rounded-xl bg-gray-500">
          <Image
            source={{ uri: selectedImage }}
            style={{ width: "100%", height: "100%" }}
          />
        </View>
      )}
      {isUploading ? ( // Exibe o indicador de carregamento quando a imagem está sendo carregada
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <>
          <CustomButton title="enviar foto" handlePress={handleEnviarFoto} />
          <CustomButton
            title="adicionar produto"
            handlePress={handleAddProduct}
          />
        </>
      )}
    </SafeAreaView>
  );
};

export default Home;
