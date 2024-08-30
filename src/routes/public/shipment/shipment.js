import express from "express";
import axios from "axios";
const router = express.Router();
router.get("/province", (req, res) => {
  axios
    .get("https://api.rajaongkir.com/starter/province", {
      headers: {
        key: "fc047c1ff364a797b715979366c0c960",
      },
      withCredentials: true,
    })
    .then((res) => console.log(res.data))
    .catch((err) => console.log(err.response.data));
  res.send("Testing");
});
export default router;
