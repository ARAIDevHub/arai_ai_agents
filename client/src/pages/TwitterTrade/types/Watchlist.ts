export interface Watchlist {
  id: string;
  name: string;
  accounts: string[];
  isExpanded?: boolean;
}

export interface WatchlistColumn {
  id: string;
  name: string;
  accounts: string[];
} 