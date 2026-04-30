const prisma = require("../config/prisma");
const { BidStatus, Roles, SubmissionStatus } = require("../constants/enums");
const { safeUserSelect } = require("../constants/selects");
const createHttpError = require("../utils/httpError");
const {
  isNonEmptyString,
  parsePositiveInteger,
  parsePositiveNumber,
} = require("../utils/validation");

const bidDetailsInclude = {
  merchant: {
    select: safeUserSelect,
  },
  submissions: {
    orderBy: { createdAt: "desc" },
    include: {
      transporter: {
        select: safeUserSelect,
      },
    },
  },
};

const bidSummaryInclude = {
  merchant: {
    select: safeUserSelect,
  },
  _count: {
    select: {
      submissions: true,
    },
  },
};

async function createBid(req, res) {
  if (req.user.role !== Roles.MERCHANT) {
    throw createHttpError(403, "Only merchants can create bids");
  }

  const { title, origin, destination, price } = req.body;

  if (!isNonEmptyString(title) || !isNonEmptyString(origin) || !isNonEmptyString(destination)) {
    throw createHttpError(400, "title, origin, and destination are required");
  }

  const parsedPrice = parsePositiveNumber(price);

  if (parsedPrice === null) {
    throw createHttpError(400, "price must be a positive number");
  }

  const bid = await prisma.bid.create({
    data: {
      title: title.trim(),
      origin: origin.trim(),
      destination: destination.trim(),
      price: parsedPrice,
      status: BidStatus.OPEN,
      merchantId: req.user.userId,
    },
    include: bidDetailsInclude,
  });

  return res.status(201).json(bid);
}

async function listOpenBids(req, res) {
  const bids = await prisma.bid.findMany({
    where: { status: BidStatus.OPEN },
    orderBy: { createdAt: "desc" },
    include: bidSummaryInclude,
  });

  return res.json(bids);
}

async function getBidById(req, res) {
  const bidId = Number(req.params.id);

  if (!Number.isInteger(bidId) || bidId <= 0) {
    throw createHttpError(400, "Invalid bid id");
  }

  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
    include: bidDetailsInclude,
  });

  if (!bid) {
    throw createHttpError(404, "Bid not found");
  }

  return res.json(bid);
}

async function getMyBids(req, res) {
  if (req.user.role !== Roles.MERCHANT) {
    throw createHttpError(403, "Only merchants can view their bids");
  }

  const bids = await prisma.bid.findMany({
    where: { merchantId: req.user.userId },
    orderBy: { createdAt: "desc" },
    include: bidDetailsInclude,
  });

  return res.json(bids);
}

async function getMySubmissions(req, res) {
  if (req.user.role !== Roles.TRANSPORTER) {
    throw createHttpError(403, "Only transporters can view their submissions");
  }

  const submissions = await prisma.bidSubmission.findMany({
    where: { transporterId: req.user.userId },
    orderBy: { createdAt: "desc" },
    include: {
      bid: {
        include: {
          merchant: {
            select: safeUserSelect,
          },
        },
      },
      transporter: {
        select: safeUserSelect,
      },
    },
  });

  return res.json(submissions);
}

async function submitBid(req, res) {
  if (req.user.role !== Roles.TRANSPORTER) {
    throw createHttpError(403, "Only transporters can submit bids");
  }

  const bidId = Number(req.params.bidId);

  if (!Number.isInteger(bidId) || bidId <= 0) {
    throw createHttpError(400, "Invalid bid id");
  }

  const { price, estimatedTime } = req.body;
  const parsedPrice = parsePositiveNumber(price);
  const parsedEstimatedTime = parsePositiveInteger(estimatedTime);

  if (parsedPrice === null) {
    throw createHttpError(400, "price must be a positive number");
  }

  if (parsedEstimatedTime === null) {
    throw createHttpError(400, "estimatedTime must be a positive integer");
  }

  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
  });

  if (!bid) {
    throw createHttpError(404, "Bid not found");
  }

  if (bid.status !== BidStatus.OPEN) {
    throw createHttpError(400, "This bid is no longer open");
  }

  const submission = await prisma.bidSubmission.create({
    data: {
      price: parsedPrice,
      estimatedTime: parsedEstimatedTime,
      transporterId: req.user.userId,
      bidId,
      status: SubmissionStatus.PENDING,
    },
    include: {
      bid: {
        include: {
          merchant: {
            select: safeUserSelect,
          },
        },
      },
      transporter: {
        select: safeUserSelect,
      },
    },
  });

  return res.status(201).json(submission);
}

async function listBidSubmissions(req, res) {
  const bidId = Number(req.params.bidId);

  if (!Number.isInteger(bidId) || bidId <= 0) {
    throw createHttpError(400, "Invalid bid id");
  }

  const submissions = await prisma.bidSubmission.findMany({
    where: { bidId },
    orderBy: { createdAt: "desc" },
    include: {
      transporter: {
        select: safeUserSelect,
      },
    },
  });

  return res.json(submissions);
}

async function selectSubmission(req, res) {
  if (req.user.role !== Roles.MERCHANT) {
    throw createHttpError(403, "Only merchants can accept submissions");
  }

  const bidId = Number(req.params.bidId);
  const submissionId = Number(req.params.submissionId);

  if (!Number.isInteger(bidId) || bidId <= 0 || !Number.isInteger(submissionId) || submissionId <= 0) {
    throw createHttpError(400, "Invalid bid or submission id");
  }

  const bid = await prisma.bid.findUnique({
    where: { id: bidId },
  });

  if (!bid) {
    throw createHttpError(404, "Bid not found");
  }

  if (bid.merchantId !== req.user.userId) {
    throw createHttpError(403, "You can only accept submissions for your own bids");
  }

  if (bid.status !== BidStatus.OPEN) {
    throw createHttpError(400, "This bid has already been assigned");
  }

  const selectedSubmission = await prisma.bidSubmission.findFirst({
    where: {
      id: submissionId,
      bidId,
    },
  });

  if (!selectedSubmission) {
    throw createHttpError(404, "Submission not found for this bid");
  }

  const result = await prisma.$transaction(async (tx) => {
    await tx.bidSubmission.updateMany({
      where: {
        bidId,
        id: {
          not: submissionId,
        },
      },
      data: {
        status: SubmissionStatus.REJECTED,
      },
    });

    const acceptedSubmission = await tx.bidSubmission.update({
      where: { id: submissionId },
      data: {
        status: SubmissionStatus.ACCEPTED,
      },
      include: {
        transporter: {
          select: safeUserSelect,
        },
      },
    });

    await tx.bid.update({
      where: { id: bidId },
      data: {
        status: BidStatus.ASSIGNED,
      },
    });

    return acceptedSubmission;
  });

  return res.json({
    message: "Submission accepted and bid assigned",
    submission: result,
  });
}

module.exports = {
  createBid,
  listOpenBids,
  getBidById,
  getMyBids,
  getMySubmissions,
  submitBid,
  listBidSubmissions,
  selectSubmission,
};