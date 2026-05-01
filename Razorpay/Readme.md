# Razorpay Integration Guide (Node.js + Express)


A step-by-step guide to integrating Razorpay payment gateway in a simple web application.

## Step 1: Installation

Install the necessary dependencies:

```bash
npm install express razorpay dotenv nodemon
```

## Step 2: Environment Setup

Create a `.env` file in your root directory:

```env
PORT=3000
RAZORPAY_KEY_ID=your_key_id
RAZORPAY_KEY_SECRET=your_key_secret
```

## Step 3: Backend Setup (`index.js`)

Initialize Razorpay and create routes for order creation and validation.

### 1. Initialize Razorpay

```javascript
const Razorpay = require("razorpay");
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});
```

### 2. Create Order Route

```javascript
app.post("/createOrder", async (req, res) => {
  const order = await razorpay.orders.create(req.body);
  res
    .status(201)
    .json({ success: true, order, key_id: process.env.RAZORPAY_KEY_ID });
});
```

### 3. Validate Payment Route

```javascript
app.post("/order/validate", async (req, res) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature } =
    req.body;
  const sha = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET);
  sha.update(`${razorpay_order_id}|${razorpay_payment_id}`);
  const digest = sha.digest("hex");

  if (digest === razorpay_signature) {
    res.json({ success: true, message: "Payment is valid" });
  } else {
    res.status(401).json({ success: false, message: "Payment is invalid" });
  }
});
```

## Step 4: Frontend Setup (`index.html`)

Include the Razorpay SDK and trigger the payment flow.

### 1. Include SDK

```html
<script src="https://checkout.razorpay.com/v1/checkout.js"></script>
```

### 2. Trigger Payment

```javascript
// 1. Get Order ID from Backend
const res = await fetch("/createOrder", {
  method: "POST",
  body: JSON.stringify({
    amount: 100,
    currency: "INR",
    receipt: "receipt_order_121",
  }),
}); //Amount should be in paise
const data = await res.json();

// 2. Open Razorpay Modal
const options = {
  key: data.key_id,
  amount: data.order.amount,
  order_id: data.order.id,
  // ...other option like prefill, theme, etc. for example: name, description, image, etc.
  handler: async function (response) {
    // 3. Validate on backend after success
    const vData = await fetch("/order/validate", {
      method: "POST",
      body: JSON.stringify(response),
    });
    const data = await vData.json();
    if (data.success) {
      window.location.href = "/success"; // change url to success page
    } else {
      window.location.href = "/failure"; // change url to failure page
    }
  },
};

const rzp = new Razorpay(options); // razorpay object - take options created above

// event for handling payment failure
rzp.on("payment.failed", function (response) {
  console.log("Error during payment from index.html:", response.error);
  window.location.href = "/failure";
});

rzp.open(); // open razorpay modal
```

## Step 5: Run the Project

```bash
node index.js
```

Visit `http://localhost:3000` to test.