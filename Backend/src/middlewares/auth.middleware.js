
import { JWT } from "../utils/jwt.js"

export const protect = async (req, res, next) => {
  try {
    const authHeaders = req.headers.authorization
    
    if(!authHeaders) {
      res.status(404).json({
        message: "authorization headers not found"
      });
    }
    
    const accessToken = authHeaders.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }

    const decoded = await JWT.verifyAccessToken(accessToken);

    req.user = decoded;

    next();
  } catch (error) {
    return res.status(401).json({
      message: error.message || "Invalid token",
    });
  }
};


export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    if (
      !req.user.role ||
      !roles.includes(req.user.role)
    ) {
      return res.status(403).json({
        message: "Forbidden: insufficient permission",
      });
    }

    next();
  };
};