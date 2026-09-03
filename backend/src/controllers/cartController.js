import Cart from "../models/Cart.js";

/**
 * Fetch Authenticated User Cart
 * GET /api/cart
 */
export const getCart = async (req, res) => {
  try {
    const customerId = req.user.id;
    const cartDoc = await Cart.findOne({ customerId });
    return res.send({ cart: cartDoc?.items || [] });
  } catch (error) {
    console.error("Get Cart Error:", error.message);
    return res.send({ cart: [] });
  }
};

/**
 * Save / Sync Authenticated User Cart
 * POST /api/cart
 */
export const saveCart = async (req, res) => {
  try {
    const { cart } = req.body;
    const customerId = req.user.id;
    const safeCart = Array.isArray(cart) ? cart : [];

    await Cart.findOneAndUpdate(
      { customerId },
      { items: safeCart },
      { upsert: true, new: true }
    );

    return res.send({ message: "Cart saved successfully", cart: safeCart });
  } catch (error) {
    console.error("Save Cart Error:", error.message);
    return res.status(500).send("Failed to save cart");
  }
};
