import {
  deleteVariationEntry,
  insertVariation,
  showVariationDetail,
  showVariationInCategory,
} from "../models/variation.js";

export const allVariationInCategory = async (req, res) => {
  const { categoryId } = req.params;
  try {
    const result = await showVariationInCategory(categoryId);
    if (result) {
      return res.status(200).json({
        success: true,
        message: "Data Fetch success",
        data: result,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "No variation in this category",
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

export const addVariation = async (req, res) => {
  try {
    const { variationName, description } = req.body;
    if (variationName) {
      await insertVariation(variationName, description);
      return res.status(201).json({
        success: true,
        message: "Variation successfully created",
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

export const deleteVariation = async (req, res) => {
  const { variationId } = req.params;
  try {
    const data = showVariationDetail(variationId);
    if (data) {
      await deleteVariationEntry(variationId);
      return res.status(200).json({
        success: true,
        message: "Variation entry deleted",
        data: null,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Variation entry does not exist",
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
