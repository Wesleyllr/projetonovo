import { View, Text, Alert, ActivityIndicator } from "react-native";
import { Image } from "expo-image";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { uploadImage } from "@/scripts/uploadImage";
import { addProduct } from "@/scripts/productService";
import { pickImagem } from "@/scripts/selecionarImagem";
import FormFieldProduct from "@/components/FormFieldProduct";
import CategoryDropdown from "@/components/CategoryDropdown";

const Criar = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [productName, setProductName] = useState(""); // Novo estado para o nome do produto
  const [productPreco, setProductPreco] = useState(""); // Novo estado para o nome do produto

  const handleSelectImage = async () => {
    const uri = await pickImagem();
    if (uri) setSelectedImage(uri);
  };

  const handleAddProduct = async () => {
    if (!selectedImage) {
      Alert.alert("Erro", "Selecione uma imagem antes de adicionar o produto.");
      return;
    }
    if (!productName) {
      Alert.alert("Erro", "Informe o nome do produto.");
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadImage(selectedImage);
      await addProduct(
        productName, // Nome do produto dinâmico
        "Descrição", // A descrição pode ser um valor fixo ou também um campo controlado
        150.0, // Preço fixo ou variável
        "Eletrônicos", // Categoria fixa ou variável
        "2024-12-16", // Data de criação ou outro valor
        imageUrl // URL da imagem
      );
      Alert.alert("Sucesso", "Produto adicionado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Falha ao adicionar o produto.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-primaria gap-2">
      <Text className="mb-2">Criar</Text>
      {/* Formulário para nome do produto */}
      <FormFieldProduct
        title="Novo Produto"
        value={productName}
        handleChangeText={setProductName} // Atualiza o estado com o nome digitado
        otherStyles="px-4"
        placeholder="Nome do produto"
      />
      <FormFieldProduct
        title="Descrição"
        value={productPreco}
        handleChangeText={setProductPreco} // Atualiza o estado com o nome digitado
        otherStyles="px-4"
        placeholder="Descrição do produto"
      />
      <View className="w-full h-40">
        <CategoryDropdown />
      </View>
      <View className="w-full h-2 mt-2"></View>
      {/* Botão para selecionar a foto */}
      <CustomButton title="Selecionar Foto" handlePress={handleSelectImage} />
      {/* Exibindo a imagem selecionada */}
      {selectedImage && (
        <Image source={{ uri: selectedImage }} cachePolicy="disk" />
      )}
      {/* Exibe o ActivityIndicator enquanto está fazendo o upload */}
      {isUploading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <CustomButton
          title="Adicionar Produto"
          handlePress={handleAddProduct} // Chama a função para adicionar o produto
        />
      )}
    </SafeAreaView>
  );
};

export default Criar;
