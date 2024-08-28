import { orderItemsList, updateStatusOrder } from "../models/order.js";
import {
  decreaseProductStock,
  increaseProductStock,
} from "../models/product.js";
import { apiClient } from "../utils/midtrans.js";

export const midtransTransactionNotification = async (req, res) => {
  try {
    const { transaction_id } = req.body;
    const statusResponse = await apiClient.transaction.notification(
      JSON.stringify(req.body)
    );
    const {
      order_id: orderId,
      transaction_status: transactionStatus,
      fraud_status: fraudStatus,
    } = statusResponse;
    console.log(
      `Transaction notification received. Order ID: ${orderId}. Transaction status: ${transactionStatus}. Fraud status: ${fraudStatus}`
    );

    if (transactionStatus == "capture") {
      if (fraudStatus == "accept") {
        await updateStatusOrder(orderId, transaction_id, "Pesanan Diproses");
      }
    } else if (transactionStatus == "settlement") {
      await updateStatusOrder(orderId, transaction_id, "Pesanan Selesai");
    } else if (
      transactionStatus == "cancel" ||
      transactionStatus == "deny" ||
      transactionStatus == "expire"
    ) {
      await updateStatusOrder(orderId, transaction_id, "Pesanan Dibatalkan");
      const canceledProduct = await orderItemsList(orderId);
      canceledProduct.forEach(async ({ product_config_id, quantity }) => {
        await increaseProductStock(product_config_id, quantity);
      });
    } else if (transactionStatus == "pending") {
      const boughtProduct = await orderItemsList(orderId);
      boughtProduct.forEach(async ({ product_config_id, quantity }) => {
        await decreaseProductStock(product_config_id, quantity);
      });
      await updateStatusOrder(orderId, transaction_id, "Menunggu Pembayaran");
    }

    return res.status(200).json({
      status_code: 200,
      transaction_status: transactionStatus,
      fraud_status: fraudStatus,
    });
  } catch (error) {
    return res.status(500).json({
      status_code: 500,
      message: error.message,
    });
  }
};
