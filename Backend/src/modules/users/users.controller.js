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

export const UsersController = {
  savePushToken,
};