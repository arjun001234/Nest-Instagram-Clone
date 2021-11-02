export default () => ({
    Redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
    },
    Cloudinary: {
        cloud_name: process.env.CLOUD_NAME,
        api_key: process.env.CLOUD_API_KEY,
        api_secret: process.env.CLOUD_API_SECRET,
    },
    Jwt_Secret: process.env.JWT_SECRET
})