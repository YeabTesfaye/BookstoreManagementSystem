const errorHandler = (err, req, res, next) => {
  const statusCode = res.statusCode ? res.statusCode : 500;

  res.status(statusCode);
  res.json({
    msg: err.message,
    stack: process.env.NODE_ENV === "production" ? null : err.stack,
  });
};


module.exports = {
    errorHandler
}



function authenticateUser(req, res, next) {
  // Extract the JWT token from the request headers
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  // If no token is found, return an error response
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    // Verify the token and extract the user ID from the payload
    const decodedToken = jwt.verify(token, JWT_SECRET);
    const userId = decodedToken.userId;

    // Add the user ID to the request object
    req.userId = userId;

    // Call the next middleware or route handler
    next();
  } catch (error) {
    // If the token is invalid, return an error response
    return res.status(401).json({ message: "Unauthorized" });
  }
}













