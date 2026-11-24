export interface RecommendedMaterialCard {
  id: string;
  title: string;
  category: string;
  type: "free" | "sell" | string;
  price: number;
  unit: string;
  address: string;
  distance_km?: number | null;
  image?: string | null;
  status: string;
}

export interface ChatQuotaInfo {
  daily_limit: number;
  daily_used: number;
  daily_remaining: number;
}

export interface AiChatMessage {
  role: "user" | "assistant";
  content: string;
  recommended_materials?: RecommendedMaterialCard[];
  tools_used?: string[];
  model?: string | null;
  createdAt?: string;
}

export interface AiConversationSummary {
  _id: string;
  title: string;
  materialId?: string | null;
  messageCount: number;
  lastMessagePreview: string;
  lastMessageAt: string;
  createdAt: string;
}

export interface AiConversationDetail {
  _id: string;
  title: string;
  materialId?: string | null;
  messages: AiChatMessage[];
  lastMessageAt: string;
  createdAt: string;
}

export interface AiChatResponse {
  reply: string;
  recommended_materials: RecommendedMaterialCard[];
  tools_used: string[];
  model?: string | null;
  usage?: Record<string, number> | null;
  quota?: ChatQuotaInfo | null;
}

export interface ExtractedMaterialItem {
  title: string;
  category: string;
  estimated_quantity: string;
  unit: string;
  suggested_type: "free" | "sell" | string;
  suggested_price: number;
  reuse_recommendation: string;
  post_description: string;
}

export interface DemolitionAnalysisResult {
  summary: string;
  materials: ExtractedMaterialItem[];
  recycling_potential_score: number;
  estimated_volume_m3?: number | null;
  estimated_truck_trips?: number | null;
  estimated_co2_saved_kg?: number | null;
  estimated_recovery_value_vnd?: number | null;
  dismantle_tips: string[];
  model?: string | null;
  usage?: Record<string, number> | null;
}

export interface MaterialPostDraft {
  title: string;
  category: string;
  type: "free" | "sell" | string;
  price: number;
  unit: string;
  description: string;
  condition_score: number;
  estimated_quantity: string;
  reuse_tips: string[];
  confidence: number;
}

export interface InspectMaterialResult {
  summary: string;
  draft: MaterialPostDraft;
  warnings: string[];
  model?: string | null;
  usage?: Record<string, number> | null;
}

export interface UserAiQuota {
  role: string;
  unlimited: boolean;
  image: {
    dailyLimit: number;
    used: number;
    remaining: number;
  };
  chat: {
    dailyLimit: number;
    used: number;
    remaining: number;
  };
}

export interface MaterialPostPrefill {
  title?: string;
  category?: string;
  type?: "free" | "sell";
  price?: number;
  unit?: string;
  description?: string;
  sourceLabel?: string;
}
