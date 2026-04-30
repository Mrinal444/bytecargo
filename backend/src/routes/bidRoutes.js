const express = require("express");

const auth = require("../middleware/auth");
const requireRole = require("../middleware/requireRole");
const asyncHandler = require("../utils/asyncHandler");
const bidController = require("../controllers/bidController");
const { Roles } = require("../constants/enums");

const router = express.Router();

router.get("/bids", asyncHandler(bidController.listOpenBids));
router.get("/bids/:id", asyncHandler(bidController.getBidById));
router.get("/bids/:bidId/submissions", asyncHandler(bidController.listBidSubmissions));
router.post("/bids", auth, requireRole(Roles.MERCHANT), asyncHandler(bidController.createBid));
router.get("/my-bids", auth, requireRole(Roles.MERCHANT), asyncHandler(bidController.getMyBids));
router.get("/my-submissions", auth, requireRole(Roles.TRANSPORTER), asyncHandler(bidController.getMySubmissions));
router.post("/bids/:bidId/submit", auth, requireRole(Roles.TRANSPORTER), asyncHandler(bidController.submitBid));
router.post("/bids/:bidId/select/:submissionId", auth, requireRole(Roles.MERCHANT), asyncHandler(bidController.selectSubmission));

module.exports = router;