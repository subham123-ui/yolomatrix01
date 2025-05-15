import cors from "cors";
import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { swaggerOptions } from "./Config/swagger.config.js";
import { DataBaseConnect } from './Config/database.config.js';
import { authRouters } from "./Routes/auth_user.routes.js";
import { appertmntRouters } from "./Routes/appartment.routes.js";
import { dashboardRouters } from "./Routes/dashboard.routes.js";
import { mansionRouters } from "./Routes/mansion.routes.js";
import { jetRouters } from "./Routes/jet.routes.js";
import { yachtRouters } from "./Routes/yacht.routes.js";
import { conciergeRouters } from "./Routes/concierge.routes.js";

const app = express();
const PORT = process.env.PORT || 4000;  // Set default port if not specified


//! ===================================================
app.use(cors({
  origin: process.env.FRONTEND_URL, // Allow only this origin
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//! ===================================================


// Swagger setup
const specs = swaggerJsdoc(swaggerOptions);
app.use("/docs", swaggerUi.serve, swaggerUi.setup(specs));

//! ===================================================
//? { MongoDB Connection }
DataBaseConnect();

//! ===================================================
//? { Server Routes Setup }
// Auth Routes
app.use("/auth", authRouters);

// Appartment Routes
app.use("/appartments", appertmntRouters);
app.use("/dashboard", dashboardRouters);
app.use("/mansions", mansionRouters);
app.use("/jets", jetRouters);
app.use("/yachts", yachtRouters);
app.use("/concierge", conciergeRouters);

//! ===================================================

app.get("/", (req, res) => {
  res.send("Hello from root!");
});

//! ===================================================
//? { Server PORT Initialize }
app.listen(PORT, () => {
  // server URL
  console.log(`Server is running on http://localhost:${PORT}`);
});
//! ===================================================  
