import { knexConnection, pool } from "../database/config.js";

export const cartData = async (customerId, page = 1, limit = 10) => {
  const result = await knexConnection
    .from("cart")
    .where("customer_id", customerId)
    .offset((page - 1) * limit)
    .limit(limit);
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
export const updateQuantityCart = async (cartId, customerId, quantity) => {
  const result = await knexConnection("cart")
    .update({
      quantity,
    })
    .where("id", cartId)
    .andWhere("customer_id", customerId);

  return result;
};

export const deleteCartEntry = async (cartId, customerId) => {
  try {
    const result = await knexConnection("cart")
      .delete()
      .where("id", cartId)
      .andWhere("customer_id", customerId);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
