import React, { useState } from "react";
import { View, TextInput, Modal, Button, Text } from "react-native";
import DropDownPicker from "react-native-dropdown-picker";
import { db, auth } from "@/firebaseConfig"; // Importando o Firestore
import { doc, setDoc, collection } from "firebase/firestore"; // Funções para manipulação de Firestore
import { getUserInfo } from "@/userService"; // Função para obter o userId

const CategoryDropdown = () => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState<string | null>(null);
  const [items, setItems] = useState([
    { label: "Eletrônicos", value: "eletronicos" },
    { label: "Roupas", value: "roupas" },
    { label: "Alimentos", value: "alimentos" },
    { label: "Adicionar nova categoria...", value: "add_new" },
  ]);

  const [newCategory, setNewCategory] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  // Função para adicionar a nova categoria ao Firestore
  const handleAddCategoryToFirestore = async () => {
    if (newCategory.trim()) {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        alert("Usuário não autenticado.");
        return;
      }

      try {
        // Adiciona a nova categoria à subcoleção "categories" do usuário
        const categoryRef = doc(collection(db, "users", userId, "categories"));
        await setDoc(categoryRef, {
          name: newCategory,
          createdAt: new Date(),
        });

        // Atualiza o dropdown com a nova categoria
        setItems((prevItems) => [
          ...prevItems.filter((item) => item.value !== "add_new"),
          {
            label: newCategory,
            value: newCategory.toLowerCase().replace(/\s/g, "_"),
          },
          { label: "Adicionar nova categoria...", value: "add_new" },
        ]);

        setNewCategory("");
        setModalVisible(false);
      } catch (error) {
        alert("Erro ao adicionar a categoria.");
      }
    } else {
      alert("Por favor, insira uma categoria válida.");
    }
  };

  const handleItemSelect = (itemValue: string | null) => {
    if (itemValue === "add_new") {
      setModalVisible(true);
    } else {
      setValue(itemValue);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-gray-100 px-4">
      <DropDownPicker
        open={open}
        value={value}
        items={items}
        setOpen={setOpen}
        setValue={setValue}
        setItems={setItems}
        placeholder="Selecione uma categoria"
        className="bg-white border border-secundaria-600 rounded-lg"
        dropDownContainerStyle={{
          backgroundColor: "#f9fafb",
          borderColor: "#d1d5db",
        }}
        textStyle={{ fontSize: 16, fontWeight: "600", color: "#374151" }}
        onSelectItem={({ value }) => handleItemSelect(value)}
      />

      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-center items-center bg-gray-500 bg-opacity-50">
          <View className="bg-white p-6 rounded-lg w-80">
            <Text className="text-xl font-bold mb-4">
              Adicionar Nova Categoria
            </Text>
            <TextInput
              className="border border-gray-300 rounded-lg p-2 mb-4"
              placeholder="Digite a nova categoria"
              value={newCategory}
              onChangeText={setNewCategory}
            />
            <Button title="Adicionar" onPress={handleAddCategoryToFirestore} />
            <Button
              title="Cancelar"
              onPress={() => setModalVisible(false)}
              color="gray"
            />
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default CategoryDropdown;
