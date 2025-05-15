import express from "express";
import cors from "cors";
import session from "express-session";
import passport from "passport";
import { configurePassport } from "./Config/passport.config.js";
import { DataBaseConnect } from "./Config/database.config.js";
import { authRouters } from "./Routes/auth_user.routes.js";
// ... other imports ...

const app = express();

// Configure passport strategies first
configurePassport();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use(cookieParser());

// CORS configuration
const corsOptions = {
  origin: "http://localhost:3000", // Frontend URL
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  exposedHeaders: ["set-cookie"],
};

app.use(cors(corsOptions));

// Session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET || "your-secret-key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      sameSite: "lax",
      httpOnly: true,
    },
  })
);

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/auth", authRouters);
// ... other routes ...

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: err.message || "Something went wrong!",
  });
});

// Connect to database
DataBaseConnect();

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// ... rest of your app configuration ... 