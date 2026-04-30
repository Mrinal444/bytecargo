const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const prisma = require("../config/prisma");
const { safeUserSelect } = require("../constants/selects");
const createHttpError = require("../utils/httpError");
const {
  isNonEmptyString,
  isValidEmail,
  normalizeRole,
} = require("../utils/validation");

async function signup(req, res) {
  const { name, email, password, role } = req.body;

  if (!isNonEmptyString(name) || !isValidEmail(email) || !isNonEmptyString(password) || !isNonEmptyString(role)) {
    throw createHttpError(400, "name, email, password, and role are required");
  }

  if (password.trim().length < 6) {
    throw createHttpError(400, "Password must be at least 6 characters long");
  }

  const normalizedRole = normalizeRole(role);

  if (!normalizedRole) {
    throw createHttpError(400, "Role must be MERCHANT or TRANSPORTER");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: hashedPassword,
      role: normalizedRole,
    },
    select: safeUserSelect,
  });

  return res.status(201).json(user);
}

async function login(req, res) {
  const { email, password } = req.body;

  if (!isValidEmail(email) || !isNonEmptyString(password)) {
    throw createHttpError(400, "email and password are required");
  }

  const user = await prisma.user.findUnique({
    where: { email: email.trim().toLowerCase() },
  });

  if (!user) {
    throw createHttpError(400, "User not found");
  }

  const passwordMatches = await bcrypt.compare(password, user.password);

  if (!passwordMatches) {
    throw createHttpError(400, "Invalid password");
  }

  const token = jwt.sign(
    { userId: user.id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1d" }
  );

  return res.json({
    token,
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
}

async function profile(req, res) {
  const user = await prisma.user.findUnique({
    where: { id: req.user.userId },
    select: safeUserSelect,
  });

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  return res.json(user);
}

module.exports = {
  signup,
  login,
  profile,
};