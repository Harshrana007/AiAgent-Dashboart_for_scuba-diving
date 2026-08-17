import { v4 as uuidv4 } from 'uuid';
import { db } from '../lib/database';
import { Intent, ConfidenceLevel, Conversation, Message, ResolutionStatus } from '../types';
import ProductService from './ProductService';
import KnowledgeService from './KnowledgeService';

export interface ChatRequest {
  sessionId: string;
  message: string;
  pageUrl?: string;
  productContext?: string;
  conversationId?: string;
}

export interface ChatResponse {
  conversationId: string;
  response: string;
  intent: Intent;
  confidence: ConfidenceLevel;
  confidenceScore: number;
  relatedProducts: any[];
  sources: string[];
  suggestedFollowUps: string[];
  escalationAvailable: boolean;
}

export class AgentService {
  private intents: Intent[] = [
    'product-recommendation',
    'product-comparison',
    'product-compatibility',
    'sizing',
    'product-specifications',
    'availability',
    'shipping',
    'returns',
    'warranty',
    'ordering',
    'diving-information',
    'technical-diving',
    'beginner-guidance',
    'product-education',
    'general-greeting',
    'other'
  ];

  async chat(request: ChatRequest): Promise<ChatResponse> {
    const { sessionId, message, pageUrl, productContext } = request;
    let conversationId = request.conversationId;

    // Get or create conversation
    if (!conversationId) {
      conversationId = uuidv4();
      await this.createConversation({
        id: conversationId,
        sessionId,
        pageUrl: pageUrl || '',
        productContext,
        primaryIntent: 'general-greeting' as Intent
      });
    }

    // Detect intent
    const intent = this.detectIntent(message);
    const confidenceScore = this.calculateConfidence(message, intent);
    const confidence = this.getConfidenceLevel(confidenceScore);

    // Retrieve context
    const allProducts = await ProductService.getAllProducts();
    const relevantKnowledge = await this.retrieveRelevantKnowledge(message, productContext);

    // Generate response
    const { response, sources } = await this.generateResponse(
      message,
      intent,
      confidenceScore,
      relevantKnowledge,
      productContext,
      allProducts
    );

    // Get related products
    const relatedProducts = await this.findRelatedProducts(message, intent, productContext, allProducts);

    // Store message
    await this.storeMessage({
      id: uuidv4(),
      conversationId,
      role: 'user',
      content: message,
      intent,
      confidence: confidenceScore,
      relatedProducts: relatedProducts.map(p => p.id),
      knowledgeSources: sources,
      timestamp: new Date()
    });

    // Store assistant response
    await this.storeMessage({
      id: uuidv4(),
      conversationId,
      role: 'assistant',
      content: response,
      intent,
      confidence: confidenceScore,
      knowledgeSources: sources,
      timestamp: new Date()
    });

    // Update conversation
    await this.updateConversation(conversationId, {
      primaryIntent: intent,
      messageCount: await this.getMessageCount(conversationId),
      confidence
    });

    // Generate suggested follow-ups
    const suggestedFollowUps = this.generateFollowUpQuestions(intent, productContext);

    return {
      conversationId,
      response,
      intent,
      confidence,
      confidenceScore,
      relatedProducts,
      sources,
      suggestedFollowUps,
      escalationAvailable: confidenceScore < 0.5
    };
  }

  private detectIntent(message: string): Intent {
    const lowerMessage = message.toLowerCase();

    // Greeting
    if (lowerMessage.match(/^(hi|hello|hey|greetings)/)) {
      return 'general-greeting';
    }

    // Comparison
    if (lowerMessage.match(/compare|difference|vs|versus|which.*better/i)) {
      return 'product-comparison';
    }

    // Recommendation
    if (lowerMessage.match(/recommend|suggest|best|suitable|good for/i)) {
      return 'product-recommendation';
    }

    // Sizing
    if (lowerMessage.match(/size|fit|dimensions|length|width|height/i)) {
      return 'sizing';
    }

    // Specifications
    if (lowerMessage.match(/spec|technical|rating|depth|capacity|weight|temperature/i)) {
      return 'product-specifications';
    }

    // Compatibility
    if (lowerMessage.match(/compatible|compatible with|work with|fit|match/i)) {
      return 'product-compatibility';
    }

    // Availability
    if (lowerMessage.match(/available|stock|in stock|out of stock|buy/i)) {
      return 'availability';
    }

    // Shipping
    if (lowerMessage.match(/ship|delivery|delivery time|how long/i)) {
      return 'shipping';
    }

    // Returns
    if (lowerMessage.match(/return|refund|money back|guarantee/i)) {
      return 'returns';
    }

    // Warranty
    if (lowerMessage.match(/warranty|guarantee|coverage|protection/i)) {
      return 'warranty';
    }

    // Cold water
    if (lowerMessage.match(/cold water|freezing|ice/i)) {
      return 'technical-diving';
    }

    // Beginner
    if (lowerMessage.match(/beginner|start|new to|first time|learn/i)) {
      return 'beginner-guidance';
    }

    return 'other';
  }

  private calculateConfidence(message: string, intent: Intent): number {
    let confidence = 0.5;

    // Clear intent indicators increase confidence
    if (intent !== 'other' && intent !== 'general-greeting') {
      confidence += 0.2;
    }

    // Specific product questions increase confidence
    if (message.match(/this|that|these|those/i)) {
      confidence += 0.15;
    }

    // Technical questions increase confidence
    if (message.match(/spec|technical|depth|temperature|capacity/i)) {
      confidence += 0.1;
    }

    // Uncertain language decreases confidence
    if (message.match(/\?|not sure|maybe|might|could|possible/i)) {
      confidence -= 0.1;
    }

    return Math.min(0.95, Math.max(0.1, confidence));
  }

  private getConfidenceLevel(score: number): ConfidenceLevel {
    if (score >= 0.75) return 'high';
    if (score >= 0.5) return 'medium';
    return 'low';
  }

  private async retrieveRelevantKnowledge(message: string, productId?: string): Promise<any[]> {
    const keywords = message.split(' ').filter(w => w.length > 3);
    const documents: any[] = [];

    for (const keyword of keywords) {
      const found = await KnowledgeService.searchDocuments(keyword, productId);
      documents.push(...found);
    }

    // Remove duplicates and sort by authority
    const unique = Array.from(new Map(documents.map(d => [d.id, d])).values());
    return unique.slice(0, 5); // Return top 5 relevant documents
  }

  private async generateResponse(
    message: string,
    intent: Intent,
    confidence: number,
    relevantKnowledge: any[],
    productContext: string | undefined,
    allProducts: any[]
  ): Promise<{ response: string; sources: string[] }> {
    const sources: string[] = relevantKnowledge.map(k => k.title);

    let response = '';

    if (intent === 'general-greeting') {
      response = "Hi! I'm Aqua Guide. I can help you choose dive gear, answer questions about our equipment, and guide you through your purchase.";
      return { response, sources };
    }

    if (confidence < 0.5) {
      response = "I'm not entirely certain about that. Could you provide more details? Or I can connect you with our technical support team.";
      return { response, sources };
    }

    if (intent === 'product-recommendation') {
      response = "Based on your needs, I'd recommend checking out our selection of high-quality dive equipment. Can you tell me more about your diving experience level and the conditions you'll be diving in?";
    } else if (intent === 'product-comparison') {
      response = "Great question about comparing products. I can help you understand the differences. Which products are you interested in comparing?";
    } else if (intent === 'sizing') {
      response = "For sizing questions, it's important to get the perfect fit. We have detailed sizing guides for each product. What are you looking to size?";
    } else if (intent === 'shipping') {
      response = "We ship worldwide! Domestic orders typically arrive in 2 business days, and international orders within 5-10 business days. We offer free shipping on orders over $500.";
      sources.push('Shipping and International Orders');
    } else if (intent === 'returns') {
      response = "We offer a 30-day money-back guarantee on all products. Returns are free within 30 days of purchase. No hassle guaranteed.";
      sources.push('Return and Warranty Policy');
    } else if (intent === 'warranty') {
      response = "All our equipment comes with a 2-year manufacturer warranty covering manufacturing defects. Contact our support team for any warranty claims.";
      sources.push('Return and Warranty Policy');
    } else if (intent === 'technical-diving') {
      response = "Cold water diving requires special equipment. Cold-water regulators, heavy wetsuits (7mm+), and proper training are essential. What specific cold-water equipment are you interested in?";
      sources.push('Cold Water Diving Safety', 'Cold Water Regulator Selection Guide');
    } else if (intent === 'beginner-guidance') {
      response = "Welcome to the diving world! For beginners, I'd recommend starting with quality basics: a reliable regulator, comfortable wetsuit, and proper BCD. What interests you most?";
      sources.push('Beginner Regulator Guide');
    } else {
      response = "That's a great question. I can help with product information, comparisons, and store policies. What would you like to know more about?";
    }

    return { response, sources };
  }

  private async findRelatedProducts(
    message: string,
    intent: Intent,
    productContext: string | undefined,
    allProducts: any[]
  ): Promise<any[]> {
    const keywords = message.toLowerCase().split(' ');
    let candidates = allProducts;

    // Filter by keywords
    candidates = candidates.filter(p => {
      const text = `${p.title} ${p.description} ${p.tags.join(' ')}`.toLowerCase();
      return keywords.some(k => k.length > 3 && text.includes(k));
    });

    // Filter by intent
    if (intent === 'product-recommendation') {
      candidates = candidates.slice(0, 3);
    } else if (intent === 'technical-diving' || message.toLowerCase().includes('cold')) {
      candidates = candidates.filter(p => p.tags.includes('cold-water'));
    } else if (message.toLowerCase().includes('travel')) {
      candidates = candidates.filter(p => p.tags.includes('travel'));
    }

    return candidates.slice(0, 3);
  }

  private generateFollowUpQuestions(intent: Intent, productContext?: string): string[] {
    const questions: Record<Intent, string[]> = {
      'product-recommendation': [
        'Tell me about your experience level',
        'What temperature water will you dive in?',
        'Do you need travel-friendly gear?'
      ],
      'product-comparison': [
        'Are you comparing features or performance?',
        'What is your priority: cost or performance?',
        'What will you use this for?'
      ],
      'product-compatibility': [
        'Tell me about your current setup',
        'What other equipment do you have?',
        'Do you need professional installation help?'
      ],
      'sizing': [
        'What is your height and weight?',
        'Do you prefer snug or loose fit?',
        'Have you sized similar products before?'
      ],
      'product-specifications': [
        'What specification matters most to you?',
        'Do you need professional-grade equipment?',
        'What is your use case?'
      ],
      'availability': [
        'Need it urgently?',
        'Would you like a notification when back in stock?',
        'Are you interested in alternatives?'
      ],
      'shipping': [
        'Do you need expedited shipping?',
        'Which country are you shipping to?',
        'Do you need insurance coverage?'
      ],
      'returns': [
        'Would you like our no-questions-asked guarantee?',
        'Do you need help choosing a different product?',
        'Can I help find something better for you?'
      ],
      'warranty': [
        'Do you want extended warranty coverage?',
        'What concerns do you have about durability?',
        'Is this for professional use?'
      ],
      'ordering': [
        'Ready to order now?',
        'Do you have any questions before checkout?',
        'Need anything else?'
      ],
      'diving-information': [
        'Are you a certified diver?',
        'What type of diving interests you?',
        'Would you like training resources?'
      ],
      'technical-diving': [
        'What is your technical diving experience?',
        'What depth are you planning?',
        'Do you need specialized equipment?'
      ],
      'beginner-guidance': [
        'Are you getting certified soon?',
        'What attracts you to diving?',
        'Would you like beginner resources?'
      ],
      'product-education': [
        'What would you like to learn more about?',
        'Are you researching a specific product?',
        'Do you need installation guidance?'
      ],
      'general-greeting': [
        'Help me choose a regulator',
        'What wetsuit should I buy?',
        'Best BCD for travel'
      ],
      'other': [
        'Can you clarify your question?',
        'Is there something specific you need help with?',
        'Would you like to browse our collections?'
      ]
    };

    return questions[intent] || questions['other'];
  }

  private async createConversation(data: any): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO conversations (id, sessionId, pageUrl, productContext, primaryIntent, resolutionStatus, confidence, escalationState, messageCount, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          data.id,
          data.sessionId,
          data.pageUrl,
          data.productContext,
          data.primaryIntent,
          'unresolved',
          'low',
          'none',
          0,
          new Date(),
          new Date()
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  private async storeMessage(message: any): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run(
        `INSERT INTO messages (id, conversationId, role, content, intent, confidence, relatedProducts, knowledgeSources, timestamp)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          message.id,
          message.conversationId,
          message.role,
          message.content,
          message.intent,
          message.confidence,
          JSON.stringify(message.relatedProducts || []),
          JSON.stringify(message.knowledgeSources || []),
          message.timestamp
        ],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  private async updateConversation(conversationId: string, updates: any): Promise<void> {
    return new Promise((resolve, reject) => {
      db.run(
        `UPDATE conversations 
         SET primaryIntent = ?, messageCount = ?, confidence = ?, updatedAt = ?
         WHERE id = ?`,
        [updates.primaryIntent, updates.messageCount, updates.confidence, new Date(), conversationId],
        (err) => {
          if (err) reject(err);
          else resolve();
        }
      );
    });
  }

  private async getMessageCount(conversationId: string): Promise<number> {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT COUNT(*) as count FROM messages WHERE conversationId = ?',
        [conversationId],
        (err, row: any) => {
          if (err) reject(err);
          else resolve(row?.count || 0);
        }
      );
    });
  }

  async getConversation(conversationId: string): Promise<Conversation | null> {
    return new Promise((resolve, reject) => {
      db.get(
        'SELECT * FROM conversations WHERE id = ?',
        [conversationId],
        async (err, convRow: any) => {
          if (err) {
            reject(err);
            return;
          }
          if (!convRow) {
            resolve(null);
            return;
          }

          db.all(
            'SELECT * FROM messages WHERE conversationId = ? ORDER BY timestamp',
            [conversationId],
            (err, messages: any[]) => {
              if (err) reject(err);
              else {
                resolve({
                  ...convRow,
                  messages: messages.map(m => ({
                    ...m,
                    relatedProducts: JSON.parse(m.relatedProducts || '[]'),
                    knowledgeSources: JSON.parse(m.knowledgeSources || '[]')
                  }))
                });
              }
            }
          );
        }
      );
    });
  }
}

export default new AgentService();
