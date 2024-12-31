import React, { useState, useEffect, useCallback } from "react";
import { View, Text, TouchableOpacity, FlatList, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db, auth } from "@/firebaseConfig";
import { IOrder } from "@/types/CartTypes";
import { OrderStatus } from "@/types/OrderStatus";

export default function Orders() {
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [showPending, setShowPending] = useState(true);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false); // Estado para refresh

  const fetchOrders = useCallback(async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) return;

      const ordersRef = collection(db, "orders");
      const status = showPending ? "pending" : "completed";
      const q = query(
        ordersRef,
        where("userId", "==", userId),
        where("status", "==", status)
      );

      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as IOrder)
      );

      setOrders(ordersData);
    } catch (error) {
      Alert.alert("Erro", "Falha ao carregar pedidos");
    } finally {
      setLoading(false);
      setRefreshing(false); // Finaliza o estado de refresh
    }
  }, [showPending]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchOrders();
  };

  const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
      await fetchOrders();
      Alert.alert("Sucesso", "Status do pedido atualizado");
    } catch (error) {
      Alert.alert("Erro", "Falha ao atualizar status do pedido");
    }
  };

  const OrderCard = ({ order }: { order: IOrder }) => {
    const formattedDate = new Date(order.createdAt).toLocaleDateString("pt-BR");
    const totalItems = order.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    );

    return (
      <View className="bg-secundaria-50 p-4 rounded-lg mb-3">
        <View className="flex-row justify-between mb-2">
          <Text className="text-secundaria-900 font-bold">
            Pedido #{order.id.slice(-6)}
          </Text>
          <Text className="text-quinta">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(order.total)}
          </Text>
        </View>

        <View className="mb-2">
          <Text className="text-quinta">{formattedDate}</Text>
          <Text className="text-quinta">{totalItems} itens</Text>
        </View>

        <View className="flex-row justify-end gap-2">
          {order.status === "pending" ? (
            <>
              <TouchableOpacity
                onPress={() => updateOrderStatus(order.id, "completed")}
                className="bg-quarta px-4 py-2 rounded"
              >
                <Text className="text-primaria">Completar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => updateOrderStatus(order.id, "canceled")}
                className="bg-sexta px-4 py-2 rounded"
              >
                <Text className="text-primaria">Cancelar</Text>
              </TouchableOpacity>
            </>
          ) : (
            <TouchableOpacity
              onPress={() => updateOrderStatus(order.id, "canceled")}
              className="bg-sexta px-4 py-2 rounded"
            >
              <Text className="text-primaria">Cancelar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-primaria">
      <View className="p-4 bg-secundaria-500">
        <Text className="text-2xl font-bold text-primaria">Pedidos</Text>
      </View>

      <View className="flex-row p-4">
        <TouchableOpacity
          onPress={() => setShowPending(true)}
          className={`flex-1 p-2 rounded-l-lg ${
            showPending ? "bg-secundaria-500" : "bg-secundaria-200"
          }`}
        >
          <Text
            className={`text-center ${
              showPending ? "text-primaria" : "text-secundaria-700"
            }`}
          >
            Pendentes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setShowPending(false)}
          className={`flex-1 p-2 rounded-r-lg ${
            !showPending ? "bg-secundaria-500" : "bg-secundaria-200"
          }`}
        >
          <Text
            className={`text-center ${
              !showPending ? "text-primaria" : "text-secundaria-700"
            }`}
          >
            Completados
          </Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={orders}
        renderItem={({ item }) => <OrderCard order={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        refreshing={refreshing} // Adiciona estado de refresh
        onRefresh={onRefresh} // Função chamada ao arrastar para baixo
        ListEmptyComponent={
          <Text className="text-center text-quinta">
            Nenhum pedido {showPending ? "pendente" : "completado"}
          </Text>
        }
      />
    </SafeAreaView>
  );
}
