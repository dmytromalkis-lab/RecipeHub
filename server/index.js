import express from "express";
import helmet from "helmet";
import dotenv from "dotenv";
import cors from "cors";
import passport from "passport";
import router from "./routes/index.js";
import sequelize from "./configs/db.js";
import models from "./models/index.js";
import "./configs/passport.js"; // Імпортуємо конфігурацію Passport
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(passport.initialize());

// Routes
app.use("/api", router);

const startServer = async () => {
  try {
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
};

startServer();
