export interface Message {
  role: string;
  message?: string;
  response?: string;
  message_id: number;
}

export interface ChatHistory {
  agent_name: string;
  chat_history: Message[];
} 