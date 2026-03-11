require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");
const {
    connectRedis
} = require("./config/redisClient")

const checkDbConnection = require("./config/dbConnect");
const routeNotFoundhandler = require("./middlewares/routeNotFoundHandler");
const errorHandler = require("./middlewares/errorHandler");
const otpRouter = require("./routes/otpRoutes");
const authRouter = require("./routes/authRoutes");

const app = express();

const ALLOWED_ORIGINS = [
    "http://localhost:5173"
];

app.use(express.json());
app.use(morgan("dev"));
app.use(helmet());

app.use(cors({
    origin: (origin, callback) => {
        if (!origin || ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(cookieParser());

app.get("/", (req, res) => {
    res.json({
        message: "MESSAGE"
    });
});

app.use("/otp", otpRouter);
app.use("/auth", authRouter);

app.use(routeNotFoundhandler);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;

(async () => {
    try {
        console.log("🚀 Starting server...");
        checkDbConnection();
        await connectRedis();
        app.listen(PORT, () => {
            console.log(`🚀 Server running on port ${PORT}`);
        });
    } catch (error) {
        console.log(`Failed to start server: ${error}`)
    }
})()