import React, { useState } from "react";
import { View, Text, TextInput, Alert, TouchableOpacity } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig"; // Certifique-se de configurar corretamente o firebase
import { useRouter } from "expo-router"; // Importando useRouter
import FormField from "@/components/FormField";
import { Platform } from "react-native";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Login bem-sucedido, navegue para a Home
        router.push("/screens/HomeScreen"); // Usando push para empurrar a tela na pilha
      })
      .catch((error) => {
        Alert.alert("Erro", error.message);
      });
  };

  const handleAnotherAction = () => {
    // Navegar para outra tela usando push
    router.push("/screens/SignUpScreen"); // Substitua "OutraTela" pela tela desejada
  };

  return (
    <View className="flex-1 justify-center p-5 bg-white">
      <Text className="text-2xl font-bold text-center mb-5">Login</Text>

      <FormField
        title="Email"
        value={email}
        handleChangeText={(e) => setEmail(e)}
        keyboardType="email-address"
        otherStyles={`mt-7 w-full ${
          Platform.OS === "web" ? "max-w-[400px]" : ""
        }`}
      />
      <FormField
        title="Senha"
        value={password}
        handleChangeText={(e) => setPassword(e)}
        otherStyles={`mt-7 w-full ${
          Platform.OS === "web" ? "max-w-[400px]" : ""
        }`}
      />
      <TouchableOpacity
        className="bg-blue-500 p-3 rounded"
        onPress={handleLogin}
      >
        <Text className="text-white text-center">Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        className="w-full h-16"
        onPress={() => router.push("/screens/SignUpScreen")} // Chama a função de navegação para outra tela
      >
        <Text className="text-white font-pbold bg-secondary">OOOI</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
