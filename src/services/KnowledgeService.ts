import { db } from '../lib/database';
import { KnowledgeDocument, KnowledgeStatus, AuthorityLevel } from '../types';

export class KnowledgeService {
  async getDocument(id: string): Promise<KnowledgeDocument | null> {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM knowledgeDocuments WHERE id = ?',
        [id],
        (err, row: any) => {
          if (err) reject(err);
          else if (row) {
            resolve({
              ...row,
              tags: JSON.parse(row.tags),
              productAssociation: JSON.parse(row.productAssociation)
            });
          } else resolve(null);
        }
      );
    });
  }

  async getAllDocuments(status?: KnowledgeStatus): Promise<KnowledgeDocument[]> {
    return new Promise((resolve, reject) => {
      const query = status
        ? 'SELECT * FROM knowledgeDocuments WHERE status = ? ORDER BY updatedAt DESC'
        : 'SELECT * FROM knowledgeDocuments ORDER BY updatedAt DESC';
      const params = status ? [status] : [];

      db.all(query, params, (err, rows: any[]) => {
        if (err) reject(err);
        else {
          resolve(rows.map(row => ({
            ...row,
            tags: JSON.parse(row.tags),
            productAssociation: JSON.parse(row.productAssociation)
          })));
        }
      });
    });
  }

  async searchDocuments(query: string, productId?: string): Promise<KnowledgeDocument[]> {
    const lowerQuery = query.toLowerCase();
    return new Promise((resolve, reject) => {
      let sql = `
        SELECT * FROM knowledgeDocuments 
        WHERE status = 'active' AND (
          LOWER(title) LIKE ? 
          OR LOWER(content) LIKE ? 
          OR LOWER(tags) LIKE ?
        )
      `;
      const params: any[] = [`%${lowerQuery}%`, `%${lowerQuery}%`, `%${lowerQuery}%`];

      if (productId) {
        sql += ' OR (productAssociation LIKE ?)';
        params.push(`%"${productId}"%`);
      }

      sql += ' ORDER BY authorityLevel DESC, updatedAt DESC';

      db.all(sql, params, (err, rows: any[]) => {
        if (err) reject(err);
        else {
          resolve(rows.map(row => ({
            ...row,
            tags: JSON.parse(row.tags),
            productAssociation: JSON.parse(row.productAssociation)
          })));
        }
      });
    });
  }

  async getDocumentsByType(type: string): Promise<KnowledgeDocument[]> {
    return new Promise((resolve, reject) => {
      db.all(
        'SELECT * FROM knowledgeDocuments WHERE type = ? AND status = "active" ORDER BY updatedAt DESC',
        [type],
        (err, rows: any[]) => {
          if (err) reject(err);
          else {
            resolve(rows.map(row => ({
              ...row,
              tags: JSON.parse(row.tags),
              productAssociation: JSON.parse(row.productAssociation)
            })));
          }
        }
      );
    });
  }

  async getDocumentsByProduct(productId: string): Promise<KnowledgeDocument[]> {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM knowledgeDocuments 
         WHERE status = 'active' AND productAssociation LIKE ?
         ORDER BY authorityLevel DESC, updatedAt DESC`,
        [`%"${productId}"%`],
        (err, rows: any[]) => {
          if (err) reject(err);
          else {
            resolve(rows.map(row => ({
              ...row,
              tags: JSON.parse(row.tags),
              productAssociation: JSON.parse(row.productAssociation)
            })));
          }
        }
      );
    });
  }

  async createDocument(document: Omit<KnowledgeDocument, 'createdAt' | 'updatedAt'>): Promise<KnowledgeDocument> {
    return new Promise((resolve, reject) => {
      const now = new Date();
      db.run(
        `INSERT INTO knowledgeDocuments (id, title, type, content, source, tags, productAssociation, authorityLevel, status, updatedAt, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          document.id,
          document.title,
          document.type,
          document.content,
          document.source,
          JSON.stringify(document.tags),
          JSON.stringify(document.productAssociation),
          document.authorityLevel,
          document.status,
          now,
          now
        ],
        (err) => {
          if (err) reject(err);
          else {
            resolve({
              ...document,
              createdAt: now,
              updatedAt: now
            });
          }
        }
      );
    });
  }

  async updateDocument(id: string, updates: Partial<KnowledgeDocument>): Promise<void> {
    return new Promise((resolve, reject) => {
      const fields: string[] = [];
      const values: any[] = [];

      if (updates.title) {
        fields.push('title = ?');
        values.push(updates.title);
      }
      if (updates.content) {
        fields.push('content = ?');
        values.push(updates.content);
      }
      if (updates.status) {
        fields.push('status = ?');
        values.push(updates.status);
      }
      if (updates.tags) {
        fields.push('tags = ?');
        values.push(JSON.stringify(updates.tags));
      }

      fields.push('updatedAt = ?');
      values.push(new Date());
      values.push(id);

      db.run(
        `UPDATE knowledgeDocuments SET ${fields.join(', ')} WHERE id = ?`,
        values,
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async deleteDocument(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run('DELETE FROM knowledgeDocuments WHERE id = ?', [id], (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  }
}

export default new KnowledgeService();
