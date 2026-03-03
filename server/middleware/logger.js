const winston = require('winston');
const morgan = require('morgan');

// Define log levels and colors
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

const level = () => {
  const env = process.env.NODE_ENV || 'development';
  return env === 'development' ? 'debug' : 'info';
};

const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

winston.addColors(colors);

// Create the logger instance
const logger = winston.createLogger({
  level: level(),
  levels,
  format: winston.format.combine(
    winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss:ms' }),
    winston.format.colorize({ all: true }),
    winston.format.printf(
      (info) => `${info.timestamp} ${info.level}: ${info.message}`,
    ),
  ),
  transports: [
    new winston.transports.Console(),
  ],
});

// Create a stream object with a 'write' function that will be used by `morgan`
const stream = {
  write: (message) => logger.http(message.trim()),
};

// Middleware function to use morgan with winston
const morganMiddleware = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  { stream },
);

// Export the logger instance directly, but also attach the middleware
logger.middleware = morganMiddleware;

module.exports = logger;
