const prisma = require("../config/prisma");
const { safeUserSelect } = require("../constants/selects");

async function listUsers(req, res) {
  const users = await prisma.user.findMany({
    select: safeUserSelect,
    orderBy: { id: "asc" },
  });

  return res.json(users);
}

module.exports = {
  listUsers,
};