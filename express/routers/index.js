const citysRoutes = require("./city");

const constructorMethod = (app) => {
  app.use("/citys", citysRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

module.exports = constructorMethod;