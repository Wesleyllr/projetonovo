import { collection, addDoc, Timestamp } from "firebase/firestore";
import { db, auth } from "@/firebaseConfig";
import { CartService } from "./CartService";
import { ICartItem, IOrder } from "@/types/CartTypes";

export class OrderService {
  private static ORDERS_COLLECTION = "orders";

  static async createOrder(items: ICartItem[], total: number): Promise<string> {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");

    const orderData: Omit<IOrder, "id"> = {
      userId,
      items,
      total,
      status: "completed",
      createdAt: new Date(),
    };

    const orderRef = await addDoc(collection(db, this.ORDERS_COLLECTION), {
      ...orderData,
      createdAt: Timestamp.fromDate(orderData.createdAt),
    });

    return orderRef.id;
  }
}
