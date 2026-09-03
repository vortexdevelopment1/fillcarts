import Subscription from "../models/Subscription.js";

/**
 * Fetch Customer Daily Subscriptions
 * GET /api/subscriptions
 */
export const getSubscriptions = async (req, res) => {
  try {
    const customerId = req.user.id;
    const subs = await Subscription.find({ customerId }).sort({ _id: -1 });

    const formattedSubs = subs.map((s) => ({
      id: String(s._id),
      _id: s._id,
      plan_key: s.planKey,
      plan_name: s.planName,
      price: s.price,
      unit: s.unit,
      status: s.status,
      next_delivery: s.nextDelivery,
      created_at: s.createdAt,
    }));

    return res.send({ subscriptions: formattedSubs });
  } catch (error) {
    console.error("Get Subscriptions Error:", error.message);
    return res.send({ subscriptions: [] });
  }
};

/**
 * Activate a New Subscription Plan
 * POST /api/subscriptions
 */
export const createSubscription = async (req, res) => {
  try {
    const { plan_key, plan_name, price, unit, next_delivery } = req.body;
    if (!plan_key || !plan_name || !unit || !next_delivery) {
      return res.status(400).send("Missing subscription details");
    }

    const customerId = req.user.id;
    const newSub = await Subscription.create({
      customerId,
      planKey: plan_key,
      planName: plan_name,
      price: price ? Number(price) : null,
      unit,
      status: "Active",
      nextDelivery: next_delivery,
    });

    return res.status(201).send({
      message: "Subscription activated successfully",
      subscriptionId: String(newSub._id),
    });
  } catch (error) {
    console.error("Create Subscription Error:", error.message);
    return res.status(500).send("Failed to activate subscription");
  }
};

/**
 * Update Subscription Status (Active / Paused)
 * PUT /api/subscriptions/:id/status
 */
export const updateSubscriptionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const subscriptionId = req.params.id;
    const customerId = req.user.id;

    if (!status) {
      return res.status(400).send("Missing status");
    }

    await Subscription.findOneAndUpdate(
      { _id: subscriptionId, customerId },
      { status },
      { new: true }
    );

    return res.send({ message: `Subscription status updated to ${status}` });
  } catch (error) {
    console.error("Update Subscription Status Error:", error.message);
    return res.status(500).send("Failed to update subscription status");
  }
};

/**
 * Cancel a Subscription
 * DELETE /api/subscriptions/:id
 */
export const deleteSubscription = async (req, res) => {
  try {
    const subscriptionId = req.params.id;
    const customerId = req.user.id;

    await Subscription.findOneAndDelete({ _id: subscriptionId, customerId });
    return res.send({ message: "Subscription cancelled successfully" });
  } catch (error) {
    console.error("Cancel Subscription Error:", error.message);
    return res.status(500).send("Failed to cancel subscription");
  }
};
