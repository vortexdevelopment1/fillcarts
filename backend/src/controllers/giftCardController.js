import User from "../models/User.js";

/**
 * Fetch Customer Gift Card Balance
 * GET /api/giftcard
 */
export const getGiftCardBalance = async (req, res) => {
  try {
    const customerId = req.user.id;
    const user = await User.findById(customerId);
    return res.send({ balance: Number(user?.gift_card_balance || 0).toFixed(2) });
  } catch (error) {
    console.error("Get Giftcard Error:", error.message);
    return res.send({ balance: "0.00" });
  }
};

/**
 * Redeem Gift Card Promo Code
 * POST /api/giftcard/redeem
 */
export const redeemGiftCard = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) {
      return res.status(400).send("Missing promo/gift card code");
    }

    const upperCode = code.trim().toUpperCase();
    let amount = 0;
    if (upperCode === "GIFT50") amount = 50.0;
    else if (upperCode === "GIFT100") amount = 100.0;
    else if (upperCode === "GIFT500") amount = 500.0;
    else {
      return res.status(400).send("Invalid gift card or promo code");
    }

    const customerId = req.user.id;

    // Atomic update to prevent race conditions
    const updatedUser = await User.findByIdAndUpdate(
      customerId,
      { $inc: { gift_card_balance: amount } },
      { new: true }
    );

    const newBal = Number(updatedUser?.gift_card_balance || 0).toFixed(2);

    return res.send({
      message: `Successfully redeemed ₹${amount}!`,
      balance: newBal,
    });
  } catch (error) {
    console.error("Redeem Giftcard Error:", error.message);
    return res.status(500).send("Failed to redeem gift card");
  }
};

/**
 * Purchase / Top-up Gift Card Balance
 * POST /api/giftcard/buy
 */
export const buyGiftCard = async (req, res) => {
  try {
    const { amount } = req.body;
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      return res.status(400).send("Invalid purchase amount");
    }

    const customerId = req.user.id;

    // Atomic update to prevent race conditions
    const updatedUser = await User.findByIdAndUpdate(
      customerId,
      { $inc: { gift_card_balance: numAmount } },
      { new: true }
    );

    const newBal = Number(updatedUser?.gift_card_balance || 0).toFixed(2);

    return res.send({
      message: `Successfully purchased ₹${numAmount} credits!`,
      balance: newBal,
    });
  } catch (error) {
    console.error("Buy Giftcard Error:", error.message);
    return res.status(500).send("Failed to purchase gift card");
  }
};
