const auth = (req, res, next) => {
    if (!req.session.user) {
      res.status(403).render("notLogin");
      return;
    }
    next();
  };
  
  module.exports = { auth };