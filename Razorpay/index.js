require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const app = express();
const path = require("path");
const crypto = require("crypto");

const PORT = process.env.PORT || 3000;

// middlewears for converting req.body into json and urlencoded format
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// razorpay instance for creating orders
var razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});


// route for rendering index page
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "/index.html"));
});


// route for rendering success page
app.get("/success", (req, res) => {
  res.sendFile(path.join(__dirname, "/success.html"));
});


// route for rendering failure page
app.get("/failure", (req, res) => {
  res.sendFile(path.join(__dirname, "/failure.html"));
});


// route for rendering style.css
app.get("/style.css", (req, res) => {
  res.sendFile(path.join(__dirname, "/style.css"));
});


// route for creating order - neccesary before every new payment or diffrent order ids
app.post("/createOrder", async (req, res) => {
  try {
    const options = req.body; // {amount: 100, currency: "INR", receipt: "receipt_order_121"} for dummy testing
    console.log("Options received from index.html:", options);

    // creating order using razorpay instance
    const order = await razorpay.orders.create(options);
    console.log("Order created from node:", order);

    // sending order and key_id to index.html
    res.status(201).json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});


// route for validating payment - neccesary after payment for preventing fraud
app.post("/order/validate", async (req, res) => {
  // details came from handler function in index.html
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;

  // validating payment using razorpay key secret and crypto module
  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");

  console.log("Digest:", digest);
  console.log("Signature:", razorpay_signature);

  // check if digest and signature are same
  if (digest === razorpay_signature) {
    res.status(200).json({
      success: true,
      message: "Payment is valid",
      razorpay_payment_id,
      razorpay_order_id,
    });
  } else {
    res.status(401).json({ success: false, message: "Payment is invalid" });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
