const express = require("express");
const router = express.Router();
const {
  getAllTags,
  getTagsByCategory,
  createTags,
  incrementTagUsage,
  getPopularTags,
  getTagSuggestions,
  getTagStats
} = require("../controllers/TagController");

// Get all tags with optional filtering
router.get("/", getAllTags);

// Get tags by category with pagination
router.get("/category/:category", getTagsByCategory);

// Create multiple tags
router.post("/", createTags);

// Increment tag usage
router.post("/increment", incrementTagUsage);

// Get popular tags
router.get("/popular", getPopularTags);

// Get tag suggestions
router.get("/suggestions", getTagSuggestions);

// Get tag statistics
router.get("/stats", getTagStats);

module.exports = router; 