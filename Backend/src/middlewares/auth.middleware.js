import { JWT } from "../utils/jwt.js";

export const protect = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    // 1. Safely check if the header exists and starts with "Bearer "
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Not authorized, no token provided",
      });
    }

    // 2. Now it is completely safe to split
    const accessToken = authHeader.split(" ")[1];

    if (!accessToken) {
      return res.status(401).json({
        message: "Not authorized, token format invalid",
      });
    }

    // 3. Verify the token signature
    const decoded = await JWT.verifyAccessToken(accessToken);

    // 4. Attach token payload metadata safely to the request state
    req.user = decoded;

    next();
  } catch (error) {
    console.error("🔒 Auth Middleware Verification Crash:", error.message);
    return res.status(401).json({
      message: "Not authorized, token verification failed",
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