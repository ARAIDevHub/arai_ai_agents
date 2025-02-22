export interface Tweet {
  id: string;
  text: string;
  author: {
    username: string;
    name: string;
    profileImageUrl: string;
  };
  createdAt: string;
  entities: {
    urls: {
      url: string;
      expanded_url: string;
      display_url: string;
    }[];
  };
  aiAnalysis?: {
    contentQuality: number;
    insights: string[];
  };
  similar?: Array<{
    name: string;
    score: number;
    description?: string;
  }>;
  engagements?: Array<{
    username: string;
    displayName?: string;
    profileImage?: string;
    verified?: boolean;
    type: 'like' | 'retweet' | 'reply';
    timestamp?: string;
    metrics?: {
      influence: number;
      followers: number;
    };
  }>;
  metrics?: {
    replies: number;
    retweets: number;
    likes: number;
    impressions: number;
    quotes: number;
    bookmarks: number;
  };
  commentCount?: number;
  retweetCount?: number;
  likeCount?: number;
  shareCount?: number;
}

// Helper function to format metric counts using K, M, and B abbreviations
export function formatMetricCount(value: number): string {
  if (value < 1000) return value.toString();
  if (value < 1_000_000) return (value / 1000).toFixed(1).replace(/\.0$/, "") + "K";
  if (value < 1_000_000_000) return (value / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
  return (value / 1_000_000_000).toFixed(1).replace(/\.0$/, "") + "B";
} 