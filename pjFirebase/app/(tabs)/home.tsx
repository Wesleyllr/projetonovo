import React, { useState, useEffect, useMemo } from "react";
import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  RefreshControl,
  Animated,
  Easing,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getUserInfo } from "@/userService";
import { getUserProducts } from "@/scripts/productService";
import CardProduto1 from "@/components/CardProduto1";
import { images } from "@/constants";

const CACHE_KEY = "user_products_cache";
const CACHE_DURATION = 1000 * 60 * 5; // 5 minutos

const Home = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [products, setProducts] = useState<any[]>([]);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [sortField, setSortField] = useState<"price" | "title">("price");

  const [filterText, setFilterText] = useState("");
  const [searchText, setSearchText] = useState("");

  // Animação do botão flutuante
  const scaleAnim = new Animated.Value(1);
  const rotateAnim = new Animated.Value(0);

  const animateButton = () => {
    Animated.parallel([
      Animated.sequence([
        Animated.spring(scaleAnim, {
          toValue: 1.2,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ]).start(() => {
      rotateAnim.setValue(0);
    });
  };

  const loadCachedProducts = async () => {
    try {
      const cached = await AsyncStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_DURATION) {
          setProducts(data);
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Erro ao carregar cache:", error);
      return false;
    }
  };

  const cacheProducts = async (data: any[]) => {
    try {
      await AsyncStorage.setItem(
        CACHE_KEY,
        JSON.stringify({
          data,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("Erro ao salvar cache:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const username = await getUserInfo("username");
      setUserInfo(username);

      const cachedLoaded = await loadCachedProducts();
      if (!cachedLoaded) {
        const userProducts = await getUserProducts();
        setProducts(userProducts);
        cacheProducts(userProducts);
      }
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar dados.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      const userProducts = await getUserProducts();
      setProducts(userProducts);
      cacheProducts(userProducts);
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar produtos.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const renderProduct = ({ item }) => (
    <CardProduto1
      title={item.title}
      price={item.value}
      imageSource={item.imageUrl ? { uri: item.imageUrl } : null}
      backgroundColor={item.backgroundColor}
    />
  );

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "135deg"],
  });

  const filteredAndSortedProducts = useMemo(() => {
    return products
      .filter((product) =>
        product.title.toLowerCase().includes(searchText.toLowerCase())
      )
      .sort((a, b) => {
        if (sortField === "price") {
          const comparison = a.value - b.value;
          return sortOrder === "asc" ? comparison : -comparison;
        } else {
          const comparison = a.title.localeCompare(b.title);
          return sortOrder === "asc" ? comparison : -comparison;
        }
      });
  }, [products, searchText, sortOrder, sortField]);

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
            <TouchableOpacity onPress={() => router.push("/perfil")}>
              <Image
                className="w-12 h-12 bg-white border-2 border-secundaria-700 rounded-full"
                source={images.profile}
                contentFit="cover"
                transition={500}
                cachePolicy="memory-disk"
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
          data={filteredAndSortedProducts}
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
          ListHeaderComponent={
            <View className="px-4 mb-2 h-14 flex-row gap-2 justify-end items-end">
              <TextInput
                className="flex-1 h-14 px-3 bg-white rounded border border-gray-300"
                placeholder="Pesquisar produtos..."
                value={searchText}
                onChangeText={setSearchText}
              />
              <View className="flex-col justify-center h-14 gap-[1px]">
                <TouchableOpacity
                  onPress={() => {
                    setSortField("price");
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                  }}
                  className="bg-secundaria-400 h-8 px-3 rounded"
                >
                  <Text className="text-secundaria-900 text-base">
                    Preço:{" "}
                    {sortField === "price"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : "-"}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setSortField("title");
                    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
                  }}
                  className="bg-secundaria-400 h-8 px-3 rounded"
                >
                  <Text className="text-secundaria-900 text-base">
                    Nome:{" "}
                    {sortField === "title"
                      ? sortOrder === "asc"
                        ? "↑"
                        : "↓"
                      : "-"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          }
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

      <Animated.View
        style={{
          position: "absolute",
          bottom: 24,
          right: 24,
          transform: [{ scale: scaleAnim }, { rotate }],
        }}
      >
        <TouchableOpacity
          onPress={() => {
            animateButton();
            router.push("/criar");
          }}
          className="w-14 h-14 bg-blue-500 rounded-full items-center justify-center"
        >
          <Text className="text-white text-3xl">+</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};

export default Home;
