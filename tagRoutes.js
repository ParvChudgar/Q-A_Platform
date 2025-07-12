import express from 'express';
import Tag from '../models/tagModel.js';

const router = express.Router();

// GET /api/tags?search=query
router.get('/', async (req, res) => {
  const search = req.query.search || '';
  try {
    const tags = await Tag.find({
      name: { $regex: search, $options: 'i' },
    }).limit(10);
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch tags' });
  }
});

export default router;
