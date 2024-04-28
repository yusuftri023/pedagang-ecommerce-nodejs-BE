import { showPayment } from "../models/payment.js";

export const customerPaymentDetail = async (req, res) => {
  const { id: customerId } = req.decodedToken;
  const { paymentId } = req.params;
  try {
    const result = await showPayment(paymentId, customerId);
    if (result) {
      return res.status(200).json({
        success: true,
        message: "Data Fetch success",
        data: result,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "Customer payment details does not exist",
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
