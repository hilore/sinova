export default () => ({
  port: parseInt(process.env.BACKEND_PORT, 10) || 4000,
  database: {
    host: process.env.MONGO_HOST,
    port: parseInt(process.env.MONGO_PORT, 10) || 6969,
    name: process.env.MONGO_DB,
  },
  rateLimit: {
    number: parseInt(process.env.API_RATE_LIMIT_NUMBER, 10) || 10,
    time: parseInt(process.env.API_RATE_LIMIT_TIME, 10) || 60,
  }
});
