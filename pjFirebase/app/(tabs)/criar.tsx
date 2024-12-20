import { View, Text, Alert, ActivityIndicator, ScrollView } from "react-native";
import { Image } from "expo-image";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import CustomButton from "@/components/CustomButton";
import { uploadImage } from "@/scripts/uploadImage";
import { addProduct } from "@/scripts/productService";
import { pickImagem } from "@/scripts/selecionarImagem";
import FormFieldProduct from "@/components/FormFieldProduct";
import CategoryDropdown from "@/components/CategoryDropdown";
import { addUserCategory, getUserCategories } from "@/userService";
import Header from "@/components/CustomHeader";
import { useRouter } from "expo-router";

const Criar = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescricao, setProductDescricao] = useState("");
  const [productPreco, setProductPreco] = useState("");
  const [productCusto, setProductCusto] = useState("");
  const [productCodigoBarra, setProductCodigoBarra] = useState("");
  const router = useRouter();

  const handleGoBack = () => {
    router.back(); // Navega para a tela anterior
  };

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

      // Converte o preço para número (removendo formatação)
      const precoNumerico = parseFloat(productPreco.replace(/\D/g, "")) / 100;

      await addProduct(
        productName,
        productDescricao,
        precoNumerico, // Valor bruto (numérico)
        "Ajustar para enviar a Categoria Selecionada",
        "Ajustar para enviar data atual",
        imageUrl
      );
      Alert.alert("Sucesso", "Produto adicionado com sucesso!");
    } catch (error) {
      Alert.alert("Erro", "Falha ao adicionar o produto.");
    } finally {
      setIsUploading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const categories = await getUserCategories();
      console.log("Categorias do usuário:", categories);
    } catch (error) {
      console.error(error.message);
    }
  };

  const exibirLogValor = async () => {
    const precoNumerico2 = parseFloat(productPreco.replace(/\D/g, "")) / 100;
    const precoNumerico3 = parseFloat(productCusto.replace(/\D/g, "")) / 100;

    console.log("valor armazenado Preço:", precoNumerico2);
    console.log("valor armazenado Custo:", precoNumerico3);
  };

  const registrarNovaCategoria = async () => {
    try {
      const newCategory = await addUserCategory("Doces");
      console.log("Categoria adicionada com sucesso:", newCategory);
    } catch (error) {
      console.error("Erro ao adicionar a categoria:", error.message);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <Header onGoBack={handleGoBack} onSave={exibirLogValor} />
      <ScrollView className=" flex-1 bg-primaria" nestedScrollEnabled={true}>
        <Text className="mb-2">Criar</Text>
        <FormFieldProduct
          title="Novo Produto"
          value={productName}
          handleChangeText={setProductName}
          otherStyles="px-4"
          placeholder="Nome do produto"
        />
        <FormFieldProduct
          title="Descrição"
          value={productDescricao}
          handleChangeText={setProductDescricao}
          otherStyles="px-4"
          placeholder="Descrição do produto"
          multiline={true}
        />
        <View className="w-full flex-row my-4">
          <FormFieldProduct
            title="Preço de Venda"
            value={productPreco}
            handleChangeText={(text) => {
              const rawValue = text.replace(/\D/g, ""); // Apenas números
              setProductPreco(rawValue); // Valor bruto no estado
            }}
            placeholder="Preço de Venda"
            otherStyles="px-4 flex-1"
            monetario={true}
          />
          <FormFieldProduct
            title="Custo"
            value={productCusto}
            handleChangeText={(text) => {
              const rawValue = text.replace(/\D/g, "");
              setProductCusto(rawValue);
            }}
            placeholder="Custo (opcional)"
            otherStyles="px-4 flex-1"
            monetario={true}
          />
        </View>
        <View className="flex-1 h-16 my-2">
          <CategoryDropdown />
        </View>
        <FormFieldProduct
          title="Código de barras"
          value={productCodigoBarra}
          handleChangeText={setProductCodigoBarra}
          placeholder="Código de barras"
          otherStyles="px-4"
        />
        {/* Exibindo a imagem selecionada */}
        <View className="w-full h-40 bg-slate-700 justify-center items-center flex-row px-4">
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              className="w-40 h-40 rounded-xl"
              contentFit="contain"
            />
          ) : (
            <Text className="text-white">Selecione uma imagem</Text>
          )}
          <View className="flex-1 h-40 bg-secundaria-300 gap-2">
            <View></View>
          </View>
        </View>
        <CustomButton
          title="Exibir valor armazenado"
          handlePress={exibirLogValor}
          containerStyles="my-2"
        />
        <CustomButton
          title="Selecionar Foto"
          handlePress={handleSelectImage}
          containerStyles="mb-2"
        />
        {isUploading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <CustomButton
            title="Adicionar Produto"
            handlePress={handleAddProduct}
            containerStyles="mb-2"
          />
        )}
        <CustomButton
          title="Pegar categorias"
          handlePress={fetchCategories}
          containerStyles="mb-2"
        />
        <CustomButton
          title="registrar categoria"
          handlePress={registrarNovaCategoria}
          containerStyles="mb-2"
        />
      </ScrollView>
    </SafeAreaView>
  );
};

export default Criar;
