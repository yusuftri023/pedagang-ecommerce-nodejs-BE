import { knexConnection } from "../database/config.js";

const order_statuses = [
  "Menunggu Pembayaran",
  "Menunggu Konfirmasi",
  "Pesanan Diproses",
  "Pesanan Dikirim",
  "Pesanan Tiba",
  "Pesanan Dikomplain",
  "Pesanan Selesai",
  "Pesanan Dibatalkan",
];

export const orderItemsList = async (orderId, customerId) => {
  try {
    const result = await knexConnection
      .from("order_detail as od")
      .join("order_item as oi", "oi.order_id", "od.id")
      .where("order_id", orderId)
      .andWhere("customer_id", customerId);
    return result.length > 0 ? JSON.parse(JSON.stringify(result[0])) : result;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const allCustomerOrders = async (customerId, page = 1, limit = 10) => {
  try {
    const result = await knexConnection
      .from("order_detail")
      .where("customer_id", customerId)
      .offset((page - 1) * limit)
      .limit(limit);
    return result.length > 0 ? JSON.parse(JSON.stringify(result)) : result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const insertOrder = async (
  orderList,
  customerId,
  addressId,
  payment_method_id
) => {
  const trx = await knexConnection.transaction();
  const { items, total_price } = orderList;

  try {
    const [shipmentId] = await trx("shipment").insert({
      address_id: addressId,
      customer_id: customerId,
    });

    const [paymentId] = await trx("payment").insert({
      amount: total_price,
      customer_id: customerId,
      payment_method_id,
    });

    const [orderId] = await trx("order_detail").insert({
      customer_id: customerId,
      shipment_id: shipmentId,
      payment_id: paymentId,
      total_price: total_price,
      status: "Menunggu pembuatan transaksi",
    });

    const orderItems = items.map(({ product_id, quantity, price }) => {
      return { product_id, quantity, price, order_id: orderId };
    });
    await trx("order_item").insert(orderItems);

    await trx.commit();
    return orderId;
  } catch (error) {
    await trx.rollback();
    throw new Error(error.message);
  }
};
export const updateStatusOrder = async (orderId, transactionId, statusName) => {
  try {
    const result = await knexConnection("order_detail")
      .update({
        status: statusName,
        transaction_id: transactionId,
      })
      .where("id", orderId);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
