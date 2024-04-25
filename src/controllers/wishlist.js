import {
  checkWishlist,
  deleteWishlistEntry,
  insertWishlist,
  wishlistData,
  wishlistItems,
} from "../models/wishlist.js";

export const customerWishlist = async (req, res) => {
  const { id: customerId } = req.decodedToken;
  const { limit, page } = req.query;

  try {
    const result = await wishlistItems(customerId, page, limit);
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
export const addWishlist = async (req, res) => {
  const { id: customerId } = req.decodedToken;
  const { productId } = req.params;

  try {
    const isMatch = await checkWishlist(customerId, productId);
    if (isMatch) {
      return res.status(400).json({
        success: false,
        message: "data already exist",
        data: null,
      });
    }

    const result = await insertWishlist(customerId, productId);
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
export const deleteWishlist = async (req, res) => {
  const { id: customerId } = req.decodedToken;
  const { wishlistId } = req.params;
  try {
    const data = await wishlistData(customerId, wishlistId);
    if (data) {
      await deleteWishlistEntry(wishlistId);
      return res.status(200).json({
        success: true,
        message: "Account deleted",
        data: null,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Wishlist entry does not exist",
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
