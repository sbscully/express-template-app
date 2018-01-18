const lodash = require('lodash');
const upload = require('./upload');

const assetsDomain = process.env.ASSETS_DOMAIN;

lodash.mixin({
  currency: (pence, decimals = 2) => `£${(pence / 100).toFixed(decimals)}`,
  percentage: (numerator, denominator, precision = 0) =>
    ((numerator / denominator) * 100).toFixed(precision),
  image: (path, options = {}) => {
    if (!assetsDomain) return path;
    const url = assetsDomain + path;

    return upload.proxy(url, options);
  },
  backgroundImage: (path, options = {}) =>
    // Use style attr so that background images can be hosted on cloudinary
    `style="background-image: linear-gradient(rgba(0, 0, 0, 0.4),rgba(0, 0, 0, 0.4)), url(${lodash.image(path, options)});"`,
  ip: (req) => {
    const xff = req.headers['x-forwarded-for'] || '';

    return xff.split(',').pop() ||
      req.connection.remoteAddress ||
      req.socket.remoteAddress ||
      req.connection.socket.remoteAddress;
  },
});

module.exports = lodash;
