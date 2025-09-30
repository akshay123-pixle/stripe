import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import paymentRoutes from "./routes/payment.routes.js";
import webhookRoutes from './routes/webhook.routes.js';
dotenv.config();

const app = express();
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use('/stripe', webhookRoutes);
app.use(express.json());
app.use(cookieParser());

app.use("/api/payment", paymentRoutes);
app.use("/", (req, res) => {
 res.send('<h1>Backend is working fine !!</h1>')
});

app.listen(process.env.PORT || 3000, async () => {
  console.log(`server running at the port :${process.env.PORT || 3000}`);
});
