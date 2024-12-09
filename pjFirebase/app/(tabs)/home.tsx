import React, { useEffect, useState } from "react";
import { View, Text, Button, Alert, TouchableOpacity } from "react-native";
import { signOut } from "firebase/auth";

import { useRouter } from "expo-router";
import { auth } from "@/firebaseConfig"; // Certifique-se de importar a configuração correta
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);

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

  useEffect(() => {
    // Verifica se o usuário está logado e, se estiver, pega o email
    const user = auth.currentUser;
    if (user) {
      setUserEmail(user.email); // Obtém o email do usuário logado
    } else {
      // Caso o usuário não esteja logado, redireciona para o login
      router.push("/cadastrarUsuario");
    }
  }, [router]);

  return (
    <SafeAreaView className="flex-1 bg-primaria">
      <Text>Bem-vindo!</Text>
      {userEmail ? (
        <Text>Email do usuário: {userEmail}</Text>
      ) : (
        <Text>Carregando o email...</Text>
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
