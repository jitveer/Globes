const authService = require("./auth.service");
const asyncHandler = require("../../shared/utils/asyncHandler.util");
const ApiResponse = require("../../shared/utils/ApiResponse.util");

exports.register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(new ApiResponse(201, result, "Registration successful"));
});

exports.login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.status(200).json(new ApiResponse(200, result, "Login successful"));
});

exports.superAdminLogin = asyncHandler(async (req, res) => {
  const result = await authService.superAdminLogin(req.body);
  res
    .status(200)
    .json(new ApiResponse(200, result, "Super Admin Login successful"));
});
exports.adminLogin = asyncHandler(async (req, res) => {
  const result = await authService.adminLogin(req.body);
  res
    .status(200)
    .json(new ApiResponse(200, result, "Administrator Login successful"));
});

exports.checkUser = asyncHandler(async (req, res) => {
  const { email, phone } = req.body;
  const exists = await authService.checkUserExists({ email, phone });
  if (exists) {
    return res.status(400).json({
      success: false,
      message: "User already exists with this email or phone"
    });
  }
  res.status(200).json(new ApiResponse(200, null, "User does not exist"));
});
