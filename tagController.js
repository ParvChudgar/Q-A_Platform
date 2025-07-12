import Tag from '../models/tagModel.js';

// @desc    Get tags, optionally by search query
// @route   GET /api/tags
// @access  Public
const getTags = async (req, res) => {
    const query = req.query.search
        ? { name: { $regex: req.query.search, $options: 'i' } }
        : {};
    
    const tags = await Tag.find(query).limit(10); // Limit to 10 suggestions
    res.json(tags);
};

export { getTags };