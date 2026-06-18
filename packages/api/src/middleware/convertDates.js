const ISO_DATE_REGEX = /^\d{4}-\d{2}-\d{2}(T\d{2}:\d{2}:\d{2})?/;

module.exports = function convertDates(req, res, next) {
  if (req.body && typeof req.body === 'object') {
    for (const key of Object.keys(req.body)) {
      if (typeof req.body[key] === 'string' && ISO_DATE_REGEX.test(req.body[key])) {
        req.body[key] = new Date(req.body[key]);
      }
    }
  }
  next();
};