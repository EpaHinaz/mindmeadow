const { pool } = require('../config/database');

class Worksheet {
  static async findAll({ page = 1, limit = 10, subject, level, stage, search }) {
    const offset = (page - 1) * limit;
    
    let queryText = `
      SELECT w.*, 
             u.name as author_name,
             COUNT(*) OVER() as total_count
      FROM worksheets w
      LEFT JOIN users u ON w.created_by = u.id
      WHERE 1=1
    `;
    
    const queryParams = [];
    let paramCount = 1;

    // Apply filters
    if (subject) {
      queryText += ` AND w.subject = $${paramCount}`;
      queryParams.push(subject);
      paramCount++;
    }

    if (level) {
      queryText += ` AND w.level = $${paramCount}`;
      queryParams.push(level);
      paramCount++;
    }

    if (stage) {
      queryText += ` AND w.stage = $${paramCount}`;
      queryParams.push(stage);
      paramCount++;
    }

    if (search) {
      queryText += ` AND (w.title ILIKE $${paramCount} OR w.description ILIKE $${paramCount} OR w.tags::text ILIKE $${paramCount})`;
      queryParams.push(`%${search}%`);
      paramCount++;
    }

    // Add pagination
    queryText += `
      ORDER BY w.created_at DESC
      LIMIT $${paramCount} OFFSET $${paramCount + 1}
    `;
    queryParams.push(limit, offset);

    const { rows } = await pool.query(queryText, queryParams);

    const totalCount = rows.length > 0 ? parseInt(rows[0].total_count) : 0;
    
    return {
      worksheets: rows.map(row => {
        const { total_count, ...worksheet } = row;
        return worksheet;
      }),
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    };
  }

  static async findById(id) {
    const queryText = `
      SELECT w.*, u.name as author_name
      FROM worksheets w
      LEFT JOIN users u ON w.created_by = u.id
      WHERE w.id = $1
    `;

    const { rows } = await pool.query(queryText, [id]);
    return rows[0];
  }

  static async create(worksheetData) {
    const { title, subject, description, content, level, stage, created_by, tags } = worksheetData;
    
    const queryText = `
      INSERT INTO worksheets (title, subject, description, content, level, stage, created_by, tags)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `;

    const { rows } = await pool.query(queryText, [
      title, subject, description, content, level, stage, created_by, tags || []
    ]);
    
    return rows[0];
  }

  static async update(id, updates) {
    const allowedUpdates = ['title', 'subject', 'description', 'content', 'level', 'stage', 'tags'];
    const updateFields = [];
    const values = [];
    let valueIndex = 1;

    for (const [key, value] of Object.entries(updates)) {
      if (allowedUpdates.includes(key) && value !== undefined) {
        updateFields.push(`${key} = $${valueIndex}`);
        values.push(value);
        valueIndex++;
      }
    }

    if (updateFields.length === 0) {
      return null;
    }

    values.push(id);
    const query = `
      UPDATE worksheets 
      SET ${updateFields.join(', ')}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${valueIndex}
      RETURNING *
    `;

    const { rows } = await pool.query(query, values);
    return rows[0];
  }

  static async delete(id) {
    const query = 'DELETE FROM worksheets WHERE id = $1 RETURNING *';
    const { rows } = await pool.query(query, [id]);
    return rows[0];
  }

  static async getStatistics() {
    const query = `
      SELECT 
        COUNT(*) as total_worksheets,
        COUNT(DISTINCT subject) as total_subjects,
        json_agg(
          json_build_object(
            'subject', subject,
            'count', COUNT(*),
            'levels', (
              SELECT json_object_agg(level, level_count)
              FROM (
                SELECT level, COUNT(*) as level_count
                FROM worksheets w2 
                WHERE w2.subject = w.subject 
                GROUP BY level
              ) as level_counts
            )
          )
        ) as subject_stats
      FROM worksheets w
      GROUP BY w.subject
    `;

    const { rows } = await pool.query(query);
    return rows[0] || {};
  }
}

module.exports = Worksheet;