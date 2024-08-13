import { knexConnection } from "../database/config.js";

export const checkWishlist = async (customerId, productId, productConfigId) => {
  try {
    const result = await knexConnection
      .from("wishlist")
      .where("customer_id", customerId)
      .andWhere("product_id", productId)
      .andWhere("product_config_id", productConfigId);

    return result.length > 0 ? true : false;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const wishlistData = async (customerId, wishlistId) => {
  try {
    const result = await knexConnection
      .from("wishlist")
      .where("id", wishlistId)
      .andWhere("customer_id", customerId);

    return result.length > 0 ? true : false;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const wishlistItems = async (customerId, page = 1, limit = 10) => {
  try {
    const result = await knexConnection
      .from("wishlist as w")
      .select(
        "w.id as wishlist_id",
        "p.id as product_id",
        "p.title",
        "p.description",
        "p.image",
        "ca.name as category_name",
        "pc.stock",
        "pc.variation_option_id",
        "pc.price",
        "pc.id as product_config_id",
        "vo.value as variation_value",
        "v.name as variation_name"
      )
      .join("product as p", "p.id", "w.product_id")
      .join("product_config as pc", "pc.id", "w.product_config_id")
      .join("variation_option as vo", "vo.id", "pc.variation_option_id")
      .join("variation as v", "v.id", "vo.variation_id")
      .join("category as ca", "ca.id", "p.category_id")
      .where("customer_id", customerId)
      .offset((page - 1) * limit)
      .limit(limit);
    return result.length > 0 ? JSON.parse(JSON.stringify(result)) : result;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const insertWishlist = async (
  customer_id,
  product_id,
  product_config_id
) => {
  try {
    const result = await knexConnection("wishlist").insert([
      {
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

export const deleteWishlistEntry = async (id) => {
  try {
    await knexConnection("wishlist").delete().where("id", id);

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
