const express = require('express');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const morgan = require('morgan');
const errorHandler = require('./middleware/error');
const cookieParser = require("cookie-parser");

// Secure the API
const mongoSanitize = require("express-mongo-sanitize");
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimit = require("express-rate-limit");
const hpp = require("hpp");

// Load the config file
dotenv.config({path: "./config/config.env"});

// Connect to the database
connectDB();

const app = express();

// Body parser
app.use(express.json());
app.use(express.urlencoded({extended: false}));

// Cookie Parser
app.use(cookieParser())

// Secure the API
app.use(mongoSanitize())
app.use(helmet())
app.use(xss())
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    max: 1000
})
app.use(limiter)
app.use(hpp())

// Routes
app.use("/api/rooms", require("./routes/roomsRoutes"));
app.use("/api/users", require("./routes/usersRoutes"));
app.use("/api/reviews", require("./routes/reviewsRoutes"));
app.use("/api/reservations", require("./routes/reservationsRoutes"));

// Dev logging middleware
if(process.env.NODE_ENV === 'development')
    app.use(morgan('dev'));

// Error Middleware
app.use(errorHandler)

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, console.log(`Server started on port ${PORT}`));

// Handle unhandled promise rejections
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`)
    // Close server and exit process
    server.close(() => {
        process.exit(1);
    })
})