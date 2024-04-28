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

  const { quantity, product_id } = req.body;
  try {
    const cartItems = await cartData(customerId, 1, 100);
    const cartItemsExist = cartItems
      ? cartItems.some(
          ({ product_id: dbProductId }) => product_id === dbProductId
        )
      : false;
    if (!cartItemsExist) {
      if (quantity > 0 && product_id) {
        await insertCart(quantity, customerId, product_id);
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
    } else {
      return res.status(400).json({
        success: false,
        message: "Product already in customer cart ",
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

  const { cart_id: cartId, quantity } = req.body;
  try {
    const cartItems = await cartData(customerId, 1, 100);

    const cartItemsExist =
      cartItems.length > 0
        ? cartItems.some(({ id: dbCartId }) => Number(cartId) === dbCartId)
        : false;
    if (cartItemsExist) {
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
export const deleteCartItem = async (req, res) => {
  const { id: customerId } = req.decodedToken;
  const { cartId } = req.params;

  try {
    const cartItems = await cartData(customerId, 1, 100);

    const cartItemsExist = cartItems
      ? cartItems.some(({ id: dbCartId }) => Number(cartId) === dbCartId)
      : false;
    if (cartItemsExist) {
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
