import { UsersService } from "./users.service.js";
import logger from "../../utils/logger.js";

// USER PROFILE 
const getUserProfile = async(req, res) => {
  try{
    const profileInfo = 
      await UsersService.getUserProfile(req.user);
      
      res.status(200).json({
        success: true,
        data: profileInfo,
      });
  }catch(err){
    logger.error(`Error getting user profile: ${err.message}`);
    res.status(400).json({
      message: err.message
    });
  }
};

// UPDATE 
const updateUserProfile = async (req, res) => {
  try {
    const updated = await UsersService.updateUserProfile({
      bodyData: req.body,
      userId: req.user.userId,
      avatarBuffer: req.file?.buffer,
    });

    return res.status(200).json({
      message: "User profile updated successfully",
      user: updated
    });

  } catch (error) {
    logger.error(`Profile update error: ${error.message}`);

    return res.status(400).json({
      message: error.message || "Failed to update user"
    });
  }
};

// SAVE EXPO TOKEN 
const savePushToken = async(req, res) => {
  try{
    const notification = await UsersService.savePushToken({
      userId: req.body.userId,
      token: req.body.token
    });
    res.status(200).json({
      message: "Expo push token saved successfully"
    });
  }catch(err){
    logger.error(`Error saving expo token: ${err.message}`);
    res.status(400).json({
      message: err.message
    });
  }
};

export const UsersController = {
  savePushToken,
  getUserProfile,
  updateUserProfile,
};