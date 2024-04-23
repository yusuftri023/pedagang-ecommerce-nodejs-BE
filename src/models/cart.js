import { knexConnection, pool } from "../database/config.js";

export const cartData = async (customerId) => {
  const result = await knexConnection
    .from("cart")
    .where("customer_id", customerId);
  return result.length > 0 ? JSON.parse(JSON.stringify(result[0])) : result;
};
export const insertCart = async (quantity, customer_id, product_id) => {
  const [result] = await knexConnection("cart").insert([
    {
      quantity,
      customer_id,
      product_id,
    },
  ]);
  return result;
};
export const updateQuantityCart = async (id, quantity) => {
  const result = await knexConnection("customer")
    .update({
      password,
      quantity,
    })
    .where("id", id);

  return result;
};

export const deleteCartEntry = async (id) => {
  const result = await knexConnection("cart").delete().where("id", id);

  return result;
};
