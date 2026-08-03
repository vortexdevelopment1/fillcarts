const axios = require("axios");

async function sendSMS(phone, otp) {
  await axios.get("https://www.fast2sms.com/dev/bulkV2", {
    params: {
      authorization: process.env.FAST2SMS_API,
      variables_values: otp,
      route: "otp",
      numbers: phone
    }
  });
}

module.exports = sendSMS;