import {
  deletePromotionEntry,
  insertPromotion,
  showPromotion,
  showPromotionDetail,
} from "../models/promotion.js";

export const allPromotion = async (req, res) => {
  const { page, limit } = req.query;

  try {
    const result = await showPromotion(page, limit);
    if (result) {
      return res.status(200).json({
        success: true,
        message: "Data Fetch success",
        data: result,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "List of promotion is empty",
        data: null,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};
export const usePromotion = async (req, res) => {
  const { promotionCode } = req.params;

  try {
    const result = await showPromotionDetail(promotionCode);
    if (result) {
      return res.status(200).json({
        success: true,
        message: "Data Fetch success",
        data: result,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "This promotion does not exist",
        data: null,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

export const addPromotion = async (req, res) => {
  const {
    categories,
    discount_rate,
    name: promotionName,
    start_date: startDate,
    end_date: endDate,
    description,
  } = req.body;
  try {
    if (
      categories.length > 0 &&
      discount_rate &&
      promotionName &&
      startDate &&
      endDate
    ) {
      await insertPromotion(
        categories,
        discount_rate,
        promotionName,
        startDate,
        endDate,
        description
      );
      return res.status(201).json({
        success: true,
        message: "Promotion successfully created",
        data: null,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Request is not complete ",
        data: null,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};

export const deletePromotion = async (req, res) => {
  const { promotionCode } = req.params;
  try {
    const promotionEntry = await showPromotionDetail(promotionCode);

    const promotionItemsExist =
      promotionEntry.length > 0
        ? promotionEntry.some(
            ({ id: dbpromotionCode }) =>
              Number(promotionCode) === dbpromotionCode
          )
        : false;

    if (promotionItemsExist) {
      await deletePromotionEntry(promotionCode);
      return res.status(200).json({
        success: true,
        message: "Promotion entry deleted",
        data: null,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Promotion entry does not exist",
        data: null,
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};
