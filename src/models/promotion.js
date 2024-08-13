import { knexConnection } from "../database/config.js";

export const showPromotionDetail = async (promotionCode) => {
  try {
    const result = await knexConnection
      .from("promotion as p")
      .select("p.*", "pc.*", "c.name as category_name")
      .join("promotion_category as pc", "pc.promotion_code", "p.code")
      .join("category as c", "c.id", "pc.category_id")
      .where("code", promotionCode);
    return result.length > 0 ? result : false;
  } catch (error) {
    throw new Error(error.message);
  }
};
export const showPromotion = async (page = 1, limit = 10) => {
  try {
    const result = await knexConnection
      .from("promotion")
      .offset((page - 1) * limit)
      .limit(limit);

    return result.length > 0 ? JSON.parse(JSON.stringify(result)) : false;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const insertPromotion = async (
  categories,
  discount_rate,
  name,
  startDate,
  endDate,
  description = "-"
) => {
  try {
    const [start_date, end_date] = [new Date(startDate), new Date(endDate)];
    const trx = await knexConnection.transaction();
    const [promotionId] = await trx("promotion").insert({
      name,
      description,
      discount_rate,
      start_date,
      end_date,
    });

    const query = categories.map((category) => {
      return { category_id: category, promotion_id: promotionId };
    });
    await trx("promotion_category").insert(query);
    await trx.commit();
    return true;
  } catch (error) {
    await trx.rollback();
    throw new Error(error.message);
  }
};
export const deletePromotionEntry = async (id) => {
  try {
    await knexConnection("promotion").delete().where("id", id);

    return true;
  } catch (error) {
    throw new Error(error.message);
  }
};
