import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "@/firebaseConfig";
import { CartService } from "./CartService";
import { ICartItem, IOrder } from "@/types/CartTypes";

export class OrderService {
  private static ORDERS_COLLECTION = "orders";

  static async createOrder(
    items: ICartItem[],
    total: number,
    status: "completed" | "pending" | "canceled"
  ): Promise<string> {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) throw new Error("User not authenticated");

      const orderData: Omit<IOrder, "id"> = {
        userId,
        items,
        total,
        status,
        createdAt: new Date(),
      };

      const orderRef = await addDoc(collection(db, this.ORDERS_COLLECTION), {
        ...orderData,
        createdAt: Timestamp.fromDate(orderData.createdAt),
      });

      console.log(`Pedido criado com sucesso: ${orderRef.id}`); // Sucesso
      return orderRef.id;
    } catch (error: any) {
      console.error("Erro ao criar pedido:", error); // Logando erro
      throw new Error(`Erro ao criar pedido: ${error.message || error}`);
    }
  }
}
