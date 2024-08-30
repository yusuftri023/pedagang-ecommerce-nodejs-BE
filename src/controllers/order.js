import { userDataByEmail } from "../models/customer.js";
import {
  allCustomerOrders,
  allCustomerOrdersCount,
  insertOrder,
  orderItemsList,
  updateTokenOrder,
} from "../models/order.js";
import { midtransCreateTransaction } from "../utils/midtrans.js";
import { customer } from "./customer.js";

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
        message: "Order items is empty",
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
  const { page, limit, order_by, order_dir } = req.query;
  try {
    const result = await allCustomerOrders(
      customerId,
      page,
      limit,
      order_by,
      order_dir
    );
    const total_count = await allCustomerOrdersCount(customerId);
    if (result) {
      return res.status(200).json({
        success: true,
        message: "Data Fetch success",
        data: result,
        total_count,
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
  const { order_list, address_id, payment_method_id, discount, shipping_cost } =
    req.body;
  try {
    if (order_list && customerId && address_id && payment_method_id) {
      const orderId = await insertOrder(
        order_list,
        customerId,
        address_id,
        payment_method_id
      );
      const customer_details = await userDataByEmail(emailToken);
      const token = await midtransCreateTransaction(
        orderId,
        order_list,
        customer_details,
        shipping_cost,
        discount
      );
      await updateTokenOrder(orderId, customerId, token);
      return res.status(201).json({
        success: true,
        message: "Order successfully created",
        data: {
          order_id: orderId,
          token: token,
        },
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
export const paymentToken = async (req, res) => {
  const { id: customerId } = req.decodedToken;
  const { order_id: orderId, payment_token: paymentToken } = req.body;
  try {
    if (customerId) {
      await updateTokenOrder(orderId, customerId, paymentToken);
      return res.status(201).json({
        success: true,
        message: "Order successfully created",
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
