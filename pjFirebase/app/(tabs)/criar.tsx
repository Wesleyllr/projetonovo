import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  ScrollView,
  TouchableOpacity,
} from "react-native";
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
import ColorSelector from "@/components/ColorSelector";
import { doc, setDoc } from "firebase/firestore";
import { db, auth } from "@/firebaseConfig";

const Criar = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [productName, setProductName] = useState("");
  const [productDescricao, setProductDescricao] = useState("");
  const [productPreco, setProductPreco] = useState("");
  const [productCusto, setProductCusto] = useState("");
  const [productCodigoBarra, setProductCodigoBarra] = useState("");
  const [selectedColor, setSelectedColor] = useState<string | null>(null);

  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const handleSelectImage = async () => {
    const uri = await pickImagem();
    if (uri) {
      setSelectedImage(uri);
      setSelectedColor(null); // Limpa a cor selecionada quando uma imagem é escolhida
    }
  };

  const handleColorSelect = (color) => {
    setSelectedColor(color);
    setSelectedImage(null); // Limpa a imagem selecionada quando uma cor é escolhida
  };

  const handleAddProduct = async () => {
    if (!selectedImage && !selectedColor) {
      Alert.alert("Erro", "Selecione uma imagem ou uma cor para o produto.");
      return;
    }
    if (!productName) {
      Alert.alert("Erro", "Informe o nome do produto.");
      return;
    }

    setIsUploading(true);
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuário não autenticado");

      let imageUrl = null;

      // Se tiver imagem, faz upload
      if (selectedImage) {
        imageUrl = await uploadImage(selectedImage);
      }

      // Converte o preço para número
      const precoNumerico = parseFloat(productPreco.replace(/\D/g, "")) / 100;
      const custoNumerico = parseFloat(productCusto.replace(/\D/g, "")) / 100;

      // Cria objeto do produto
      const productData = {
        name: productName,
        description: productDescricao,
        price: precoNumerico,
        cost: custoNumerico,
        barcode: productCodigoBarra,
        createdAt: new Date(),
        ...(imageUrl ? { imageUrl } : { backgroundColor: selectedColor }), // Adiciona imageUrl ou backgroundColor
      };

      // Salva no Firestore
      const productRef = doc(collection(db, `users/${user.uid}/products`));
      await setDoc(productRef, productData);

      Alert.alert("Sucesso", "Produto adicionado com sucesso!");

      // Limpa o formulário
      setProductName("");
      setProductDescricao("");
      setProductPreco("");
      setProductCusto("");
      setProductCodigoBarra("");
      setSelectedImage(null);
      setSelectedColor(null);
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
      Alert.alert("Erro", "Falha ao adicionar o produto.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1">
      <Header onGoBack={handleGoBack} />
      <ScrollView className="flex-1 bg-primaria" nestedScrollEnabled={true}>
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
              const rawValue = text.replace(/\D/g, "");
              setProductPreco(rawValue);
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

        <View className="w-full h-40 mt-2 bg-slate-700 justify-center items-center flex-row px-4">
          {selectedImage ? (
            <Image
              source={{ uri: selectedImage }}
              className="w-40 h-40 rounded-xl"
              contentFit="contain"
            />
          ) : (
            <View className="w-40 h-40 rounded-xl bg-secundaria-300 justify-center items-center">
              {selectedColor ? (
                <View
                  className="w-full h-full rounded-xl"
                  style={{ backgroundColor: selectedColor }}
                />
              ) : (
                <TouchableOpacity
                  onPress={handleSelectImage}
                  disabled={!!selectedColor}
                  className="bg-black w-full h-full rounded-xl justify-center"
                >
                  <Text className="text-white text-center">
                    Selecione uma imagem ou cor
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
          <View className="flex-1 h-40 bg-secundaria-300">
            <ColorSelector
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              onColorSelect={handleColorSelect}
              disabled={!!selectedImage}
            />
          </View>
        </View>

        {isUploading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : (
          <CustomButton
            title="Adicionar Produto"
            handlePress={handleAddProduct}
            containerStyles="mb-2"
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default Criar;
