import {
  cartData,
  deleteCartEntry,
  insertCart,
  updateQuantityCart,
  upsertCartNote,
} from "../models/cart.js";

export const cartLists = async (req, res) => {
  const { id: customerId } = req.decodedToken;

  try {
    const result = await cartData(customerId);
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

  const { product_id, product_config_id } = req.body;
  let { quantity } = req.body;

  quantity = Number(quantity) ? Number(quantity) : 1;
  try {
    const cartItems = await cartData(customerId);
    const cartItemsExist = cartItems
      ? cartItems.some(
          ({ product_id: dbProductId, product_config_id: dbProductConfigId }) =>
            product_id === dbProductId &&
            dbProductConfigId === product_config_id
        )
      : false;

    if (!cartItemsExist) {
      if (quantity > 0 && product_id && product_config_id) {
        await insertCart(quantity, customerId, product_id, product_config_id);
        return res.status(201).json({
          success: true,
          message: "Cart item successfully created",
          data: null,
        });
      } else {
        return res.status(201).json({
          success: false,
          message: "Request is not complete ",
          data: null,
        });
      }
    } else {
      const cartItem = cartItems.find(
        ({ product_id: dbProductId, product_config_id: dbProductConfigId }) =>
          product_id === dbProductId && dbProductConfigId === product_config_id
      );

      quantity =
        cartItem.quantity + quantity > cartItem.stock
          ? cartItem.stock
          : cartItem.quantity + quantity;

      await updateQuantityCart(cartItem.cart_id, customerId, quantity);

      return res.status(200).json({
        success: true,
        message: "Product quantity updated",
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

export const postCartItemNote = async (req, res) => {
  const { id: customerId } = req.decodedToken;

  const { cart_id: cartId, note } = req.body;

  try {
    if (note === null || note?.length > 0) {
      await upsertCartNote(cartId, customerId, note);

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
export const changeChartItemQuantity = async (req, res) => {
  const { id: customerId } = req.decodedToken;

  let { quantity } = req.body;
  const { cart_id: cartId } = req.body;

  try {
    const cartItems = await cartData(customerId);

    const cartItemsExist =
      cartItems.length > 0
        ? cartItems.some(({ cart_id: dbCartId }) => Number(cartId) === dbCartId)
        : false;
    if (cartItemsExist) {
      if (quantity > 0) {
        quantity = quantity > 1000 ? 1000 : quantity;
        quantity = quantity < 1 ? 1 : quantity;
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
    const cartItems = await cartData(customerId);

    const cartItemsExist = cartItems
      ? cartItems.some(({ cart_id: dbCartId }) => Number(cartId) === dbCartId)
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
