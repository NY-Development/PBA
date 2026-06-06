import logger from "../utils/logger.js";
export const validate = (schema) => (
  req, 
  res, 
  next) => {
    
  const result = schema.safeParse(req.body);

  if (!result.success) {
    logger.error(`${result.error}`)
    return res.status(400).json({
      message: "Validation failed",
      errors: result.error.format(),
    });
  }

  req.body = result.data;

  next();
};