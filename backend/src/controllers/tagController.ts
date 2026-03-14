import { Request, Response } from 'express';
import Tag from '../models/TagModel';

interface TagQuery {
  category?: string;
  popular?: string;
  limit?: string;
}

export const getAllTags = async (
  req: Request<object, object, object, TagQuery>,
  res: Response
): Promise<void> => {
  try {
    const { category, popular, limit } = req.query;
    const query: { category?: string; isPopular?: boolean } = {};

    if (category) {
      query.category = category;
    }

    if (popular === 'true') {
      query.isPopular = true;
    }

    const tags = await Tag.find(query)
      .sort({ category: 1, name: 1 })
      .limit(parseInt(limit || '0') || 0);

    console.log('Returning tags from backend:', tags.length);
    res.status(200).json(tags);
  } catch (error) {
    const err = error as Error;
    console.error('Error fetching tags:', err);
    res.status(500).json({ error: 'Failed to fetch tags' });
  }
};

interface CategoryParams {
  category: string;
}

interface PaginationQuery {
  page?: string;
  limit?: string;
}

export const getTagsByCategory = async (
  req: Request<CategoryParams, object, object, PaginationQuery>,
  res: Response
): Promise<void> => {
  try {
    const { category } = req.params;
    const { page = '1', limit = '20' } = req.query;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const tags = await Tag.find({ category })
      .sort({ usageCount: -1, name: 1 })
      .skip((pageNum - 1) * limitNum)
      .limit(limitNum);

    const total = await Tag.countDocuments({ category });

    res.status(200).json({
      tags,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

interface CreateTagsBody {
  tags: Array<{ name: string; category?: string; description?: string }>;
}

export const createTags = async (
  req: Request<object, object, CreateTagsBody>,
  res: Response
): Promise<void> => {
  try {
    const { tags } = req.body;

    if (!Array.isArray(tags)) {
      res.status(400).json({ message: 'Tags must be an array' });
      return;
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
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

interface IncrementBody {
  tagName: string;
}

export const incrementTagUsage = async (
  req: Request<object, object, IncrementBody>,
  res: Response
): Promise<void> => {
  try {
    const { tagName } = req.body;
    const tag = await Tag.findOneAndUpdate(
      { name: tagName },
      { $inc: { usageCount: 1 } },
      { new: true }
    );

    if (!tag) {
      res.status(404).json({ message: 'Tag not found' });
      return;
    }

    // Update popularity status
    if (tag.usageCount >= 100) {
      await Tag.findByIdAndUpdate(tag._id, { isPopular: true });
    }

    res.status(200).json(tag);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const getPopularTags = async (
  req: Request<object, object, object, { limit?: string }>,
  res: Response
): Promise<void> => {
  try {
    const { limit = '10' } = req.query;
    const tags = await Tag.find({ isPopular: true })
      .sort({ usageCount: -1 })
      .limit(parseInt(limit));

    res.status(200).json(tags);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const getTagSuggestions = async (
  req: Request<object, object, object, { searchTerm?: string }>,
  res: Response
): Promise<void> => {
  try {
    const { searchTerm } = req.query;
    if (!searchTerm) {
      res.status(400).json({ message: 'Search term is required' });
      return;
    }

    const tags = await Tag.find({
      $or: [
        { name: { $regex: searchTerm, $options: 'i' } },
        { description: { $regex: searchTerm, $options: 'i' } },
      ],
    })
      .sort({ usageCount: -1 })
      .limit(10);

    res.status(200).json(tags);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};

export const getTagStats = async (_req: Request, res: Response): Promise<void> => {
  try {
    const stats = await Tag.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalUsage: { $sum: '$usageCount' },
          popularTags: {
            $push: {
              name: '$name',
              usageCount: '$usageCount',
            },
          },
        },
      },
      {
        $project: {
          category: '$_id',
          count: 1,
          totalUsage: 1,
          popularTags: {
            $slice: [
              {
                $sortArray: {
                  input: '$popularTags',
                  sortBy: { usageCount: -1 },
                },
              },
              5,
            ],
          },
        },
      },
    ]);

    res.status(200).json(stats);
  } catch (error) {
    const err = error as Error;
    res.status(500).json({ message: err.message });
  }
};
