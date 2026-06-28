const OTP = require("./otp.model");

/**
 * GENERATE A 4-DIGIT RANDOM OTP FOR TEMPORARY REFERENCE
 */
const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};





/**
 * FORWARD OTP TO WORDPRESS GATEWAY FOR SMS DELIVERY
 * NOTE: WORDPRESS SENDS ITS OWN GENERATED OTP AND IGNORES THE ONE PASSED FROM NODE.JS
 */
const sendSMSOTP = async (phone, otp) => {
  const secretKey = process.env.WP_OTP_SECRET || "change-me-to-secure-string"; // SHARED SECRET KEY FOR API AUTHENTICATION
  const wpUrl = process.env.WP_OTP_URL || "https://globesproperties.com/wp-content/plugins/custom-contact-form/send-otp.php";

  try {
    const response = await fetch(wpUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-COTL-SECRET": secretKey
      },
      body: JSON.stringify({
        action: "send_otp",
        phone: phone,
        otp: otp
      })
    });

    const data = await response.json();
    console.log("WordPress PHP OTP Response:", JSON.stringify(data));

    if (data.status === "success" || (data.raw && data.raw.type === "success")) {
      console.log(`✅ OTP successfully triggered via WordPress API for ${phone}`);
      return true;
    } else {
      console.error("❌ WordPress API Failed:", data.message || JSON.stringify(data));

      // DEVELOPMENT FALLBACK BYPASS IN CASE LOCAL NETWORK BLOCKS CONNECTION
      if (process.env.NODE_ENV === "development") {
        console.warn("⚠️ Bypassed WordPress failure in Development. Testing OTP is:", otp);
        return true;
      }
      return false;
    }
  } catch (error) {
    console.error("❌ WordPress API Request Error:", error.message);

    // DEVELOPMENT FALLBACK BYPASS TO PREVENT CRASH DURING OFFLINE DEVELOPMENT
    if (process.env.NODE_ENV === "development") {
      console.warn("⚠️ Bypassed connection crash in Development. Testing OTP is:", otp);
      return true;
    }
    return false;
  }
};








/**
 * MAIN FUNCTION TO TRIGGER AND RECORD OTP SENDING
 */
exports.sendOTP = async (recipient, type) => {
  const otp = generateOTP();

  // SAVE OTP TO DB WITH 10 MINUTES EXPIRY AS A BACKUP RECORD
  await OTP.findOneAndUpdate(
    { recipient },
    {
      otp,
      type: "phone", // FORCED TO PHONE MODE AS PER REQUIREMENT
      verified: false,
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
    },
    { upsert: true, new: true },
  );

  // TRIGGER DELIVERY THROUGH THE SMS GATEWAY
  return await sendSMSOTP(recipient, otp);
};






/**
 * VERIFY THE OTP ENTERED BY USER AGAINST LOCAL DB AND WORDPRESS GATEWAY
 */
exports.verifyOTP = async (recipient, otp) => {
  const secretKey = process.env.WP_OTP_SECRET || "change-me-to-secure-string"; // SHARED SECRET KEY FOR API AUTHENTICATION
  const wpUrl = process.env.WP_OTP_URL || "https://globesproperties.com/wp-content/plugins/custom-contact-form/send-otp.php";

  try {
    console.log(`Verifying OTP ${otp} for ${recipient}...`);

    // CHECK LOCALLY FIRST (WORKS IF LOCAL DB MATCHES GENERATED CODE AND HAS NOT EXPIRED)
    const localRecord = await OTP.findOne({ recipient, otp, verified: false });
    if (localRecord) {
      if (localRecord.expiresAt > new Date()) {
        localRecord.verified = true;
        await localRecord.save();
        console.log("✅ OTP successfully verified locally via Database matching.");
        return true;
      } else {
        console.warn("❌ Local OTP has expired.");
      }
    }

    // SECONDARY FALLBACK VALIDATION AGAINST WORDPRESS GATEWAY
    // REQUIRED BECAUSE WORDPRESS GENERATES ITS OWN SMS OTP SEPARATE FROM NODE.JS SERVER
    const response = await fetch(wpUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-COTL-SECRET": secretKey
      },
      body: JSON.stringify({
        action: "verify_otp",
        phone: recipient,
        otp: otp
      })
    });

    const data = await response.json();
    console.log("WordPress Verification Response:", JSON.stringify(data));

    // CHECK SUCCESS SIGNALS RETURNED BY WORDPRESS GATEWAY (E.G. TYPE IS SUCCESS OR MOBILE ALREADY VERIFIED)
    const isSuccess = data.status === "success" ||
      data.type === "success" ||
      (data.raw && data.raw.type === "success") ||
      (data.message && data.message.includes("already verified"));

    if (isSuccess) {
      await OTP.findOneAndUpdate({ recipient }, { verified: true });
      return true;
    }

    return false;
  } catch (error) {
    console.error("❌ Verification Flow Error:", error.message);

    // DEVELOPMENT FALLBACK BYPASS TO PERVENT FLOW BLOCKAGE DURING LOCAL TESTING
    if (process.env.NODE_ENV === "development") {
      return true;
    }
    return false;
  }
};














/**
 * RESEND OTP VIA WORDPRESS GATEWAY RETRY ENDPOINT
 */
exports.resendOTP = async (recipient) => {
  const secretKey = process.env.WP_OTP_SECRET || "change-me-to-secure-string"; // SHARED SECRET KEY FOR API AUTHENTICATION
  const wpUrl = process.env.WP_OTP_URL || "https://globesproperties.com/wp-content/plugins/custom-contact-form/send-otp.php";

  try {
    console.log(`Resending OTP for ${recipient}...`);

    // FIND THE EXISTING RECORD AND EXTEND THE EXPIRY SO THE DB RECORD STAYS VALID FOR verification CHECK
    const existingRecord = await OTP.findOne({ recipient, verified: false });
    if (existingRecord) {
      existingRecord.expiresAt = new Date(Date.now() + 10 * 60 * 1000);
      await existingRecord.save();
    }

    const response = await fetch(wpUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-COTL-SECRET": secretKey
      },
      body: JSON.stringify({
        action: "resend_otp",
        phone: recipient
      })
    });

    const data = await response.json();
    console.log("WordPress Resend OTP Response:", JSON.stringify(data));

    const isSuccess = data.status === "success" || data.type === "success" || (data.raw && data.raw.type === "success");

    if (isSuccess) {
      console.log(`✅ OTP successfully resent via WordPress API for ${recipient}`);
      return true;
    }

    if (process.env.NODE_ENV === "development") {
      console.warn("⚠️ Bypassed WordPress resend failure in Development.");
      return true;
    }
    return false;
  } catch (error) {
    console.error("❌ Resend OTP Flow Error:", error.message);
    if (process.env.NODE_ENV === "development") {
      return true;
    }
    return false;
  }
};



//Jeet