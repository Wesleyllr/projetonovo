import React, { useState } from "react";
import { View, Text, TextInput, Button, Alert, Platform } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig";
import { doc, setDoc, getFirestore } from "firebase/firestore"; // Importando para salvar dados no Firestore
import FormField from "@/components/FormField";
import { SafeAreaView } from "react-native-safe-area-context";

const Cadastro = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [username, setUsername] = useState(""); // Novo campo
  const [nomeCompleto, setNomeCompleto] = useState(""); // Novo campo
  const [loading, setLoading] = useState(false);

  const db = getFirestore(); // Instanciando o Firestore

  // Função para lidar com o cadastro
  const handleSignUp = async () => {
    if (!email || !password || !confirmPassword || !username || !nomeCompleto) {
      Alert.alert("Erro", "Por favor, preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Erro", "As senhas não coincidem.");
      return;
    }

    setLoading(true);

    try {
      // Criação do usuário no Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Obtenha o UID do usuário criado
      const { uid } = userCredential.user;

      // Salve o username e o nome completo no Firestore
      await setDoc(doc(db, "users", uid), {
        username: username,
        nomeCompleto: nomeCompleto,
        email: email,
      });

      // Cadastro bem-sucedido
      Alert.alert("Sucesso", "Cadastro realizado com sucesso!");
      navigation.navigate("Login"); // Navega para a tela de Login

      // Resetar campos
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setUsername("");
      setNomeCompleto("");
    } catch (error) {
      const errorMessage = error.message || "Ocorreu um erro ao criar a conta.";
      Alert.alert("Erro", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 justify-center p-5 bg-primaria">
      <Text className="text-2xl font-bold text-center mb-5">Cadastro</Text>

      <FormField
        title="Nome Completo"
        value={nomeCompleto}
        handleChangeText={(e) => setNomeCompleto(e)}
        otherStyles={`mt-7 w-full ${
          Platform.OS === "web" ? "max-w-[400px]" : ""
        }`}
      />

      <FormField
        title="Username"
        value={username}
        handleChangeText={(e) => setUsername(e)}
        otherStyles={`mt-7 w-full ${
          Platform.OS === "web" ? "max-w-[400px]" : ""
        }`}
      />

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
        disabled={loading}
      />
    </SafeAreaView>
  );
};

export default Cadastro;
