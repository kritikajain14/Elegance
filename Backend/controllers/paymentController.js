import asyncHandler from 'express-async-handler';
import Stripe from 'stripe';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// @desc    Create Stripe payment intent
// @route   POST /api/payments/create-payment-intent
// @access  Private
// const createPaymentIntent = asyncHandler(async (req, res) => {
//   const { items, shippingAddress, taxPrice, shippingPrice } = req.body;
  
//   // Validate items
//   if (!items || !Array.isArray(items) || items.length === 0) {
//     res.status(400);
//     throw new Error("No items provided");
//   }
  
//   // Calculate total amount
//   const itemsPrice = items.reduce((total, item) => 
//     total + (item.productId.price * item.quantity), 0);
  
//   const totalAmount = Math.round((itemsPrice + taxPrice + shippingPrice) * 100);
  
 
// const paymentIntent = await stripe.paymentIntents.create({
//   amount: totalAmount, // MUST be number
//   currency: "usd",
//   payment_method_types: ['card'],
//   automatic_payment_methods: {
//     enabled: false,
//   },
// });

// res.json({
//   clientSecret: paymentIntent.client_secret,
// });
// });

const createPaymentIntent = asyncHandler(async (req, res) => {
  const { items, taxPrice = 0, shippingPrice = 0 } = req.body;

  if (!items || items.length === 0) {
    res.status(400);
    throw new Error("No items provided");
  }

  let itemsPrice = 0;

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }
    itemsPrice += product.price * item.quantity;
  }

  const totalAmount = Math.round(
    (itemsPrice + taxPrice + shippingPrice) * 100
  );

  const paymentIntent = await stripe.paymentIntents.create({
    amount: totalAmount,
    currency: 'usd',
    payment_method_types: ['card'],
    metadata: {
      userId: req.user._id.toString()
    }
  });

  res.json({
    clientSecret: paymentIntent.client_secret,
    amount: totalAmount / 100
  });
});


// @desc    Create order after successful payment
// @route   POST /api/payments/create-order
// @access  Private
// const createOrder = asyncHandler(async (req, res) => {
//   const { 
//     paymentIntentId, 
//     items, 
//     shippingAddress, 
//     taxPrice, 
//     shippingPrice,
//     itemsPrice,
//     totalPrice 
//   } = req.body;
  
//   // Verify payment with Stripe
//   const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
  
//   if (paymentIntent.status !== 'succeeded') {
//     res.status(400);
//     throw new Error('Payment not successful');
//   }
  
//   // Create order
//   const order = new Order({
//     user: req.user._id,
//     orderItems: items.map(item => ({
//       productId: item.productId._id,
//       name: item.productId.name,
//       image: item.productId.images[0],
//       price: item.productId.price,
//       quantity: item.quantity,
//       size: item.productId.size
//     })),
//     shippingAddress,
//     paymentResult: {
//       stripeId: paymentIntent.id,
//       status: paymentIntent.status,
//       email: paymentIntent.receipt_email,
//       update_time: new Date().toISOString()
//     },
//     itemsPrice,
//     taxPrice,
//     shippingPrice,
//     totalPrice,
//     isPaid: true,
//     paidAt: Date.now(),
//     status: 'processing'
//   });
  
//   // Update product stock
//   for (const item of items) {
//     const product = await Product.findById(item.productId._id);
//     if (product) {
//       product.stock -= item.quantity;
//       await product.save();
//     }
//   }
  
//   // Clear user's cart
//   await Cart.findOneAndDelete({ userId: req.user._id });
  
//   const createdOrder = await order.save();
  
//   res.status(201).json({
//     message: 'Order created successfully',
//     order: createdOrder
//   });
// });

const createOrder = asyncHandler(async (req, res) => {
  const { paymentIntentId, items, shippingAddress } = req.body;

  if (!paymentIntentId) {
    res.status(400);
    throw new Error("paymentIntentId missing");
  }

  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

  if (paymentIntent.status !== 'succeeded') {
    res.status(400);
    throw new Error("Payment not successful");
  }

  const orderItems = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product) {
      res.status(404);
      throw new Error("Product not found");
    }

    orderItems.push({
      productId: product._id,
      name: product.name,
      image: product.images[0],
      price: product.price,
      quantity: item.quantity,
      size: product.size
    });

    product.stock -= item.quantity;
    await product.save();
  }

  const order = await Order.create({
    user: req.user._id,
    orderItems,
    shippingAddress,
    paymentResult: {
      stripeId: paymentIntent.id,
      status: paymentIntent.status
    },
    totalPrice: paymentIntent.amount / 100,
    isPaid: true,
    paidAt: Date.now(),
    status: 'processing'
  });

  await Cart.findOneAndDelete({ userId: req.user._id });

  res.status(201).json({
    message: "Order created successfully",
    order
  });
});


// @desc    Get user's orders
// @route   GET /api/payments/orders
// @access  Private
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id })
    .sort({ createdAt: -1 });
  
  res.json(orders);
});

// @desc    Get order by ID
// @route   GET /api/payments/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate('user', 'name email');
  
  if (order) {
    if (order.user._id.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      res.status(401);
      throw new Error('Not authorized to view this order');
    }
    res.json(order);
  } else {
    res.status(404);
    throw new Error('Order not found');
  }
});

// @desc    Get Stripe publishable key
// @route   GET /api/payments/config
// @access  Public
const getStripeConfig = asyncHandler(async (req, res) => {
  res.json({
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
  });
});

// @desc    Handle Stripe webhook
// @route   POST /api/payments/webhook
// @access  Public
const handleWebhook = asyncHandler(async (req, res) => {
  const sig = req.headers['stripe-signature'];
  
  let event;
  
  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(`Webhook Error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle the event
  switch (event.type) {
    case 'payment_intent.succeeded':
      const paymentIntent = event.data.object;
      console.log(`PaymentIntent for ${paymentIntent.amount} was successful!`);
      // Update order status in your database
      break;
    case 'payment_intent.payment_failed':
      const failedPaymentIntent = event.data.object;
      console.log(`Payment failed: ${failedPaymentIntent.last_payment_error?.message}`);
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
  
  res.json({ received: true });
});

export {
  createPaymentIntent,
  createOrder,
  getUserOrders,
  getOrderById,
  getStripeConfig,
  handleWebhook
};