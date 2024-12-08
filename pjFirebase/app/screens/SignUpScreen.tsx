import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, Alert } from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig"; // Certifique-se de configurar corretamente o Firebase

const SignUpScreen = ({ navigation }) => {
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
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      <Button
        title={loading ? "Cadastrando..." : "Cadastrar"}
        onPress={handleSignUp}
        disabled={loading} // Desabilita o botão enquanto está carregando
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 15,
    padding: 10,
    borderRadius: 5,
  },
});

export default SignUpScreen;
