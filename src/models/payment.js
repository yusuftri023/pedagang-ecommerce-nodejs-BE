import { knexConnection, pool } from "../database/config.js";

export const showPayment = async (paymentId, customerId) => {
  const result = await knexConnection
    .from("payment")
    .where("id", paymentId)
    .andWhere("customer_id", customerId);
  return result.length > 0 ? JSON.parse(JSON.stringify(result[0])) : result;
};

export const insertPayment = async (amount, customer_id, payment_method_id) => {
  const [result] = await knexConnection("payment").insert([
    { amount, customer_id, payment_method_id },
  ]);
  return result;
};

export const insertPaymentMethod = async (name) => {
  const [result] = await knexConnection("payment_method").insert([
    {
      name,
    },
  ]);
  return result;
};
