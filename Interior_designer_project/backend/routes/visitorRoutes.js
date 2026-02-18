const express = require("express");
const router = express.Router();
const Visitor = require("../models/Visitor");

// @route   POST api/visitor
// @desc    Log visitor activity
// @access  Public
router.post("/", async (req, res) => {
    try {
        const { page, userAgent, referrer, browser, platform, language, screenResolution, source, device } = req.body;

        const newVisitor = new Visitor({
            page,
            userAgent,
            referrer,
            browser,
            platform,
            language,
            screenResolution,
            source,
            device
        });

        await newVisitor.save();
        res.status(201).json({ message: "Activity logged" });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   GET api/visitor/stats
// @desc    Get visitor stats for admin
// @access  Public (Should be private in production)
router.get("/stats", async (req, res) => {
    try {
        const stats = await Visitor.aggregate([
            {
                $group: {
                    _id: "$page",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
        res.json(stats);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   GET api/visitor/sources
// @desc    Get traffic sources
// @access  Public (Should be private in production)
router.get("/sources", async (req, res) => {
    try {
        const sources = await Visitor.aggregate([
            {
                $group: {
                    _id: "$source",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
        res.json(sources);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   GET api/visitor/devices
// @desc    Get device statistics
// @access  Public
router.get("/devices", async (req, res) => {
    try {
        const devices = await Visitor.aggregate([
            {
                $group: {
                    _id: "$device",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
        res.json(devices);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

// @route   GET api/visitor/browsers
// @desc    Get browser statistics
// @access  Public (Should be private in production)
router.get("/browsers", async (req, res) => {
    try {
        const browsers = await Visitor.aggregate([
            {
                $group: {
                    _id: "$browser",
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
        res.json(browsers);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Server Error");
    }
});

module.exports = router;
