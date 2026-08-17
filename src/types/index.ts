// Product-related types
export interface Product {
  id: string;
  title: string;
  type: string;
  collection: string;
  description: string;
  price: number;
  image?: string;
  availability: 'in-stock' | 'low-stock' | 'out-of-stock';
  specifications: Record<string, string | number>;
  tags: string[];
  compatibility?: string[];
  weight?: number;
  useCases: string[];
  relatedProducts?: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Collection {
  id: string;
  name: string;
  description: string;
  products: string[];
}

// Knowledge base types
export type KnowledgeType = 'product' | 'faq' | 'guide' | 'policy' | 'education' | 'content';
export type AuthorityLevel = 'official' | 'approved' | 'general' | 'unverified';
export type KnowledgeStatus = 'active' | 'draft' | 'archived' | 'pending-review';

export interface KnowledgeDocument {
  id: string;
  title: string;
  type: KnowledgeType;
  content: string;
  source: string;
  tags: string[];
  productAssociation?: string[];
  authorityLevel: AuthorityLevel;
  status: KnowledgeStatus;
  updatedAt: Date;
  createdAt: Date;
}

// Conversation types
export type Intent = 
  | 'product-recommendation'
  | 'product-comparison'
  | 'product-compatibility'
  | 'sizing'
  | 'product-specifications'
  | 'availability'
  | 'shipping'
  | 'returns'
  | 'warranty'
  | 'ordering'
  | 'diving-information'
  | 'technical-diving'
  | 'beginner-guidance'
  | 'product-education'
  | 'general-greeting'
  | 'other';

export type ResolutionStatus = 'resolved' | 'partially-resolved' | 'unresolved' | 'escalated';
export type ConfidenceLevel = 'high' | 'medium' | 'low';

export interface Message {
  id: string;
  conversationId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  intent?: Intent;
  confidence?: number;
  relatedProducts?: string[];
  knowledgeSources?: string[];
  responseLatency?: number;
}

export interface Conversation {
  id: string;
  sessionId: string;
  createdAt: Date;
  updatedAt: Date;
  pageUrl: string;
  productContext?: string;
  visitorType: 'new' | 'returning' | 'customer';
  primaryIntent?: Intent;
  resolutionStatus: ResolutionStatus;
  confidence: ConfidenceLevel;
  escalationState: 'none' | 'flagged' | 'escalated';
  satisfactionState?: 'satisfied' | 'unsatisfied' | 'neutral';
  messageCount: number;
  messages: Message[];
}

// Analytics types
export interface AnalyticsEvent {
  id: string;
  conversationId: string;
  type: string;
  data: Record<string, any>;
  timestamp: Date;
}

// Knowledge improvement types
export interface KnowledgeGap {
  id: string;
  question: string;
  frequency: number;
  avgConfidence: number;
  relatedProducts: string[];
  conversationReferences: string[];
  escalationCount: number;
  createdAt: Date;
  status: 'open' | 'addressed' | 'dismissed';
}

export interface KnowledgeSuggestion {
  id: string;
  knowledgeGapId: string;
  suggestedContent: string;
  format: 'faq' | 'buying-guide' | 'comparison' | 'education' | 'product-content';
  relatedProducts: string[];
  priority: 'high' | 'medium' | 'low';
  status: 'pending-review' | 'approved' | 'rejected';
  approvedAt?: Date;
  createdAt: Date;
}

export interface ContentOpportunity {
  id: string;
  title: string;
  type: string;
  questionVolume: number;
  frequency: number;
  products: string[];
  recommendedFormat: string;
  reason: string;
  priority: 'high' | 'medium' | 'low';
  createdAt: Date;
}

// Dashboard types
export interface DashboardOverview {
  totalConversations: number;
  conversationsToday: number;
  conversationsThisWeek: number;
  totalQuestions: number;
  questionsAnswered: number;
  resolutionRate: number;
  escalationRate: number;
  lowConfidenceRate: number;
  unansweredRate: number;
}

export interface TopQuestion {
  id: string;
  question: string;
  volume: number;
  answerRate: number;
  avgConfidence: number;
  relatedProducts: string[];
  intent: Intent;
  recommendedAction: string;
}

// Agent settings
export interface AgentSettings {
  id: string;
  storeName: string;
  agentName: string;
  agentGreeting: string;
  knowledgeBaseEnabled: boolean;
  escalationEnabled: boolean;
  productRecommendationEnabled: boolean;
  confidenceThreshold: number;
}

// Cart types
export interface CartItem {
  productId: string;
  quantity: number;
  addedAt: Date;
}

export interface Cart {
  id: string;
  visitorSessionId: string;
  items: CartItem[];
  subtotal: number;
  updatedAt: Date;
}

// Demo scenario types
export type DemoScenario = 
  | 'cold-water-question'
  | 'travel-bcd-recommendation'
  | 'wetsuit-sizing'
  | 'product-comparison'
  | 'shipping-question'
  | 'unsupported-compatibility'
  | 'low-confidence-question'
  | 'escalation'
  | 'knowledge-gap'
  | 'knowledge-improvement';
