const auth = require("./middleware/auth");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const express = require("express");
const cors = require("cors");
require("dotenv").config();

const { PrismaClient } = require("@prisma/client");
const { Pool } = require("pg");
const { PrismaPg } = require("@prisma/adapter-pg");

const app = express();
app.use(cors());
app.use(express.json());

// 🔥 New Prisma 7 connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
  adapter,
});
// 🚛 Transporter submits offer on a delivery request
app.post("/bids/:bidId/submit", auth, async (req, res) => {
  try {
    const bidId = parseInt(req.params.bidId);
    const { price, estimatedTime } = req.body;

    const submission = await prisma.bidSubmission.create({
      data: {
        price,
        estimatedTime,
        bidId,
        transporterId: req.user.userId,
      },
    });

    res.json(submission);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
// 📊 View all transporter submissions for a delivery request
app.get("/bids/:bidId/submissions", async (req, res) => {
  const bidId = parseInt(req.params.bidId);

  const submissions = await prisma.bidSubmission.findMany({
    where: { bidId },
    include: { transporter: true },
  });

  res.json(submissions);
});
app.get("/", (req, res) => {
  res.send("ByteCargo API is running 🚚");
});

/* CREATE USER */
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
  return res.status(400).json({ error: "All fields are required" });
}
    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user)
      return res.status(400).json({ error: "User not found" });

    const match = await bcrypt.compare(password, user.password);

    if (!match)
      return res.status(400).json({ error: "Invalid password" });

    // create token
    const token = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.json({ token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
app.get("/profile", auth, async (req, res) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
    });

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
/* GET USERS */
app.get("/users", async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(3000, () => console.log("Server running on port 3000"));