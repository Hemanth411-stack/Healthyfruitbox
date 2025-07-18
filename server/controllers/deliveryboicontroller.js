import jwt from 'jsonwebtoken';
import DeliveryBoy from "../models/Deliveryboi.js"
import UserInfo from "../models/Userinformation.js"
import Delivery from "../models/Delilvery.js"
import Subscription from "../models/subscription.js"
export const registerDeliveryBoy = async (req, res) => {
  try {
    const { name, phone, password, serviceAreas } = req.body;

    const existing = await DeliveryBoy.findOne({ phone });
    if (existing) {
      return res.status(400).json({ message: 'Phone number already registered' });
    }

    const deliveryBoy = await DeliveryBoy.create({
      name,
      phone,
      password,
      serviceAreas
    });

    res.status(201).json({
      message: 'Registered successfully',
      deliveryBoy: {
        id: deliveryBoy._id,
        name: deliveryBoy.name,
        phone: deliveryBoy.phone,
        serviceAreas: deliveryBoy.serviceAreas
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Registration failed', error: err.message });
  }
};

export const loginDeliveryBoy = async (req, res) => {
  try {
    const { phone, password } = req.body;
    console.log("login details",phone,password)
    const deliveryBoy = await DeliveryBoy.findOne({ phone });
    console.log("deliveryboi details",deliveryBoy)
    if (!deliveryBoy || !(await deliveryBoy.comparePassword(password))) {
      return res.status(401).json({ message: 'Invalid phone or password' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: deliveryBoy._id, role: 'deliveryBoy' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({
      message: 'Login successful',
      token,
      deliveryBoy: {
        id: deliveryBoy._id,
        name: deliveryBoy.name,
        serviceAreas: deliveryBoy.serviceAreas
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'Login failed', error: err.message });
  }
};


export const getMyDeliveries = async (req, res) => {
  try {
    console.log("req.user value:", req.user);

    const deliveryBoyId = req.user.id || req.user._id;

    // 1. Find delivery boy and get service areas
    const deliveryBoy = await DeliveryBoy.findById(deliveryBoyId);
    if (!deliveryBoy) {
      return res.status(404).json({ message: "Delivery boy not found" });
    }

    const serviceAreas = deliveryBoy.serviceAreas;

    // 2. Get today's date range
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);

    // 3. Find today's deliveries in those areas
    const deliveriesRaw = await Delivery.find({
      'address.area': { $in: serviceAreas },
      deliveryDate: { $gte: startOfDay, $lte: endOfDay }
    })
      .sort({
        'address.area': 1,
        'address.street': 1,
        deliveryDate: 1
      })
      .lean();

    // 4. Get all unique userIds from deliveries
    const userIds = [...new Set(deliveriesRaw.map(d => d.user.toString()))];

    // 5. Fetch all subscriptions for these users and populate product names
    const allSubscriptions = await Subscription.find({
      user: { $in: userIds }
    })
      .populate({
        path: 'products.product',
        select: 'name' // Only get the product name
      })
      .lean();

    // Create maps for efficient lookup
    const userActiveSubsMap = new Map(); // userId -> [subscriptionIds]
    const subscriptionMap = new Map();   // subscriptionId -> subscription

    allSubscriptions.forEach(sub => {
      if (sub.status === 'active') {
        const userId = sub.user.toString();
        
        if (!userActiveSubsMap.has(userId)) {
          userActiveSubsMap.set(userId, []);
        }
        userActiveSubsMap.get(userId).push(sub._id.toString());
        subscriptionMap.set(sub._id.toString(), sub);
      }
    });

    // 6. Filter deliveries to only include those with active subscriptions
    const filteredDeliveries = deliveriesRaw.filter(delivery => {
      const userId = delivery.user.toString();
      const activeSubIds = userActiveSubsMap.get(userId) || [];
      return activeSubIds.includes(delivery.subscription.toString());
    });

    // 7. Get user info only for users with active subscriptions
    const activeUserIds = [...new Set(filteredDeliveries.map(d => d.user.toString()))];
    const userInfos = await UserInfo.find({ 
      user: { $in: activeUserIds } 
    }).lean();

    // 8. Create user info map
    const userInfoMap = {};
    userInfos.forEach(info => {
      userInfoMap[info.user.toString()] = info;
    });

    // 9. Enrich delivery data with product names and user info
    const enrichedDeliveries = filteredDeliveries.map(delivery => {
      const subscription = subscriptionMap.get(delivery.subscription.toString());
      const userInfo = userInfoMap[delivery.user.toString()];

      // Extract all product details from the subscription
      const products = subscription?.products?.map(product => ({
        name: product.product?.name || 'Unknown Product',
        type: product.productType,
        quantity: product.quantity,
        basePrice: product.basePrice,
        addOnPrices: product.addOnPrices || {}
      })) || [];

      return {
        ...delivery,
        products, // Array of all products with their details
        userInfo: userInfo ? {
          fullName: userInfo.fullName,
          phone: userInfo.phone,
          googleMapLink: userInfo.address?.googleMapLink,
        } : null
      };
    });

    res.status(200).json({
      message: "Today's deliveries fetched successfully",
      total: enrichedDeliveries.length,
      deliveries: enrichedDeliveries
    });

  } catch (err) {
    console.error("Error in getMyDeliveries:", err);
    res.status(500).json({
      message: "Failed to fetch deliveries",
      error: err.message
    });
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

export const getalldeliveryboinames = async (req, res) => {
  try {
    console.log("req.user value:", req.user);


    // 1. Find delivery boy and get service areas
    const deliveryBoys = await DeliveryBoy.find();
    if (!deliveryBoys) {
      return res.status(404).json({ message: "Delivery boy not found" });
    }

    // 9. Return result
    res.status(200).json(deliveryBoys);

  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch deliveries",
      error: err.message
    });
  }
};