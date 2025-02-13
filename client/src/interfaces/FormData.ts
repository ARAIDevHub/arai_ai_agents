import { WalletRow } from './WalletRow';

export interface FormData {
  tokenName: string;
  tokenSymbol: string;
  tokenDescription: string;
  solAmount: string;
  image: File;
  website?: string;
  twitter?: string;
  telegram?: string;
  walletRows: WalletRow[];
  showAdvanced: boolean;
  mevTip: '0.00003' | '0.0001' | '0.0003';
  blockEngine: string;
  showSocialLinks: boolean;
} 