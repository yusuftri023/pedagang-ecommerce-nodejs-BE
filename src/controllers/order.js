import { userDataByEmail } from "../models/customer.js";
import {
  allCustomerOrders,
  insertOrder,
  orderItemsList,
  updateStatusOrder,
} from "../models/order.js";
import { midtransCreateTransaction } from "../utils/midtrans.js";

export const customerOrderItemsList = async (req, res) => {
  const { id: customerId } = req.decodedToken;
  const { orderId } = req.params;
  try {
    const result = await orderItemsList(orderId, customerId);
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
export const customerOrders = async (req, res) => {
  const { id: customerId } = req.decodedToken;
  const { page, limit } = req.query;
  try {
    const result = await allCustomerOrders(customerId, page, limit);
    if (result) {
      return res.status(200).json({
        success: true,
        message: "Data Fetch success",
        data: result,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Customer has no order yet",
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
export const createOrder = async (req, res) => {
  const { id: customerId, email: emailToken } = req.decodedToken;
  const { order_list, address_id, payment_method_id } = req.body;
  try {
    if (order_list && customerId && address_id && payment_method_id) {
      const orderId = await insertOrder(
        order_list,
        customerId,
        address_id,
        payment_method_id
      );
      const customer_details = await userDataByEmail(emailToken);
      const result = await midtransCreateTransaction(
        orderId,
        order_list,
        customer_details
      );
      return res.status(201).json({
        success: true,
        message: "Order successfully created",
        data: result,
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
export const changeOrderStatus = async (req, res) => {
  const { orderId } = req.params;
  try {
    if (statusName) {
      await updateStatusOrder(orderId, statusName);
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
