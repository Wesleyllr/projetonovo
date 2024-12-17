import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  FlatList,
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

const Home = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const username = auth.currentUser?.displayName || "Usuário Anônimo";
        setUserInfo(username);
        const userProducts = await getUserProducts();
        setProducts(userProducts);
      } catch (error) {
        Alert.alert("Erro", "Falha ao carregar dados.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert("Sucesso", "Você foi deslogado.");
      router.push("/login");
    } catch (error) {
      Alert.alert("Erro", error.message);
    }
  };

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

  const renderProduct = ({ item }: { item: any }) => (
    <CardProduto1
      title={item.title}
      price={item.value}
      imageSource={{ uri: item.imageUrl }}
    />
  );

  return (
    <SafeAreaView className="flex-1 bg-primaria flex-col">
      <Text>Bem-vindo!</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <Text>Username do usuário: {userInfo}</Text>
      )}
      <TouchableOpacity
        className="bg-blue-500 p-3 rounded"
        onPress={handleLogout}
      >
        <Text className="text-white text-center">Sair</Text>
      </TouchableOpacity>
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        renderItem={renderProduct}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: "center", marginTop: 16 }}>
            Nenhum produto encontrado.
          </Text>
        )}
      />
      <CustomButton title="Selecionar Foto" handlePress={handleSelectImage} />
      {selectedImage && (
        <Image
          source={{ uri: selectedImage }}
          style={{ width: 100, height: 100, marginVertical: 10 }}
        />
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
