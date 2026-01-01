const { pool } = require('../config/database');

class Submission {
  static async create(submissionData) {
    const { worksheet_id, student_id, answers } = submissionData;
    
    const queryText = `
      INSERT INTO submissions (worksheet_id, student_id, answers, status)
      VALUES ($1, $2, $3, 'pending')
      RETURNING *
    `;

    const { rows } = await pool.query(queryText, [worksheet_id, student_id, answers]);
    return rows[0];
  }

  static async findById(id) {
    const queryText = `
      SELECT s.*, 
             w.title as worksheet_title,
             w.subject as worksheet_subject,
             u.name as student_name,
             g.name as grader_name
      FROM submissions s
      JOIN worksheets w ON s.worksheet_id = w.id
      JOIN users u ON s.student_id = u.id
      LEFT JOIN users g ON s.graded_by = g.id
      WHERE s.id = $1
    `;

    const { rows } = await pool.query(queryText, [id]);
    return rows[0];
  }

  static async findByStudent(studentId, { page = 1, limit = 10, status }) {
    const offset = (page - 1) * limit;
    
    let queryText = `
      SELECT s.*, 
             w.title as worksheet_title,
             w.subject as worksheet_subject,
             COUNT(*) OVER() as total_count
      FROM submissions s
      JOIN worksheets w ON s.worksheet_id = w.id
      WHERE s.student_id = $1
    `;
    
    const queryParams = [studentId];
    let paramCount = 2;

    if (status) {
      queryText += ` AND s.status = $${paramCount}`;
      queryParams.push(status);
      paramCount++;
    }

    queryText += `
      ORDER BY s.submitted_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    queryParams.push(limit, offset);

    const { rows } = await pool.query(queryText, queryParams);

    const totalCount = rows.length > 0 ? parseInt(rows[0].total_count) : 0;
    
    return {
      submissions: rows.map(row => {
        const { total_count, ...submission } = row;
        return submission;
      }),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  }

  static async findByWorksheet(worksheetId, { page = 1, limit = 10, status }) {
    const offset = (page - 1) * limit;
    
    let queryText = `
      SELECT s.*, 
             u.name as student_name,
             u.grade_level,
             COUNT(*) OVER() as total_count
      FROM submissions s
      JOIN users u ON s.student_id = u.id
      WHERE s.worksheet_id = $1
    `;
    
    const queryParams = [worksheetId];
    let paramCount = 2;

    if (status) {
      queryText += ` AND s.status = $${paramCount}`;
      queryParams.push(status);
      paramCount++;
    }

    queryText += `
      ORDER BY s.submitted_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    queryParams.push(limit, offset);

    const { rows } = await pool.query(queryText, queryParams);

    const totalCount = rows.length > 0 ? parseInt(rows[0].total_count) : 0;
    
    return {
      submissions: rows.map(row => {
        const { total_count, ...submission } = row;
        return submission;
      }),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  }

  static async grade(id, { score, feedback, graded_by }) {
    const queryText = `
      UPDATE submissions 
      SET score = $1, 
          feedback = $2, 
          graded_by = $3,
          graded_at = CURRENT_TIMESTAMP,
          status = 'graded'
      WHERE id = $4
      RETURNING *
    `;

    const { rows } = await pool.query(queryText, [score, feedback, graded_by, id]);
    return rows[0];
  }

  static async getStudentStatistics(studentId) {
    const query = `
      SELECT 
        COUNT(*) as total_submissions,
        COUNT(CASE WHEN status = 'graded' THEN 1 END) as graded_submissions,
        AVG(CASE WHEN status = 'graded' THEN score END) as average_score,
        MIN(CASE WHEN status = 'graded' THEN score END) as min_score,
        MAX(CASE WHEN status = 'graded' THEN score END) as max_score
      FROM submissions
      WHERE student_id = $1
    `;

    const { rows } = await pool.query(query, [studentId]);
    return rows[0] || {};
  }
}

module.exports = Submission;