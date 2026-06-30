const Inquiry = require("./inquiry.model");
const otpService = require("../otp/otp.service");
const { createAdminNotification } = require("../notifications/admin_notification.service");

/**
 * Service to handle OTP generation and sending
 */
exports.generateAndSendOTP = async (inquiryData) => {
  // 1. Look for an existing unverified inquiry for this email
  let inquiry = await Inquiry.findOne({
    email: inquiryData.email,
    isVerified: false,
  });

  if (inquiry) {
    // Update existing unverified inquiry with new data
    inquiry.name = inquiryData.name;
    inquiry.phone = inquiryData.phone;
    inquiry.message = inquiryData.message;
    inquiry.propertyId = inquiryData.propertyId;
  } else {
    // Create a new inquiry record
    inquiry = new Inquiry({
      ...inquiryData,
    });
  }

  await inquiry.save();

  // 2. Trigger 4-digit SMS OTP sending through otpService
  const sent = await otpService.sendOTP(inquiry.phone, "sms");
  if (!sent) {
    throw new Error("Failed to send OTP to mobile. Please check the mobile number and try again.");
  }

  return { success: true, message: "OTP sent successfully to your mobile number" };
};

/**
 * Service to verify OTP and finalize inquiry
 */
exports.verifyAndFinalizeInquiry = async (email, otp) => {
  // Find inquiry that is unverified
  const inquiry = await Inquiry.findOne({
    email,
    isVerified: false,
  });

  if (!inquiry) {
    throw new Error("Inquiry not found. Please resubmit your inquiry details.");
  }

  // Verify the 4-digit OTP using otpService
  const isVerified = await otpService.verifyOTP(inquiry.phone, otp);

  if (!isVerified) {
    throw new Error("Invalid or expired OTP. Please request a new one.");
  }

  // Mark as verified and clear OTP fields if any
  inquiry.isVerified = true;
  await inquiry.save();

  await inquiry.save();

  // Send notification to admin
  await createAdminNotification({
    type: "inquiry_received",
    title: "New Property Inquiry",
    message: `${inquiry.name} has inquired about a property.`,
    recipientRole: "admin",
    metadata: {
      inquiryId: inquiry._id,
      propertyId: inquiry.propertyId,
      name: inquiry.name,
      email: inquiry.email,
    },
  });

  return inquiry;
};

/**
 * Service to fetch all verified inquiries
 */
exports.getAllInquiries = async () => {
  return await Inquiry.find({ isVerified: true })
    .populate("propertyId", "title location price images")
    .sort({ createdAt: -1 });
};

/**
 * Service to update inquiry status
 */
exports.updateInquiryStatus = async (id, status) => {
  const inquiry = await Inquiry.findByIdAndUpdate(
    id,
    { status },
    { new: true, runValidators: true },
  ).populate("propertyId", "title");

  if (!inquiry) {
    throw new Error("Inquiry not found");
  }

  return inquiry;
};
