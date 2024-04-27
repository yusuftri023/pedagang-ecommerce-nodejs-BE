import {
  deleteProductEntry,
  insertProduct,
  showDetailProduct,
} from "../models/product.js";

export const detailProduct = async (req, res) => {
  const { productId } = req.params;

  try {
    const result = await showDetailProduct(productId);
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
  const { title, price, stock, categoryId, configs, image, description } =
    req.body;
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
    const data = await showDetailProduct(productId);
    if (data) {
      await deleteProductEntry(productId);
      return res.status(200).json({
        success: true,
        message: "Address entry deleted",
        data: null,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Address entry does not exist",
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
