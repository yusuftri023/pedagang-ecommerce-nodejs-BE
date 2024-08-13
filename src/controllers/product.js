import {
  deleteProductEntry,
  insertProduct,
  showAllProduct,
  showDetailProduct,
  showDetailProductVariation,
  showProductRating,
  showProductReview,
  showSearchProduct,
} from "../models/product.js";

export const allProduct = async (req, res) => {
  try {
    const result = await showAllProduct();
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Data Fetch success",
        data: result,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Product is empty",
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
export const searchProduct = async (req, res) => {
  try {
    const { keyword } = req.query;

    const result = await showSearchProduct(keyword);
    return res.status(200).json({
      success: true,
      message: "Data Fetch success",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
      data: null,
    });
  }
};
export const productReview = async (req, res) => {
  const { productId } = req.params;
  try {
    const result = await showProductReview(productId);
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Data Fetch success",
        data: result,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Product review does not exist",
        data: [],
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
export const productRating = async (req, res) => {
  const { productId } = req.params;
  try {
    const result = await showProductRating(productId);
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Data Fetch success",
        data: result,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Product rating does not exist",
        data: [],
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
export const detailProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const result = await showDetailProduct(productId);
    console.log(result);
    if (result.length > 0) {
      return res.status(200).json({
        success: true,
        message: "Data Fetch success",
        data: result,
      });
    } else {
      return res.status(200).json({
        success: false,
        message: "Product details does not exist",
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
export const detailProductVariation = async (req, res) => {
  const { productId, variationId } = req.params;

  try {
    const result = await showDetailProductVariation(productId, variationId);
    if (result) {
      return res.status(200).json({
        success: true,
        message: "Data Fetch success",
        data: result,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Product details does not exist",
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

export const addProduct = async (req, res) => {
  const {
    title,
    price,
    stock,
    category_id: categoryId,
    configs,
    image,
    description,
  } = req.body;
  try {
    if (title && price && stock && categoryId && configs) {
      await insertProduct(
        title,
        price,
        stock,
        categoryId,
        configs,
        image,
        description
      );
      return res.status(201).json({
        success: true,
        message: "Product successfully created",
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

export const deleteProduct = async (req, res) => {
  const { productId } = req.params;
  try {
    const result = await showDetailProduct(productId);
    if (result.length > 0) {
      await deleteProductEntry(productId);
      return res.status(200).json({
        success: true,
        message: "Product entry deleted",
        data: null,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Product entry does not exist",
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
