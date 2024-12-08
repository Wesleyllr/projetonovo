import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  TouchableOpacity,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig"; // Certifique-se de configurar corretamente o firebase

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Login bem-sucedido, navegue para a Home
        navigation.navigate("home"); // A navegação aqui será automática
      })
      .catch((error) => {
        Alert.alert("Erro", error.message);
      });
  };

  return (
    <View className="flex-1 justify-center p-5">
      <Text className="text-2xl font-bold text-center mb-5">Login</Text>
      <TextInput
        className="border border-gray-300 mb-4 p-2 rounded"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        className="border border-gray-300 mb-4 p-2 rounded"
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity
        className="bg-blue-500 p-3 rounded"
        onPress={handleLogin}
      >
        <Text className="text-white text-center">Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity className="w-full h-16 bg-primary">
        <Text className="text-white font-pbold bg-black"> OOOI</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
