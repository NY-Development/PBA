import { UsersService } from "./users.service.js";
import logger from "../../utils/logger.js";


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
    });

    return res.status(200).json({
      message: "User profile updated successfully",
      user: updated
    });

  } catch (err) {
    logger.error(`Profile update error: ${err.message}`);

    return res.status(400).json({
      message: err.message || "Failed to update user"
    });
  }
};

// UPLOAD AVATAR
const uploadAvatar = async(req, res) => {
  try{
    const {
      avatarUrl,
      avatarPublicId
    } = await UsersService.uploadAvatar({
      userId: req.user.userId,
      avatarBuffer: req.file?.buffer,
    });
    
    res.status(200).json({
      message: "Avatar uploaded successfully",
      avatarUrl,
      avatarPublicId
    });
    
  }catch(err){
    logger.error(`Error uploading avatar: ${err.message}`);
    
    res.status(400).json({
      message: err.message
    });
  }
};

// GET ADDRESSES 
const getAddresses = async(req, res) => {
  try{
    const addresses = await UsersService.getAddresses(
      req.user.userId
    );
    
    res.status(200).json({
      success: true,
      addresses
    });
  }catch(err){
    logger.error(`Error getting addresses: ${err.message}`);
    
    res.status(500).json({
      message: err.message
    });
  }
};

// CREATE ADDRESSES 
const createAddresses = async(req, res) => {
  try{
    const newAddresses = await UsersService.createAddresses({
      userId: req.user.userId,
      body: req.body
    });
    
    res.status(200).json({
      success: true,
      addresses: newAddresses
    });
  }catch(err){
    logger.error(`Error creating addresses: ${err.message}`);
    
    res.status(500).json({
      message: err.message
    });
  }
};


export const UsersController = {
  savePushToken,
  getUserProfile,
  updateUserProfile,
  uploadAvatar,
  getAddresses,
  createAddresses,
};