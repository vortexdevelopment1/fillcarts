const axios = require("axios");

async function sendSMS(phone, otp) {
  const authKey = process.env.FAST2SMS_API;

  if (!authKey || authKey.trim() === "" || authKey.trim() === "your_api_key") {
    console.warn("Fast2SMS auth key is missing or still a placeholder. OTP is available in terminal for testing only.");
    return false;
  }

  try {
    await axios.get("https://www.fast2sms.com/dev/bulkV2", {
      params: {
        authorization: authKey,
        variables_values: otp,
        route: "otp",
        numbers: phone,
      },
    });

    return true;
  } catch (error) {
    console.error("Fast2SMS delivery failed:", error?.response?.data || error?.message);
    return false;
  }
}

module.exports = sendSMS;