import express from 'express';
import {
  getAllTags,
  getTagsByCategory,
  createTags,
  incrementTagUsage,
  getPopularTags,
  getTagSuggestions,
  getTagStats,
} from '../controllers/tagController';

const router = express.Router();

router.get('/', getAllTags);
router.get('/category/:category', getTagsByCategory);
router.post('/', createTags);
router.post('/increment', incrementTagUsage);
router.get('/popular', getPopularTags);
router.get('/suggestions', getTagSuggestions);
router.get('/stats', getTagStats);

export default router;
