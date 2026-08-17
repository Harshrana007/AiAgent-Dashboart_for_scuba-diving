import sqlite3 from 'sqlite3';
import path from 'path';

const dbPath = path.join(process.cwd(), 'data', 'aquadive.db');

export const db = new sqlite3.Database(dbPath);

export function initializeDatabase(): Promise<void> {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Products table
      db.run(`
        CREATE TABLE IF NOT EXISTS products (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          type TEXT NOT NULL,
          collection TEXT NOT NULL,
          description TEXT,
          price REAL NOT NULL,
          image TEXT,
          availability TEXT DEFAULT 'in-stock',
          specifications TEXT,
          tags TEXT,
          compatibility TEXT,
          weight REAL,
          useCases TEXT,
          relatedProducts TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Collections table
      db.run(`
        CREATE TABLE IF NOT EXISTS collections (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT,
          products TEXT,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Knowledge documents table
      db.run(`
        CREATE TABLE IF NOT EXISTS knowledgeDocuments (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          type TEXT NOT NULL,
          content TEXT NOT NULL,
          source TEXT NOT NULL,
          tags TEXT,
          productAssociation TEXT,
          authorityLevel TEXT DEFAULT 'general',
          status TEXT DEFAULT 'active',
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Conversations table
      db.run(`
        CREATE TABLE IF NOT EXISTS conversations (
          id TEXT PRIMARY KEY,
          sessionId TEXT NOT NULL,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          pageUrl TEXT,
          productContext TEXT,
          visitorType TEXT DEFAULT 'new',
          primaryIntent TEXT,
          resolutionStatus TEXT DEFAULT 'unresolved',
          confidence TEXT DEFAULT 'low',
          escalationState TEXT DEFAULT 'none',
          satisfactionState TEXT,
          messageCount INTEGER DEFAULT 0
        )
      `);

      // Messages table
      db.run(`
        CREATE TABLE IF NOT EXISTS messages (
          id TEXT PRIMARY KEY,
          conversationId TEXT NOT NULL,
          role TEXT NOT NULL,
          content TEXT NOT NULL,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          intent TEXT,
          confidence REAL,
          relatedProducts TEXT,
          knowledgeSources TEXT,
          responseLatency INTEGER,
          FOREIGN KEY (conversationId) REFERENCES conversations (id)
        )
      `);

      // Analytics events table
      db.run(`
        CREATE TABLE IF NOT EXISTS analyticsEvents (
          id TEXT PRIMARY KEY,
          conversationId TEXT NOT NULL,
          type TEXT NOT NULL,
          data TEXT,
          timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (conversationId) REFERENCES conversations (id)
        )
      `);

      // Knowledge gaps table
      db.run(`
        CREATE TABLE IF NOT EXISTS knowledgeGaps (
          id TEXT PRIMARY KEY,
          question TEXT NOT NULL,
          frequency INTEGER DEFAULT 1,
          avgConfidence REAL DEFAULT 0,
          relatedProducts TEXT,
          conversationReferences TEXT,
          escalationCount INTEGER DEFAULT 0,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          status TEXT DEFAULT 'open'
        )
      `);

      // Knowledge suggestions table
      db.run(`
        CREATE TABLE IF NOT EXISTS knowledgeSuggestions (
          id TEXT PRIMARY KEY,
          knowledgeGapId TEXT NOT NULL,
          suggestedContent TEXT NOT NULL,
          format TEXT NOT NULL,
          relatedProducts TEXT,
          priority TEXT DEFAULT 'medium',
          status TEXT DEFAULT 'pending-review',
          approvedAt DATETIME,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (knowledgeGapId) REFERENCES knowledgeGaps (id)
        )
      `);

      // Content opportunities table
      db.run(`
        CREATE TABLE IF NOT EXISTS contentOpportunities (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          type TEXT NOT NULL,
          questionVolume INTEGER DEFAULT 0,
          frequency INTEGER DEFAULT 0,
          products TEXT,
          recommendedFormat TEXT,
          reason TEXT,
          priority TEXT DEFAULT 'medium',
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Agent settings table
      db.run(`
        CREATE TABLE IF NOT EXISTS agentSettings (
          id TEXT PRIMARY KEY,
          storeName TEXT NOT NULL,
          agentName TEXT NOT NULL,
          agentGreeting TEXT,
          knowledgeBaseEnabled INTEGER DEFAULT 1,
          escalationEnabled INTEGER DEFAULT 1,
          productRecommendationEnabled INTEGER DEFAULT 1,
          confidenceThreshold REAL DEFAULT 0.6,
          createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Cart table
      db.run(`
        CREATE TABLE IF NOT EXISTS carts (
          id TEXT PRIMARY KEY,
          visitorSessionId TEXT NOT NULL,
          items TEXT,
          subtotal REAL DEFAULT 0,
          updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `, (err) => {
        if (err) reject(err);
        else resolve();
      });
    });
  });
}

export default db;
