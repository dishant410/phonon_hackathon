const logger = require('../utils/logger');

const requestLogger = (req, res, next) => {
  const start = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - start;
    const log = `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms | IP: ${req.ip} | User: ${req.user?._id || 'anonymous'}`;

    if (res.statusCode >= 500) {
      logger.error(log);
    } else if (res.statusCode >= 400) {
      logger.warn(log);
    } else {
      logger.info(log);
    }
  });

  next();
};

module.exports = { requestLogger };
