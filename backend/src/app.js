const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const bidRoutes = require("./routes/bidRoutes");
const userRoutes = require("./routes/userRoutes");
const errorHandler = require("./middleware/errorHandler");

const app = express();

app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://bytecargo-one.vercel.app",
    "https://bytecargo-agtnesl05-mrinal444s-projects.vercel.app"
  ],
  credentials: true
}));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("ByteCargo API is running 🚚");
});

app.get("/health", (req, res) => {
  res.json({ ok: true });
});

app.use(authRoutes);
app.use(bidRoutes);
app.use(userRoutes);

app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

app.use(errorHandler);

module.exports = app;