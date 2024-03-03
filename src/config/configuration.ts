export default () => ({
  port: process.env.PORT,
  database: {
    file: process.env.DATABASE_FILE,
    name: process.env.DATABASE_NAME
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT
  },
  imgur: {
    tokenUrl: process.env.IMGUR_TOKEN_URL,
    clientId: process.env.IMGUR_CLIENT_ID,
    clientSecret: process.env.IMGUR_CLIENT_SECRET,
    refreshToken: process.env.IMGUR_REFRESH_TOKEN,
    albumId: process.env.IMGUR_ALBUM_ID
  }
});