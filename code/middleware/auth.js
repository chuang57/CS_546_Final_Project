const isLogin = (req, res, next) => {
  console.log("login check")
  if (!req.session.user) {
    return res.redirect("/login");
  }
  next();
};

module.exports = { isLogin };
