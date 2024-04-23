import midtransClient from "midtrans-client";
const snap = new midtransClient.Snap({
  isProduction: false,
  serverKey: "YOUR_SERVER_KEY",
  clientKey: "YOUR_CLIENT_KEY",
});
