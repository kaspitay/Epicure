const Tag = require("../models/TagModel");

// Get all tags with optional filtering
exports.getAllTags = async (req, res) => {
  try {
    const { category, popular, limit } = req.query;
    let query = {};

    if (category) {
      query.category = category;
    }

    if (popular === 'true') {
      query.isPopular = true;
    }

    const tags = await Tag.find(query)
      .sort({ category: 1, name: 1 })
      .limit(parseInt(limit) || 0);

    console.log("Returning tags from backend:", tags.length);
    res.status(200).json(tags);
  } catch (error) {
    console.error("Error fetching tags:", error);
    res.status(500).json({ error: "Failed to fetch tags" });
  }
};

// Get tags by category with pagination
exports.getTagsByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 20 } = req.query;

    const tags = await Tag.find({ category })
      .sort({ usageCount: -1, name: 1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Tag.countDocuments({ category });

    res.status(200).json({
      tags,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / limit)
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create multiple tags
exports.createTags = async (req, res) => {
  try {
    const { tags } = req.body;
    
    if (!Array.isArray(tags)) {
      return res.status(400).json({ message: "Tags must be an array" });
    }

    const createdTags = await Promise.all(
      tags.map(async (tag) => {
        const existingTag = await Tag.findOne({ name: tag.name });
        if (existingTag) {
          return existingTag;
        }
        return new Tag(tag).save();
      })
    );

    res.status(201).json(createdTags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update tag usage count
exports.incrementTagUsage = async (req, res) => {
  try {
    const { tagName } = req.body;
    const tag = await Tag.findOneAndUpdate(
      { name: tagName },
      { $inc: { usageCount: 1 } },
      { new: true }
    );

    // Update popularity status
    if (tag.usageCount >= 100) {
      await Tag.findByIdAndUpdate(tag._id, { isPopular: true });
    }

    res.status(200).json(tag);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get popular tags
exports.getPopularTags = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const tags = await Tag.find({ isPopular: true })
      .sort({ usageCount: -1 })
      .limit(parseInt(limit));

    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tag suggestions based on search term
exports.getTagSuggestions = async (req, res) => {
  try {
    const { searchTerm } = req.query;
    if (!searchTerm) {
      return res.status(400).json({ message: "Search term is required" });
    }

    const tags = await Tag.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } }
      ]
    })
    .sort({ usageCount: -1 })
    .limit(10);

    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get tag statistics
exports.getTagStats = async (req, res) => {
  try {
    const stats = await Tag.aggregate([
      {
        $group: {
          _id: "$category",
          count: { $sum: 1 },
          totalUsage: { $sum: "$usageCount" },
          popularTags: {
            $push: {
              name: "$name",
              usageCount: "$usageCount"
            }
          }
        }
      },
      {
        $project: {
          category: "$_id",
          count: 1,
          totalUsage: 1,
          popularTags: {
            $slice: [
              {
                $sortArray: {
                  input: "$popularTags",
                  sortBy: { usageCount: -1 }
                }
              },
              5
            ]
          }
        }
      }
    ]);

    res.status(200).json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 