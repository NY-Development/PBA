import { AuthService } from "./auth.service.js";
import { Cookie } from "../../utils/cookies.js";
import logger from "../../utils/logger.js";


// REGISTER
const register = async (req, res) => {
  try {
    await AuthService.register(req.body);

    return res.status(200).json({
      message: "OTP sent to your email",
    });

  } catch (error) {
    logger.error(
      "Error registering user:",
      error
    );

    return res.status(400).json({
      message: error.message,
    });
  }
};

// EMAIL VERIFICATION 
const verifyEmail = async (req, res) => {
  try {
    const {
      user,
      accessToken,
      refreshToken,
    } = await AuthService.verifyEmail(
      req.body
    );

    await Cookie.setRefreshToken(
      res,
      refreshToken
    );

    return res.status(201).json({
      message:
        "Email verified successfully",
      user,
      accessToken,
    });

  } catch (error) {
    logger.error(
      "Verify email error:",
      error.message
    );

    return res.status(400).json({
      message: error.message,
    });
  }
};

// LOGIN
const login = async (req, res) => {
  try {
    const { 
      user, 
      accessToken,
      refreshToken
    } = await AuthService.login(req.body);

    await Cookie.setRefreshToken(res, refreshToken);
    
    return res.status(200).json({
      message: "Login successful",
      accessToken,
      user,
    });

  } catch (error) {
    logger.error("Login error:", error.message);

    return res.status(401).json({
      message: error.message
    });
  }
};

// LOGOUT
const logout = async(req, res) => {
  try{
    await AuthService.logout(req.user);
    
    await Cookie.clearRefreshToken(res);
  
    return res.status(200).json({
      message: "Logged out successfully"
    });
  }catch(err){
    logger.error("Logout error:", err.message);
    return res.status(500).json({
      message: err.message || "server error"
    });
  }
};

// LOGOUT ALL
const logoutAll = async(req, res) => {
  try{
    await AuthService.logout(req.user);
    
    await Cookie.clearRefreshToken(res);
  
    return res.status(200).json({
      message: "All sessions deleted successfully"
    });
  }catch(err){
    logger.error("Error logging all out:", err.message);
    return res.status(500).json({
      message: err.message || "server error"
    });
  }
};

// GET ME
const getMe = async (req, res) => {
  try {
    const user = await AuthService.getMe(req.user.userId);
    
    return res.status(200).json({
      authenticated: true,
      user
    });

  } catch (err) {
    logger.error("Get user error:", err.message);

    return res.status(500).json({
      message: err.message
    });
  }
};

// REFRESH 
const refresh = async (req, res) => {
  try {
    const { newAccessToken } = 
      await AuthService.refresh(req.cookies.refreshToken, req.user);
    
    return res.status(200).json({
      message: "Token refreshed successfully",
      newAccessToken
    });

  } catch (err) {
    logger.error("Refresh error:", err.message);

    return res.status(500).json({
      message: err.message
    });
  }
};

// UPDATE 
const update = async (req, res) => {
  try {
    const updatedUser = await AuthService.updateUser({
      bodyData: req.body,
      userId: req.user.userId,
      avatar_buffer: req.file?.buffer,
    });

    return res.status(200).json({
      message: "User updated successfully",
      user: updatedUser
    });

  } catch (error) {
    logger.error("Update user error:", error.message);

    return res.status(400).json({
      message: error.message || "Failed to update user"
    });
  }
};

// FORGOT PASSWORD 
const forgotPassword = async(req, res) => {
  try{
    await AuthService.forgotPassword(req.body);
    
    res.status(200).json({
      message: "Password reset code sent to your email"
    });
    
  }catch(err){
    logger.error("Password reset error:", err.message);
    res.status(500).json({
      message: err.message
    });
  }
};

// RESET PASSWORD 
const resetPassword = async(req, res) => {
  try{
    await AuthService.resetPassword(req.body);
    
    res.status(200).json({
      message: "Password reset successfully"
    });
  }catch(err){
    logger.error("Password reset failed:", err.message);
    res.status(500).json({
      message: err.message
    });
  }
};

// RESEND OTP
const resendOTP = async(req, res) => {
  try{
    await AuthService.resendOTP(req.body);
    
    res.status(200).json({
      message: "OTP sent to your email"
    });
  }catch(err){
    logger.error("Resending OTP error:", err.message);
    res.status(500).json({
      message: err.message
    });
  }
};




export const AuthController = {
  register,
  login,
  logout,
  refresh,
  update,
  getMe,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendOTP,
  logoutAll,
}