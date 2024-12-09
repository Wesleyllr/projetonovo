import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, Platform } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig"; // Certifique-se de configurar corretamente o Firebase
import FormField from "@/components/FormField";
import { SafeAreaView } from "react-native-safe-area-context";

const Cadastro = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  // Função para lidar com o cadastro
  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    setLoading(true); // Ativa o carregamento durante o processo de cadastro

    try {
      // Chamada ao Firebase para criar um novo usuário
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Cadastro bem-sucedido, navegue para a tela de login
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      navigation.navigate("Login"); // Navegar para a tela de Login após o cadastro

      // Resetar campos
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (error) {
      const errorMessage = error.message || "Ocorreu um erro ao criar a conta.";
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false); // Desativa o carregamento
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center p-5 bg-primaria">
      <Text className="text-2xl font-bold text-center mb-5">Cadastro</Text>


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
      <FormField
        title="Confirmar senha"
        value={confirmPassword}
        handleChangeText={(e) => setConfirmPassword(e)}
        otherStyles={`mt-7 w-full ${
          Platform.OS === "web" ? "max-w-[400px]" : ""
        }`}
      />

      <Button
        title={loading ? "Cadastrando..." : "Cadastrar"}
        onPress={handleSignUp}
        disabled={loading} // Desabilita o botão enquanto está carregando
      />
    </SafeAreaView>
  );
};

export default Cadastro;
