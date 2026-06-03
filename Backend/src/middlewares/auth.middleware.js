
import { JWT } from "../utils/jwt.js"

export const protect = async (req, res, next) => {
  try {
    const accessToken = req.headers.authorization.split(" ")[1];
    
    console.log("The access token is:", accessToken)

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