const authenticateAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    return res.status(403).json({ message: "Forbidden" });
  }
};

module.exports = {
  authenticateAdmin,
};
