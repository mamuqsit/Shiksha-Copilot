const express = require("express");
const router = express.Router();

router.get("/", (req, res) => res.send("Shikshana Backend!"));

router.get("/health", (req, res) => res.json({
	status: "healthy",
	build: process.env.BUILD || null,
}));

module.exports = router;