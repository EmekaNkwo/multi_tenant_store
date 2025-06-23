import { Store } from "@/types";
import Notification from "../models/Notification";
import User from "../models/User";

export class NotificationService {
  static async notifyAdminAboutNewStore(store: Store) {
    try {
      // Find all admin users
      const admins = await User.find({ role: "admin" }).select("_id");

      if (admins.length === 0) {
        console.warn("No admin users found to notify");
        return;
      }

      // Create a notification for each admin
      const notifications = admins.map((admin) => ({
        type: "store_request",
        title: "New Store Request",
        message: `A new store "${store.name}" has been submitted for approval.`,
        recipient: admin._id,
        data: {
          storeId: store._id,
          storeName: store.name,
          actionUrl: `/admin/stores/${store._id}`,
        },
      }));

      await Notification.insertMany(notifications);

      console.log(`Created notifications for ${notifications.length} admins`);
    } catch (error) {
      console.error("Error creating notifications:", error);
    }
  }
}
