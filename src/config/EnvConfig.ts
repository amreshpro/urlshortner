const Env = Bun.env || process.env;

export default {
  NODE_ENV: Env.NODE_ENV,
  PORT: Env.PORT || 4000,
  DATABASE_URL: Env.DATABASE_URL,
  JWT_SECRET: Env.JWT_SECRET,
};
