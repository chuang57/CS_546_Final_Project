const apartmentRoutes = require('./apartment');
const reviewsRoutes = require('./reviews');

const constructorMethod = (app) => {
  app.use('/', apartmentRoutes);
 // app.use('/reviews', reviewsRoutes);

  app.use('*', (req, res) => {
    res.status(404).json({error: 'Not found'});
  });
};

module.exports = constructorMethod;