import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import moment from "moment-timezone";

const timestamp = new Date();
timestamp.setHours(timestamp.getHours() + 7);
const today = moment.utc(timestamp).tz("Asia/Jakarta");

// @desc    Create order item
// @route   GET /api/order
// @access  Private
export const addOrderItems = asyncHandler(async (req, res) => {
    const {
        orderItems,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
        res.status(400);
        throw new Error("No order items");
    }

    const order = new Order({
        orderItems,
        user: req.user._id,
        shippingAddress,
        paymentMethod,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
});

// @desc    GET order by Id
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    );

    if (!order) {
        res.status(404);
        throw new Error("Order not found!");
    }

    res.json(order);
});

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error("Order not found!");
    }

    order.isPaid = true;
    order.paidAt = today;
    order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
    };

    const updatedOrder = await order.save();

    res.json(updatedOrder);
});

// @desc    GET orders user
// @route   GET /api/orders/myorders
// @access  Private
export const getUserOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id });

    res.json(orders);
});

// @desc    GET all orders
// @route   GET /api/orders/myorders
// @access  Private
export const getAllOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({}).populate("user", "id name");

    res.json(orders);
});

// @desc    Update deliver orders
// @route   PUT /api/orders/:id/delivered
// @access  Private
export const updateDeliverUser = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
        res.status(404);
        throw new Error("Order not found!");
    }

    order.isDelivered = true;
    order.deliveredAt = today;

    const updatedOrder = await order.save();

    res.json(updatedOrder);
});
