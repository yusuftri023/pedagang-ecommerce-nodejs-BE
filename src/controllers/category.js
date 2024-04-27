import { insertCategory, showCategory } from "../models/category.js";

export const allCategory = async (req, res) => {
  const { page, limit } = req.query;

  try {
    const result = await showCategory(page, limit);
    if (result) {
      return res.status(200).json({
        success: true,
        message: "Data Fetch success",
        data: result,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Customer address does not exist",
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

export const addCategory = async (req, res) => {
  const { categoryName, description } = req.body;
  try {
    if (categoryName) {
      await insertCategory(categoryName, description);
      return res.status(201).json({
        success: true,
        message: "Address successfully created",
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
