import "dotenv/config";

const { MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY } = process.env;
import midtransClient from "midtrans-client";

export const apiClient = new midtransClient.Snap({
  isProduction: false,
  serverKey: MIDTRANS_SERVER_KEY,
  clientKey: MIDTRANS_CLIENT_KEY,
});
export const midtransCreateTransaction = async (
  orderId,
  order_list,
  customer_details
) => {
  const { email, phone_number: phone } = customer_details;

  const item_details = order_list.items.map(
    ({ quantity, price, name, product_id: id }) => {
      return { quantity, price, name, id, merchant_name: "Ecommerce Pedagang" };
    }
  );
  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: order_list.total_price,
    },
    credit_card: {
      secure: true,
    },
    usage_limit: 1,
    expiry: { duration: 1, unit: "days" },
    item_details: item_details,
    customer_details: {
      email,
      phone,
      notes:
        "Terima kasih atas pembeliannya. Silahkan mengikuti instruksi pembayaran untuk menyelesaikan transaksi.",
    },
  };

  try {
    const transactionResult = await apiClient.createTransactionToken(parameter);
    if (transactionResult.length === 0)
      throw new Error("Gagal membuat token transaksi ke midtrans");

    return transactionResult;
  } catch (error) {
    throw new Error(error.message);
  }
};
