import {
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from "firebase/firestore";
import { db, auth } from "@/firebaseConfig";
import { SalesMetric, OrderMetric } from "../types/DashboardTypes";

export class MetricsService {
  static async getSalesMetrics(): Promise<SalesMetric> {
    const userId = auth.currentUser?.uid;
    if (!userId) throw new Error("User not authenticated");

    const now = new Date();
    const dayStart = new Date(now.setHours(0, 0, 0, 0));
    const weekStart = new Date(now.setDate(now.getDate() - 7));
    const monthStart = new Date(now.setDate(1));

    const ordersRef = collection(db, "orders");
    const q = query(
      ordersRef,
      where("userId", "==", userId),
      where("createdAt", ">=", Timestamp.fromDate(monthStart))
    );

    const querySnapshot = await getDocs(q);
    let daily = 0,
      weekly = 0,
      monthly = 0;

    querySnapshot.forEach((doc) => {
      const order = { id: doc.id, ...doc.data() };
      const orderDate = order.createdAt.toDate();

      if (orderDate >= dayStart) daily += order.total;
      if (orderDate >= weekStart) weekly += order.total;
      monthly += order.total;
    });

    return { daily, weekly, monthly };
  }
}
