import React, { useState, useEffect } from "react";
import { View, Text, Alert, TouchableOpacity, Image } from "react-native";
import { signOut } from "firebase/auth";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { getUserInfo } from "@/userService";
import CardProduto1 from "@/components/CardProduto1";
import CardProduto2 from "@/components/CardProduto2";
import { auth, db } from '@/firebaseConfig'; // Importa o auth e db configurados
import { doc, collection, addDoc } from 'firebase/firestore';

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
  async function addProduct(title, description, value, category, date) {
    try {
      // Obtém o ID do usuário autenticado
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error('Usuário não autenticado.');
      }
  
      // Referência à subcoleção "products" do usuário
      const productsRef = collection(db, 'users', userId, 'products');
      
  
      // Adiciona um novo produto
      const newProduct = {
        title,
        description,
        value,
        category,
        date,
      };
  
      const docRef = await addDoc(productsRef, newProduct);
      console.log('Produto adicionado com ID:', docRef.id);
    } catch (error) {
      console.error('Erro ao adicionar o produto:', error.message);
    }
  }

  const handleAddProduct = () => {
    addProduct(
      'Produto de Teste',
      'Descrição do produto de teste',
      150.0,
      'Eletrônicos',
      '2024-12-16'
    );
  };


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
      <View className="flex flex-row flex-wrap justify-between px-4">
        <CardProduto1
          imageSource={require("../../assets/images/teste1.jpg")}
          price="R$ 18,00"
          title="Frappuccino"
          onPress={handleAddProduct}
        />
        <CardProduto2
          imageSource={require("../../assets/images/teste1.jpg")}
          price="R$ 12,00"
          title="Frappuccino"
        />
      </View>
    </SafeAreaView>
  );
};

export default Home;
