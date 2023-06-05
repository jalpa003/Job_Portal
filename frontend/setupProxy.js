const cors = require('cors');

module.exports = function (app) {
  // Enable CORS for all origins
  app.use(cors());
};
