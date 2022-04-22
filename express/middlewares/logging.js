const logging = (req, res, next) => {
    console.log(
      `[${new Date().toUTCString()}]: ${req.method} ${req.originalUrl} (${
        req.session.user ? "Authenticated User" : "Non-Authenticated User"
      })`
    );
    next();
  };
  
  module.exports = { logging };