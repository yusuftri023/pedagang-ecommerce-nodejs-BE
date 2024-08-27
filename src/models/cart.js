import { knexConnection } from "../database/config.js";

export const cartData = async (customerId) => {
  try {
    const result = await knexConnection
      .from("cart as c")
      .select(
        "c.id as cart_id",
        "c.quantity",
        "c.note",
        "p.id as product_id",
        "p.title",
        "p.description",
        "p.image",
        "ca.name as category_name",
        "pc.stock",
        "pc.variation_option_id",
        "pc.price",
        "pc.discount",
        "pc.id as product_config_id",
        "vo.value as variation_value",
        "v.name as variation_name"
      )
      .join("product as p", "p.id", "c.product_id")
      .join("product_config as pc", "pc.id", "c.product_config_id")
      .join("variation_option as vo", "vo.id", "pc.variation_option_id")
      .join("variation as v", "v.id", "vo.variation_id")
      .join("category as ca", "ca.id", "p.category_id")
      .where("c.customer_id", customerId);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const insertCart = async (
  quantity,
  customer_id,
  product_id,
  product_config_id
) => {
  try {
    const result = await knexConnection("cart").insert([
      {
        quantity,
        customer_id,
        product_id,
        product_config_id,
      },
    ]);
    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const upsertCartNote = async (cartId, customerId, note) => {
  try {
    const result = await knexConnection("cart")
      .update({ note })
      .where("id", cartId);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const updateQuantityCart = async (cartId, customerId, quantity) => {
  try {
    const result = await knexConnection("cart")
      .update({
        quantity: quantity,
      })
      .where("id", cartId)
      .andWhere("customer_id", customerId);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const deleteCartEntry = async (cartId, customerId) => {
  try {
    await knexConnection("cart")
      .delete()
      .where("id", cartId)
      .andWhere("customer_id", customerId);

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
