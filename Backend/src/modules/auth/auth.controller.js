import { AuthService } from "./auth.service.js";
import { Env } from "../../configs/env.js"
import { Cookie } from "../../utils/cookies.js"
import logger from "../../utils/logger.js"

// REGISTER
const register = async (req, res) => {
  try {
    const {
      user,
      accessToken,
      refreshToken
    } = await AuthService.register(req.body);
    
    await Cookie.setRefreshToken(res, refreshToken)

    return res.status(201).json({
      message: "User registered successfully",
      user,
      accessToken
    });

  } catch (error) {
    logger.error("Error registering user:", error);

    return res.status(400).json({
      message: error.message
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
    await AuthService.logout(req.user)
    
    await Cookie.clearRefreshToken(res)
  
    return res.status(200).json({
      message: "Logged out successfully"
    });
  }catch(err){
    logger.error("Logout error:", err.message);
    return res.status(500).json({
      message: err.message || "server error"
    })
  }
};


// GET ME / CURRENT USER
const getMe = async (req, res) => {
  try {
    console.log(req.user)
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

export const AuthController = {
  register,
  login,
  logout,
  getMe
}