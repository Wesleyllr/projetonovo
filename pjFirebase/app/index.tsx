import "../setupNativewind"; // Adicione esta linha no topo do arquivo
import React, { useEffect } from "react";
import { View, Text, ActivityIndicator, Image } from "react-native";
import { useRouter } from "expo-router";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/firebaseConfig"; // Certifique-se de que o Firebase está configurado corretamente
import { Platform } from "react-native";
import { images } from "@/constants";

const IndexScreen = () => {
  const router = useRouter();

  useEffect(() => {
    // Verifica o estado de autenticação assim que o componente for montado
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuário autenticado, redireciona para a HomeScreen
        router.replace("/(tabs)/home");
      } else {
        // Usuário não autenticado, redireciona para a LoginScreen
        router.replace("/(auth)/login");
      }
    });

    // Limpa o ouvinte quando o componente for desmontado
    return () => unsubscribe();
  }, [router]);

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Image source={images.logo} resizeMode="contain" className="w-60 h-20" />
      <Text className="text-2xl font-bold text-center">Seja bem vindo!</Text>
      <Text className="text-2xl font-bold text-center">
        Estamos verificando o Login...
      </Text>
      <ActivityIndicator size="large" color="#0000ff" />
    </View>
  );
};

export default IndexScreen;
