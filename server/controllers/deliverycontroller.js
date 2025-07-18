import Delivery from "../models/Delilvery.js"

export const Alldeliveries = async (req, res) => {
  try {
    // Get the current date's start and end
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    const deliveries = await Delivery.find({
      deliveryDate: { $gte: startOfDay, $lte: endOfDay }
    })
      .populate('user', 'name') // only fetch user name
      .sort({ deliveryDate: -1 });

    res.status(200).json(deliveries);
  } catch (err) {
    console.error("Error in Alldeliveries:", err);
    res.status(500).json({ message: 'Error fetching deliveries', error: err.message });
  }
};

export const getUserDeliveries = async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);

    const deliveries = await Delivery.find({
      user: req.user.id,
      deliveryDate: { $gte: startOfDay, $lt: endOfDay }
    })
    .populate({
      path: 'subscription',
      select: 'status' // Only get status field
    })
    .sort({ deliveryDate: -1 });

    // Filter for active subscriptions
    const activeDeliveries = deliveries.filter(
      delivery => delivery.subscription?.status === 'active'
    );

    res.json(activeDeliveries);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching deliveries', error: err.message });
  }
};


export const updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryId, status } = req.body;

    // 1️⃣ Update the delivery status
    const delivery = await Delivery.findByIdAndUpdate(
      deliveryId,
      {
        status,
        deliveredAt: status === 'delivered' ? Date.now() : undefined,
      },
      { new: true }
    ).populate('subscription');

    if (!delivery) {
      return res.status(404).json({ message: 'Delivery not found' });
    }

    let subscriptionCompleted = false;
    let deletedCount = 0;

    // 2️⃣ Proceed only if delivery marked as delivered and has a subscription
    if (status === 'delivered' && delivery.subscription) {
      const subscription = delivery.subscription;

      // Normalize today and tomorrow to 00:00 UTC
      const now = new Date();
      const todayUTC = new Date(Date.UTC(
        now.getUTCFullYear(),
        now.getUTCMonth(),
        now.getUTCDate()
      ));
      const tomorrowUTC = new Date(todayUTC.getTime() + 86400000); // +1 day

      const endDate = new Date(subscription.endDate);
      const endDateUTC = new Date(Date.UTC(
        endDate.getUTCFullYear(),
        endDate.getUTCMonth(),
        endDate.getUTCDate()
      ));

      console.log("todayUTC:", todayUTC.toISOString());
      console.log("endDateUTC:", endDateUTC.toISOString());
      console.log("tomorrowUTC:", tomorrowUTC.toISOString());

      // 3️⃣ Delete any stray deliveries beyond endDate
      const strayDeliveries = await Delivery.deleteMany({
        subscription: subscription._id,
        deliveryDate: { $gt: endDateUTC }, // strictly after endDate
      });
      deletedCount = strayDeliveries.deletedCount || 0;

      // 4️⃣ Check for any remaining future deliveries (from tomorrow onwards)
      const futurePendingCount = await Delivery.countDocuments({
        subscription: subscription._id,
        deliveryDate: { $gte: tomorrowUTC },
        status: { $ne: 'delivered' },
      });

      const noFutureDeliveries = futurePendingCount === 0;
      const subscriptionHasEnded = todayUTC >= endDateUTC;

      // 5️⃣ If today is the end date and no future deliveries left, mark as completed
      if (subscriptionHasEnded && noFutureDeliveries) {
        subscription.status = 'completed';
        await subscription.save();
        subscriptionCompleted = true;
      }
    }

    // 6️⃣ Response
    return res.status(200).json({
      success: true,
      delivery,
      subscriptionCompleted,
      deletedCount,
      message: subscriptionCompleted
        ? `Delivery updated. Subscription marked as completed. ${deletedCount} future delivery(ies) removed.`
        : 'Delivery status updated.',
    });
  } catch (err) {
    console.error('Error updating delivery status:', err);
    return res.status(500).json({ message: 'Error updating delivery', error: err.message });
  }
};