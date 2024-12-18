import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
} from "react-native";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { auth } from "@/firebaseConfig";
import { uploadImage } from "@/scripts/uploadImage";
import { addProduct, getUserProducts } from "@/scripts/productService";
import CustomButton from "@/components/CustomButton";
import CardProduto1 from "@/components/CardProduto1";
import { pickImagem } from "@/scripts/selecionarImagem";
import { Image } from "expo-image";
import { getUserInfo } from "@/userService";
import { images } from "@/constants";

const Home = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false); // Estado para controle do refresh
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Usar getUserInfo para buscar o nome de usuário no Firestore
        const username = await getUserInfo("username");
        setUserInfo(username); // Atualiza o estado com o username
        const userProducts = await getUserProducts();
        setProducts(userProducts);
      } catch (error) {
        Alert.alert("Erro", "Falha ao carregar dados.");
      } finally {
        setLoading(false); // Garante que o estado de carregamento seja atualizado
      }
    };

    fetchUserData();
  }, []);

  const handleSelectImage = async () => {
    const uri = await pickImagem();
    if (uri) setSelectedImage(uri);
  };

  const handleAddProduct = async () => {
    if (!selectedImage) {
      Alert.alert("Erro", "Selecione uma imagem antes de adicionar o produto.");
      return;
    }
    setIsUploading(true);
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
      const userProducts = await getUserProducts();
      setProducts(userProducts);
    } catch (error) {
      Alert.alert("Erro", "Falha ao adicionar o produto.");
    } finally {
      setIsUploading(false);
    }
  };

  // Função para o "refresh"
  const handleRefresh = async () => {
    setIsRefreshing(true); // Inicia o estado de refresh
    try {
      const userProducts = await getUserProducts();
      setProducts(userProducts); // Atualiza os produtos
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar produtos.");
    } finally {
      setIsRefreshing(false); // Finaliza o estado de refresh
    }
  };
  const handleTelaPerfil = async () => {
    router.push("/perfil");
  };
  const renderProduct = ({ item }: { item: any }) => (
    <CardProduto1
      title={item.title}
      price={item.value}
      imageSource={{ uri: item.imageUrl }}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-primaria flex-col">
      <View className="w-full h-16 bg-secundaria-300">
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <View className="flex-1 bg-secundaria-300 flex-row px-2 py-2 gap-2">
            <Text className="flex-1 font-thin text-2xl bg-white">
              Olá, {userInfo}
            </Text>
            <TouchableOpacity onPress={handleTelaPerfil}>
              <Image
                className="w-12 h-12 bg-white border-2 border-secundaria-700 rounded-full"
                source={images.profile}
                contentFit="cover"
              />
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View className="w-full h-[2px] bg-secundaria-700 mb-2" />
      <View className="w-full h-60 justify-center">
        <Text className="font-bold text-2xl text-center mb-2">
          Todos produtos
        </Text>
        <View className="w-full h-[1px] bg-secundaria-600 mb-2" />

        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          contentContainerStyle={{
            paddingHorizontal: 16,
            flexDirection: "row", // Define a direção dos itens
            flexWrap: "wrap", // Permite que os itens quebrem para a próxima linha
            justifyContent: "space-between", // Espaçamento entre os itens
          }}
          ListEmptyComponent={() => (
            <Text style={{ textAlign: "center", marginTop: 16 }}>
              Nenhum produto encontrado.
            </Text>
          )}
          // Adiciona o refreshControl
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
        />
      </View>
      <CustomButton title="Selecionar Foto" handlePress={handleSelectImage} />
      {selectedImage && (
        <Image source={{ uri: selectedImage }} cachePolicy="disk" />
      )}
      {isUploading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <CustomButton
          title="Adicionar Produto"
          handlePress={handleAddProduct}
        />
      )}
    </SafeAreaView>
  );
};

export default Home;
