const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Worksheet = require('../models/Worksheet');

const router = express.Router();

// Get all worksheets with pagination and filtering
router.get('/', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('subject').optional().isString(),
  query('level').optional().isString(),
  query('stage').optional().isString(),
  query('search').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 10,
      subject,
      level,
      stage,
      search
    } = req.query;

    const result = await Worksheet.findAll({
      page,
      limit,
      subject,
      level,
      stage,
      search
    });

    res.json(result);
  } catch (error) {
    console.error('Get worksheets error:', error);
    res.status(500).json({ error: 'Failed to fetch worksheets' });
  }
});

// Get single worksheet by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const worksheet = await Worksheet.findById(id);

    if (!worksheet) {
      return res.status(404).json({ error: 'Worksheet not found' });
    }

    res.json({ worksheet });
  } catch (error) {
    console.error('Get worksheet error:', error);
    res.status(500).json({ error: 'Failed to fetch worksheet' });
  }
});

// Create new worksheet (teacher only)
router.post('/', [
  body('title').notEmpty().trim(),
  body('subject').notEmpty().isString(),
  body('description').optional().isString(),
  body('content').notEmpty().isString(),
  body('level').notEmpty().isString(),
  body('stage').notEmpty().isString(),
  body('tags').optional().isArray(),
  body('created_by').isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const worksheet = await Worksheet.create(req.body);

    res.status(201).json({
      message: 'Worksheet created successfully',
      worksheet
    });
  } catch (error) {
    console.error('Create worksheet error:', error);
    res.status(500).json({ error: 'Failed to create worksheet' });
  }
});

// Update worksheet
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const updatedWorksheet = await Worksheet.update(id, req.body);

    if (!updatedWorksheet) {
      return res.status(404).json({ error: 'Worksheet not found or no valid updates' });
    }

    res.json({
      message: 'Worksheet updated successfully',
      worksheet: updatedWorksheet
    });
  } catch (error) {
    console.error('Update worksheet error:', error);
    res.status(500).json({ error: 'Failed to update worksheet' });
  }
});

// Delete worksheet
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedWorksheet = await Worksheet.delete(id);

    if (!deletedWorksheet) {
      return res.status(404).json({ error: 'Worksheet not found' });
    }

    res.json({
      message: 'Worksheet deleted successfully'
    });
  } catch (error) {
    console.error('Delete worksheet error:', error);
    res.status(500).json({ error: 'Failed to delete worksheet' });
  }
});

// Get worksheet statistics
router.get('/stats/summary', async (req, res) => {
  try {
    const stats = await Worksheet.getStatistics();
    res.json({ stats });
  } catch (error) {
    console.error('Stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;