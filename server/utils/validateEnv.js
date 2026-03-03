const { cleanEnv, str, port, url } = require('envalid');

const validateEnv = () => {
  cleanEnv(process.env, {
    NODE_ENV: str({ choices: ['development', 'test', 'production'] }),
    PORT: port(),
    DATABASE_URL: url(),
    JWT_SECRET: str(),
    PGUSER: str(),
    PGPASSWORD: str(),
    PGHOST: str(),
    PGPORT: port(),
    PGDATABASE: str(),
    CLIENT_ORIGIN: str({ default: 'http://localhost:5173' }),
    AI_SERVICE_URL: url({ default: 'http://flask:6000' }),
  });
};

module.exports = validateEnv;
