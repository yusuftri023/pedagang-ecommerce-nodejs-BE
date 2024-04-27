import { knexConnection, pool } from "../database/config.js";

export const showVariationDetail = async (variationId) => {
  try {
    const [result] = await knexConnection
      .from("variation")
      .where("id", variationId);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const showVariationInCategory = async (categoryId) => {
  try {
    const result = await knexConnection
      .from("category as c")
      .join("variation as v", "v.category_id", "c.id")
      .join("variation_option as vo", "vo.variation_id", "v.id")
      .where("c.id", categoryId);

    return result;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const insertVariation = async (name, description = "-") => {
  try {
    const [categoryId] = await knexConnection("category").insert([
      { name, description },
    ]);
    return categoryId;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const deleteVariationEntry = async (variationId) => {
  try {
    await knexConnection("variation").delete().where("id", variationId);

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
