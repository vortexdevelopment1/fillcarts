import Address from "../models/Address.js";

/**
 * Fetch Customer Addresses
 * GET /api/addresses
 */
export const getAddresses = async (req, res) => {
  try {
    const customerId = req.user.id;
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit, 10) || 50));
    const skip = (page - 1) * limit;

    const total = await Address.countDocuments({ customerId });
    const addresses = await Address.find({ customerId })
      .sort({ _id: -1 })
      .skip(skip)
      .limit(limit);

    const formattedAddresses = addresses.map((a) => ({
      id: String(a._id),
      _id: a._id,
      type: a.type,
      name: a.name,
      phone: a.phone,
      pincode: a.pincode,
      locality: a.locality,
      street: a.street,
      address_line: a.addressLine,
      city: a.city,
      state: a.state,
      landmark: a.landmark,
      alt_phone: a.altPhone,
    }));

    return res.send({
      addresses: formattedAddresses,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get Addresses Error:", error.message);
    return res.send({ addresses: [] });
  }
};

/**
 * Create a New Delivery Address
 * POST /api/addresses
 */
export const createAddress = async (req, res) => {
  try {
    const {
      type,
      name,
      phone,
      pincode,
      locality,
      address_line,
      street,
      city,
      state,
      landmark,
      alt_phone,
    } = req.body;

    const cleanPincode = (pincode || "").trim();
    if (cleanPincode && !/^\d{6}$/.test(cleanPincode)) {
      return res.status(400).send("Pincode must be exactly 6 digits");
    }

    const cleanName = (name || "").trim();
    const cleanPhone = (phone || "").trim();
    const cleanLocality = (locality || "").trim();
    const cleanStreet = (street || address_line || "").trim();
    const cleanCity = (city || "").trim();
    const cleanState = (state || "").trim();
    const cleanLandmark = (landmark || "").trim();
    const cleanAltPhone = (alt_phone || "").trim();
    const cleanType = (type || "HOME").trim().toUpperCase();

    const formattedLine = cleanStreet
      ? `${cleanStreet}${cleanLocality ? ", " + cleanLocality : ""}${cleanLandmark ? ", " + cleanLandmark : ""}${cleanCity ? ", " + cleanCity : ""}${cleanState ? ", " + cleanState : ""} - ${cleanPincode}`
      : address_line || "";

    const customerId = req.user.id;

    const newAddr = await Address.create({
      customerId,
      type: cleanType,
      name: cleanName,
      phone: cleanPhone,
      pincode: cleanPincode,
      locality: cleanLocality,
      street: cleanStreet,
      addressLine: formattedLine,
      city: cleanCity,
      state: cleanState,
      landmark: cleanLandmark,
      altPhone: cleanAltPhone,
    });

    const responseAddr = {
      id: String(newAddr._id),
      _id: newAddr._id,
      type: cleanType,
      name: cleanName,
      phone: cleanPhone,
      pincode: cleanPincode,
      locality: cleanLocality,
      street: cleanStreet,
      address_line: formattedLine,
      city: cleanCity,
      state: cleanState,
      landmark: cleanLandmark,
      alt_phone: cleanAltPhone,
    };

    return res.status(201).send({
      message: "Address added successfully",
      addressId: String(newAddr._id),
      address: responseAddr,
    });
  } catch (error) {
    console.error("Create Address Error:", error.message);
    return res.status(500).send("Failed to save address");
  }
};

/**
 * Update an Existing Delivery Address
 * PUT /api/addresses/:id
 */
export const updateAddress = async (req, res) => {
  try {
    const {
      type,
      name,
      phone,
      pincode,
      locality,
      address_line,
      street,
      city,
      state,
      landmark,
      alt_phone,
    } = req.body;
    const addressId = req.params.id;
    const customerId = req.user.id;

    const cleanPincode = (pincode || "").trim();
    if (cleanPincode && !/^\d{6}$/.test(cleanPincode)) {
      return res.status(400).send("Pincode must be exactly 6 digits");
    }

    const cleanName = (name || "").trim();
    const cleanPhone = (phone || "").trim();
    const cleanLocality = (locality || "").trim();
    const cleanStreet = (street || address_line || "").trim();
    const cleanCity = (city || "").trim();
    const cleanState = (state || "").trim();
    const cleanLandmark = (landmark || "").trim();
    const cleanAltPhone = (alt_phone || "").trim();
    const cleanType = (type || "HOME").trim().toUpperCase();

    const formattedLine = cleanStreet
      ? `${cleanStreet}${cleanLocality ? ", " + cleanLocality : ""}${cleanLandmark ? ", " + cleanLandmark : ""}${cleanCity ? ", " + cleanCity : ""}${cleanState ? ", " + cleanState : ""} - ${cleanPincode}`
      : address_line || "";

    await Address.findOneAndUpdate(
      { _id: addressId, customerId },
      {
        type: cleanType,
        name: cleanName,
        phone: cleanPhone,
        pincode: cleanPincode,
        locality: cleanLocality,
        street: cleanStreet,
        addressLine: formattedLine,
        city: cleanCity,
        state: cleanState,
        landmark: cleanLandmark,
        altPhone: cleanAltPhone,
      },
      { new: true }
    );

    const responseObj = {
      id: addressId,
      type: cleanType,
      name: cleanName,
      phone: cleanPhone,
      pincode: cleanPincode,
      locality: cleanLocality,
      street: cleanStreet,
      address_line: formattedLine,
      city: cleanCity,
      state: cleanState,
      landmark: cleanLandmark,
      alt_phone: cleanAltPhone,
    };

    return res.send({
      message: "Address updated successfully",
      address: responseObj,
    });
  } catch (error) {
    console.error("Update Address Error:", error.message);
    return res.status(500).send("Failed to update address");
  }
};

/**
 * Delete a Delivery Address
 * DELETE /api/addresses/:id
 */
export const deleteAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const customerId = req.user.id;

    await Address.findOneAndDelete({ _id: addressId, customerId });
    return res.send({ message: "Address deleted successfully" });
  } catch (error) {
    console.error("Delete Address Error:", error.message);
    return res.status(500).send("Failed to delete address");
  }
};
