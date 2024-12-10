import React, { useState } from "react";
import { View, Text, Alert, TouchableOpacity } from "react-native";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { auth } from "@/firebaseConfig"; // Certifique-se de importar a configuração correta
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserInfo } from "@/userService"; // Importando o serviço

const Home = () => {
  const router = useRouter();
  const [userInfo, setUserInfo] = useState<string | null>(null);

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        Alert.alert("Sucesso", "Você foi deslogado.");
        router.push("/login"); // Redireciona para a tela de login
      })
      .catch((error) => {
        Alert.alert("Erro", error.message);
      });
  };

  // Buscar a informação diretamente na renderização (não recomendado)
  const username = getUserInfo("username"); // O que é buscado no serviço

  return (
    <SafeAreaView className="flex-1 bg-primaria">
      <Text>Bem-vindo!</Text>
      {username ? (
        <Text>Username do usuário: {username}</Text>
      ) : (
        <Text>Carregando o username...</Text>
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
