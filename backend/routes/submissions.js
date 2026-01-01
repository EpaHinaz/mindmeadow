const express = require('express');
const { body, validationResult, query } = require('express-validator');
const Submission = require('../models/Submission');

const router = express.Router();

// Submit a worksheet
router.post('/', [
  body('worksheet_id').isInt(),
  body('student_id').isInt(),
  body('answers').notEmpty().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const submission = await Submission.create(req.body);

    res.status(201).json({
      message: 'Worksheet submitted successfully',
      submission
    });
  } catch (error) {
    console.error('Submit worksheet error:', error);
    res.status(500).json({ error: 'Failed to submit worksheet' });
  }
});

// Get submission by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const submission = await Submission.findById(id);

    if (!submission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json({ submission });
  } catch (error) {
    console.error('Get submission error:', error);
    res.status(500).json({ error: 'Failed to fetch submission' });
  }
});

// Get submissions by student
router.get('/student/:studentId', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('status').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { studentId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const result = await Submission.findByStudent(studentId, {
      page,
      limit,
      status
    });

    res.json(result);
  } catch (error) {
    console.error('Get student submissions error:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Get submissions by worksheet
router.get('/worksheet/:worksheetId', [
  query('page').optional().isInt({ min: 1 }).toInt(),
  query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  query('status').optional().isString()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { worksheetId } = req.params;
    const { page = 1, limit = 10, status } = req.query;

    const result = await Submission.findByWorksheet(worksheetId, {
      page,
      limit,
      status
    });

    res.json(result);
  } catch (error) {
    console.error('Get worksheet submissions error:', error);
    res.status(500).json({ error: 'Failed to fetch submissions' });
  }
});

// Grade a submission
router.put('/:id/grade', [
  body('score').isFloat({ min: 0, max: 100 }),
  body('feedback').optional().isString(),
  body('graded_by').isInt()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;

    const gradedSubmission = await Submission.grade(id, req.body);

    if (!gradedSubmission) {
      return res.status(404).json({ error: 'Submission not found' });
    }

    res.json({
      message: 'Submission graded successfully',
      submission: gradedSubmission
    });
  } catch (error) {
    console.error('Grade submission error:', error);
    res.status(500).json({ error: 'Failed to grade submission' });
  }
});

// Get student statistics
router.get('/student/:studentId/stats', async (req, res) => {
  try {
    const { studentId } = req.params;

    const stats = await Submission.getStudentStatistics(studentId);

    res.json({ stats });
  } catch (error) {
    console.error('Get student stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

module.exports = router;