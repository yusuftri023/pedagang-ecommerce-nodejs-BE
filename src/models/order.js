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
const trx = await knexConnection.transaction();
export const orderItemsList = async (orderId) => {
  const result = await knexConnection
    .from("order_item")
    .where("order_id", orderId);
  return result.length > 0 ? JSON.parse(JSON.stringify(result[0])) : result;
};
export const orderData = async (id) => {
  const result = await knexConnection.from("order_detail").where("id", id);
  return result.length > 0 ? JSON.parse(JSON.stringify(result[0])) : result;
};

export const insertOrder = async (
  orderLists,
  customerId,
  addressId,
  payment_method_id
) => {
  const { items, total_price } = orderLists;

  trx("shipment")
    .insert({ address_id: addressId, customer_id: customerId }, "id")
    .then(async (shipmentId) => {
      const [paymentId] = await trx("payment").insert({
        amount: total_price,
        customer_id: customerId,
        payment_method_id,
      });
      return { shipmentId, paymentId };
    })
    .then(({ shipmentId, paymentId }) => {
      return trx("order_detail").insert({
        customer_id: customerId,
        shipment_id: shipmentId,
        payment_id: paymentId,
        total_price: total_price,
        status: "Menunggu Pembayaran",
      });
    })
    .then((orderId) => {
      const orderItems = items.map((item) => {
        return { product_id, quantity, price, order_id: orderId[0] };
      });
      trx("order_item").insert(orderItems);
    })
    .then(trx.commit)
    .catch(trx.rollback);
  return true;
};
export const updateOrder = async (id, status) => {
  const result = await knexConnection("order_detail")
    .update({
      status: status,
    })
    .where("id", id);

  return result;
};
