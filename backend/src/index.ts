import "dotenv/config";
import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import resourceRoutes from "./routes/resources";
import analyticsRoutes from "./routes/analytics";
import userRoutes from "./routes/users";


const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/resources", resourceRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/users", userRoutes);

const port = parseInt(process.env.PORT || "4000");
app.listen(port, () => console.log(`API running on http://localhost:${port}`));
