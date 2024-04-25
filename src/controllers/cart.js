import {
  cartData,
  deleteCartEntry,
  insertCart,
  updateQuantityCart,
} from "../models/cart.js";

export const cartLists = async (req, res) => {
  const { id: customerId } = req.decodedToken;
  const { page, limit } = req.query;
  try {
    const result = await cartData(customerId, page, limit);
    if (result) {
      return res.status(200).json({
        success: true,
        message: "Data Fetch success",
        data: result,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Customer cart is empty",
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

export const addToCart = async (req, res) => {
  const { id: customerId } = req.decodedToken;
  const { quantity } = req.query;
  const { productId } = req.params;
  try {
    if (quantity && productId) {
      await insertCart(quantity, customerId, productId);
      return res.status(201).json({
        success: true,
        message: "Cart item successfully created",
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

export const changeChartItemQuantity = async (req, res) => {
  const { id: customerId } = req.decodedToken;
  const { quantity } = req.query;
  const { cartId } = req.params;
  try {
    if (quantity > 0) {
      await updateQuantityCart(cartId, customerId, quantity);
      return res.status(201).json({
        success: true,
        message: "Cart successfully updated",
        data: null,
      });
    } else {
      return res.status(400).json({
        success: false,
        message: "Request is not complete",
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
export const deleteCartItem = async (req, res) => {
  const { id: customerId } = req.decodedToken;
  const { cartId } = req.params;
  try {
    if (data) {
      await deleteCartEntry(cartId, customerId);
      return res.status(200).json({
        success: true,
        message: "Cart entry deleted",
        data: null,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Cart entry does not exist",
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
