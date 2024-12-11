import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Alert,
  TouchableOpacity,
  Image,
} from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebaseConfig"; // Certifique-se de configurar corretamente o firebase
import { useRouter } from "expo-router"; // Importando useRouter
import FormField from "@/components/FormField";
import { Platform } from "react-native";
import CustomAlert from "@/components/CustomAlert";
import CustomButton from "@/components/CustomButton";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const router = useRouter();

  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Login bem-sucedido, navegue para a Home
        router.push("/home"); // Usando push para empurrar a tela na pilha
      })
      .catch((error) => {
        Alert.alert("Erro", error.message);
      });
  };

  const handleAnotherAction = () => {
    // Navegar para outra tela usando push
    router.push("/cadastrarUsuario"); // Substitua "OutraTela" pela tela desejada
  };

  return (
    <View className="flex-1 justify-center items-center p-5 bg-white">
      <Text className="text-4xl font-bold text-center mb-5">Bem vindo(a)!</Text>
      <Image />
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
      <View
        className={`w-full items-end ${
          Platform.OS === "web" ? "max-w-[400px]" : ""
        }`}
      >
        <TouchableOpacity
          className={`w-full items-end ${
            Platform.OS === "web" ? "max-w-[400px]" : ""
          }`}
          onPress={handleAnotherAction}
        >
          <Text className="text-secundaria-800 font-pregular text-sm mr-4">
            Esqueceu a senha?
          </Text>
        </TouchableOpacity>
      </View>
      <View
        className={` w-full justify-start items-end ${
          Platform.OS === "web" ? "max-w-[300px]" : ""
        }`}
      >
        <CustomButton
          title="Login"
          handlePress={handleLogin}
          containerStyles={`mt-2 w-full ${
            Platform.OS === "web" ? "max-w-[300px]" : ""
          }`}
        />
        <TouchableOpacity onPress={handleAnotherAction}>
          <Text className="text-secundaria-800 font-psemibold text-base">
            Cadastrar
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Login;
