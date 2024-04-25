import "dotenv/config";

const { MIDTRANS_SERVER_KEY, MIDTRANS_CLIENT_KEY } = process.env;
import midtransClient from "midtrans-client";

const apiClient = new midtransClient.Snap({
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
  console.log(parameter);
  try {
    const transactionResult = await apiClient.createTransaction(parameter);

    return transactionResult;
  } catch (error) {}
};
export const midtransTransactionNotification = async (req, res) => {
  try {
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

    // Sample transactionStatus handling logic

    if (transactionStatus == "capture") {
      if (fraudStatus == "accept") {
        // TODO set transaction status on your database to 'success'
        // and response with 200 OK
        return res.status(200).json({
          status_code: 200,
          transaction_status: transactionStatus,
          fraud_status: fraudStatus,
        });
      }
    } else if (transactionStatus == "settlement") {
      // TODO set transaction status on your database to 'success'
      // and response with 200 OK

      return res.status(200).json({
        status_code: 200,
        transaction_status: transactionStatus,
        fraud_status: fraudStatus,
      });
    } else if (
      transactionStatus == "cancel" ||
      transactionStatus == "deny" ||
      transactionStatus == "expire"
    ) {
      // TODO set transaction status on your database to 'failure'
      // and response with 200 OK
      return res.status(200).json({
        status_code: 200,
        transaction_status: transactionStatus,
        fraud_status: fraudStatus,
      });
    } else if (transactionStatus == "pending") {
      // TODO set transaction status on your database to 'pending' / waiting payment
      // and response with 200 OK
      return res.status(200).json({
        status_code: 200,
        transaction_status: transactionStatus,
        fraud_status: fraudStatus,
      });
    }
  } catch (error) {
    console.log(error.message);
    return;
  }
};

const midtransRequestBody = {
  transaction_details: {
    order_id: "001",
    gross_amount: 190000,
    payment_link_id: "for-payment-123",
  },
  customer_required: true,
  credit_card: {
    secure: true,
    bank: "bca",
    installment: {
      required: false,
      terms: {
        bni: [3, 6, 12],
        mandiri: [3, 6, 12],
        cimb: [3],
        bca: [3, 6, 12],
        offline: [6, 12],
      },
    },
  },
  usage_limit: 1,
  expiry: {
    start_time: "2022-04-01 18:00 +0700",
    duration: 20,
    unit: "days",
  },
  enabled_payments: ["credit_card", "bca_va", "indomaret"],
  item_details: [
    {
      id: "pil-001",
      name: "Pillow",
      price: 95000,
      quantity: 2,
      brand: "Midtrans",
      category: "Furniture",
      merchant_name: "PT. Midtrans",
    },
  ],
  customer_details: {
    first_name: "John",
    last_name: "Doe",
    email: "john.doe@midtrans.com",
    phone: "+62181000000000",
    notes:
      "Thank you for your purchase. Please follow the instructions to pay.",
  },
  custom_field1: "custom field 1 content",
  custom_field2: "custom field 2 content",
  custom_field3: "custom field 3 content",
};
