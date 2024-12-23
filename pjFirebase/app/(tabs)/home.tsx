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
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { getUserInfo } from "@/userService";
import { getUserProducts } from "@/scripts/productService";
import CardProduto1 from "@/components/CardProduto1";
import { images } from "@/constants";

const Home = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const username = await getUserInfo("username");
      setUserInfo(username);
      const userProducts = await getUserProducts();
      setProducts(userProducts);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      await fetchUserData();
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar produtos.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleTelaPerfil = () => {
    router.push("/perfil");
  };

  const handleAddProduct = () => {
    router.push("/criar");
  };

  const renderProduct = ({ item }) => (
    <CardProduto1
      title={item.title}
      price={item.value}
      imageSource={item.imageUrl ? { uri: item.imageUrl } : null}
      backgroundColor={item.backgroundColor}
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

      <View className="flex-1">
        <Text className="font-bold text-2xl text-center mb-2">
          Todos produtos
        </Text>
        <View className="w-full h-[1px] bg-secundaria-600 mb-2" />

        <FlatList
          data={products}
          keyExtractor={(item) => item.id}
          renderItem={renderProduct}
          numColumns={3}
          columnWrapperStyle={{
            justifyContent: "space-around",
            marginBottom: 16,
          }}
          contentContainerStyle={{
            padding: 2,
          }}
          ListEmptyComponent={() => (
            <Text className="text-center mt-4">Nenhum produto encontrado.</Text>
          )}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
            />
          }
        />
      </View>

      <TouchableOpacity
        onPress={handleAddProduct}
        className="absolute bottom-6 right-6 w-14 h-14 bg-blue-500 rounded-full items-center justify-center"
      >
        <Text className="text-white text-3xl">+</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;
