import { db } from '../lib/database';
import { Intent, ResolutionStatus, ConfidenceLevel } from '../types';

export interface AnalyticsMetrics {
  totalConversations: number;
  conversationsToday: number;
  conversationsThisWeek: number;
  totalQuestions: number;
  questionsAnswered: number;
  resolutionRate: number;
  escalationRate: number;
  lowConfidenceRate: number;
  unansweredRate: number;
  topQuestions: any[];
  topIntents: any[];
  topProducts: any[];
  knowledgeGaps: any[];
  contentOpportunities: any[];
}

export class AnalyticsService {
  async getOverviewMetrics(): Promise<AnalyticsMetrics> {
    const totalConversations = await this.getTotalConversations();
    const conversationsToday = await this.getConversationsByDate(0);
    const conversationsThisWeek = await this.getConversationsByDate(7);
    const totalQuestions = await this.getTotalQuestions();
    const questionsAnswered = await this.getQuestionsAnswered();
    const resolutionRate = await this.getResolutionRate();
    const escalationRate = await this.getEscalationRate();
    const lowConfidenceRate = await this.getLowConfidenceRate();
    const unansweredRate = 100 - resolutionRate;
    const topQuestions = await this.getTopQuestions(10);
    const topIntents = await this.getTopIntents();
    const topProducts = await this.getTopProducts();
    const knowledgeGaps = await this.getKnowledgeGaps();
    const contentOpportunities = await this.getContentOpportunities();

    return {
      totalConversations,
      conversationsToday,
      conversationsThisWeek,
      totalQuestions,
      questionsAnswered,
      resolutionRate,
      escalationRate,
      lowConfidenceRate,
      unansweredRate,
      topQuestions,
      topIntents,
      topProducts,
      knowledgeGaps,
      contentOpportunities
    };
  }

  private async getTotalConversations(): Promise<number> {
    return new Promise((resolve, reject) => {
      db.get('SELECT COUNT(*) as count FROM conversations', (err, row: any) => {
        if (err) reject(err);
        else resolve(row?.count || 0);
      });
    });
  }

  private async getConversationsByDate(daysAgo: number): Promise<number> {
    return new Promise((resolve, reject) => {
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      db.get(
        'SELECT COUNT(*) as count FROM conversations WHERE createdAt >= ?',
        [date],
        (err, row: any) => {
          if (err) reject(err);
          else resolve(row?.count || 0);
        }
      );
    });
  }

  private async getTotalQuestions(): Promise<number> {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT COUNT(*) as count FROM messages WHERE role = 'user'",
        (err, row: any) => {
          if (err) reject(err);
          else resolve(row?.count || 0);
        }
      );
    });
  }

  private async getQuestionsAnswered(): Promise<number> {
    return new Promise((resolve, reject) => {
      db.get(
        "SELECT COUNT(*) as count FROM messages WHERE role = 'assistant'",
        (err, row: any) => {
          if (err) reject(err);
          else resolve(row?.count || 0);
        }
      );
    });
  }

  private async getResolutionRate(): Promise<number> {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT 
          COUNT(CASE WHEN resolutionStatus IN ('resolved', 'partially-resolved') THEN 1 END) * 100.0 / COUNT(*) as rate
         FROM conversations`,
        (err, row: any) => {
          if (err) reject(err);
          else resolve(Math.round(row?.rate || 0));
        }
      );
    });
  }

  private async getEscalationRate(): Promise<number> {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT 
          COUNT(CASE WHEN escalationState = 'escalated' THEN 1 END) * 100.0 / COUNT(*) as rate
         FROM conversations`,
        (err, row: any) => {
          if (err) reject(err);
          else resolve(Math.round(row?.rate || 0));
        }
      );
    });
  }

  private async getLowConfidenceRate(): Promise<number> {
    return new Promise((resolve, reject) => {
      db.get(
        `SELECT 
          COUNT(CASE WHEN confidence = 'low' THEN 1 END) * 100.0 / COUNT(*) as rate
         FROM conversations`,
        (err, row: any) => {
          if (err) reject(err);
          else resolve(Math.round(row?.rate || 0));
        }
      );
    });
  }

  private async getTopQuestions(limit: number): Promise<any[]> {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT content as question, COUNT(*) as volume, COUNT(*) * 100.0 / (SELECT COUNT(*) FROM messages WHERE role = 'user') as answerRate
         FROM messages 
         WHERE role = 'user'
         GROUP BY content
         ORDER BY volume DESC
         LIMIT ?`,
        [limit],
        (err, rows: any[]) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  private async getTopIntents(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT intent, COUNT(*) as count
         FROM messages 
         WHERE intent IS NOT NULL
         GROUP BY intent
         ORDER BY count DESC`,
        (err, rows: any[]) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  private async getTopProducts(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT relatedProducts, COUNT(*) as volume
         FROM messages 
         WHERE relatedProducts IS NOT NULL AND relatedProducts != '[]'
         GROUP BY relatedProducts
         ORDER BY volume DESC
         LIMIT 10`,
        (err, rows: any[]) => {
          if (err) reject(err);
          else {
            const products = rows?.map(row => ({
              products: JSON.parse(row.relatedProducts),
              volume: row.volume
            })) || [];
            resolve(products);
          }
        }
      );
    });
  }

  private async getKnowledgeGaps(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM knowledgeGaps 
         WHERE status = 'open'
         ORDER BY frequency DESC, escalationCount DESC
         LIMIT 10`,
        (err, rows: any[]) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  private async getContentOpportunities(): Promise<any[]> {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT * FROM contentOpportunities 
         ORDER BY priority DESC, questionVolume DESC
         LIMIT 10`,
        (err, rows: any[]) => {
          if (err) reject(err);
          else resolve(rows || []);
        }
      );
    });
  }

  async getConversationTrend(days: number = 30): Promise<any[]> {
    return new Promise((resolve, reject) => {
      const trends: Record<string, number> = {};

      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dateStr = date.toISOString().split('T')[0];
        trends[dateStr] = 0;
      }

      db.all(
        `SELECT DATE(createdAt) as date, COUNT(*) as count
         FROM conversations
         WHERE createdAt >= datetime('now', '-' || ? || ' days')
         GROUP BY DATE(createdAt)`,
        [days],
        (err, rows: any[]) => {
          if (err) reject(err);
          else {
            rows?.forEach(row => {
              trends[row.date] = row.count;
            });
            resolve(
              Object.entries(trends).map(([date, count]) => ({ date, count }))
            );
          }
        }
      );
    });
  }

  async getConversationsByStatus(): Promise<Record<ResolutionStatus, number>> {
    return new Promise((resolve, reject) => {
      db.all(
        `SELECT resolutionStatus, COUNT(*) as count FROM conversations GROUP BY resolutionStatus`,
        (err, rows: any[]) => {
          if (err) reject(err);
          else {
            const result: any = {
              'resolved': 0,
              'partially-resolved': 0,
              'unresolved': 0,
              'escalated': 0
            };
            rows?.forEach(row => {
              result[row.resolutionStatus] = row.count;
            });
            resolve(result);
          }
        }
      );
    });
  }

  async createKnowledgeGap(question: string, conversationId: string): Promise<void> {
    const { v4: uuidv4 } = await import('uuid');
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO knowledgeGaps (id, question, frequency, conversationReferences, createdAt, status)
         VALUES (?, ?, ?, ?, ?, ?)
         ON CONFLICT(question) DO UPDATE SET frequency = frequency + 1`,
        [
          uuidv4(),
          question,
          1,
          JSON.stringify([conversationId]),
          new Date(),
          'open'
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async createSuggestionFromGap(gapId: string, suggestedContent: string, format: string, products: string[]): Promise<void> {
    const { v4: uuidv4 } = await import('uuid');
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO knowledgeSuggestions (id, knowledgeGapId, suggestedContent, format, relatedProducts, priority, status, createdAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          uuidv4(),
          gapId,
          suggestedContent,
          format,
          JSON.stringify(products),
          'medium',
          'pending-review',
          new Date()
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  async approveSuggestion(suggestionId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE knowledgeSuggestions 
         SET status = 'approved', approvedAt = ?
         WHERE id = ?`,
        [new Date(), suggestionId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }
}

export default new AnalyticsService();
