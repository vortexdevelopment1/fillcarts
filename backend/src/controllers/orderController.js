import Order from "../models/Order.js";
import Cart from "../models/Cart.js";

/**
 * Fetch Customer Orders (with pagination)
 * GET /api/orders
 */
export const getOrders = async (req, res) => {
  try {
    const customerId = req.user.id;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 20));
    const skip = (page - 1) * limit;

    const total = await Order.countDocuments({ customerId });
    const orders = await Order.find({ customerId })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    const formattedOrders = orders.map((o) => ({
      id: String(o._id),
      _id: o._id,
      items: o.items || [],
      total: o.total,
      status: o.status,
      payment_method: o.paymentMethod,
      delivery_address: o.deliveryAddress,
      created_at: o.createdAt,
    }));

    return res.send({
      orders: formattedOrders,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get Orders Error:", error.message);
    return res.send({ orders: [] });
  }
};

/**
 * Place a New Customer Order
 * POST /api/orders
 */
export const createOrder = async (req, res) => {
  try {
    const { items, total, payment_method, delivery_address } = req.body;
    if (!items || !total || !payment_method || !delivery_address) {
      return res.status(400).send("Missing order details");
    }

    const customerId = req.user.id;
    const newOrder = await Order.create({
      customerId,
      items: Array.isArray(items) ? items : [],
      total: Number(total),
      paymentMethod: payment_method,
      deliveryAddress: delivery_address,
      status: "Delivered",
    });

    // Clear cart after placing order
    await Cart.deleteOne({ customerId });

    return res.status(201).send({
      message: "Order placed successfully",
      orderId: String(newOrder._id),
    });
  } catch (error) {
    console.error("Create Order Error:", error.message);
    return res.status(500).send("Failed to place order");
  }
};
