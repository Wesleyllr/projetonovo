import React, { useState, useEffect } from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { auth } from "@/firebaseConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserInfo } from "@/userService";

const Home = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    // Buscar informações do usuário de forma assíncrona
    const fetchUserInfo = async () => {
      try {
        const username = await getUserInfo("username"); // Aguarda o serviço
        setUserInfo(username); // Atualiza o estado com o username
      } catch (error) {
        Alert.alert("Erro", "Falha ao carregar informações do usuário.");
      } finally {
        setLoading(false); // Garante que o estado de carregamento seja atualizado
      }
    };

    fetchUserInfo();
  }, []);

  return (
    <SafeAreaView className="flex-1 bg-primaria">
      <Text>Bem-vindo!</Text>
      {loading ? (
        <Text>Carregando o username...</Text>
      ) : (
        <Text>Username do usuário: {userInfo}</Text>
      )}

      <TouchableOpacity
        className="bg-blue-500 p-3 rounded"
        onPress={handleLogout}
      >
        <Text className="text-white text-center">Sair</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Home;
