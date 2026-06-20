import { AuthService } from "./auth.service.js";
import { Cookie } from "../../utils/cookies.js";
import logger from "../../utils/logger.js";


// REGISTER CUSTOMER 
const registerCustomer = async (req, res) => {
  try {
    await AuthService.registerCustomer(req.body);

    return res.status(200).json({
      message: "OTP sent to your email",
    });

  } catch (error) {
    logger.error(`Error registering customer: ${error.message}`);

    return res.status(400).json({
      message: error.message,
    });
  }
};

// REGISTER VENDOR 
const registerVendor = async (req, res) => {
  try {
    const vendor = await VendorsService.register({
      userId: req.user.userId, 
      bodyData: req.body,
      logo_buffer: req.files?.logo?.[0]?.buffer,
      banner_buffer: req.files?.banner?.[0]?.buffer,
      license_buffer: req.files?.license?.[0]?.buffer,
    });

    return res.status(200).json({
      message: "OTP sent to your email",
      vendor
    });

  } catch (error) {
    logger.error("Error registering vendor:", error);

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
        "Email verified, user registered successfully",
      user,
      accessToken,
    });

  } catch (error) {
    logger.error(`Email verification error: ${error.message}`);

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
    logger.error(`Login error: ${error.message}`);

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
      message: "Logged out/revoked successfully"
    });
  }catch(error){
    logger.error(`Logout error: ${error.message}`);
    return res.status(500).json({
      message: error.message || "server error"
    });
  }
};

// LOGOUT ALL
const logoutAll = async(req, res) => {
  try{
    await AuthService.logoutAll(req.user);
    
    await Cookie.clearRefreshToken(res);
  
    return res.status(200).json({
      message: "All sessions revoked successfully"
    });
  }catch(error){
    logger.error(`Logout all error: ${error.message}`);
    return res.status(500).json({
      message: error.message || "server error"
    });
  }
};

// GET ME
const getMe = async (req, res) => {
  try {
    const user = await AuthService.getMe(req.user);
    
    return res.status(200).json({
      authenticated: true,
      user
    });

  } catch (error) {
    logger.error(`Get me error: ${error.message}`);

    return res.status(500).json({
      message: error.message
    });
  }
};

// REFRESH 
const refresh = async (req, res) => {
  try {
    const { newAccessToken } = 
      await AuthService.refresh({
        oldRefreshToken: req.cookies.refreshToken, 
        userId: req.user.userId,
        session_id: req.user.session_id,
      });
    
    return res.status(200).json({
      message: "Token refreshed successfully",
      newAccessToken
    });

  } catch (error) {
    logger.error(`Refresh error: ${error.message}`);

    return res.status(500).json({
      message: error.message
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
    
  }catch(error){
    logger.error(`Pwd reset error: ${error.message}`);
    res.status(500).json({
      message: error.message
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
  }catch(error){
    logger.error(`pwd reset error: ${error.message}`);
    res.status(500).json({
      message: error.message
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
  }catch(error){
    logger.error(`otp resend error: ${error.message}`);
    res.status(500).json({
      message: error.message
    });
  }
};




export const AuthController = {
  registerCustomer,
  registerVendor,
  login,
  logout,
  refresh,
  getMe,
  verifyEmail,
  forgotPassword,
  resetPassword,
  resendOTP,
  logoutAll,
};