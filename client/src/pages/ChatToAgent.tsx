import React, { useState, useRef, useEffect } from 'react';
import { getCharacters, sendChatMessage, getChatHistory } from '../api/agentsAPI';
import { Agent } from '../interfaces/AgentInterfaces';
import useCharacters from '../hooks/useCharacters';

interface Message {
  role: string;
  message?: string;
  response?: string;
  message_id: number;
}

interface ChatHistory {
  agent_name: string;
  chat_history: Message[];
}

const ChatToAgent: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const { characters, loading, error } = useCharacters();
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatHistory>({ 
    agent_name: '',
    chat_history: [] 
  });
  const [displayChatHistory, setDisplayChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [displayChatHistory]);

  // Load chat history when agent is selected
  useEffect(() => {
    const loadChatHistory = async () => {
      if (selectedAgent?.agent?.agent_details?.name) {
        try {
          const agentName = selectedAgent.agent.agent_details.name;
          const masterFilePath = selectedAgent.agent.master_file_path || 
            `configs/${agentName}/${agentName}_master.json`;
          const history = await getChatHistory(masterFilePath);
          console.log("[ChatToAgent] - loadChatHistory - history", history);
          setChatHistory(history);
        } catch (error) {
          console.error('Error loading chat history:', error);
          setChatHistory({ 
            agent_name: selectedAgent.agent.agent_details.name, 
            chat_history: [] 
          });
        }
      }
    };
    loadChatHistory();
  }, [selectedAgent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !selectedAgent) return;

    setIsLoading(true);
    try {
      const agentName = selectedAgent.agent.agent_details.name;
      const masterFilePath = selectedAgent.agent.master_file_path || 
        `configs/${agentName}/${agentName}_master.json`;

        console.log("[ChatToAgent - masterFilePath] - handleSubmit - masterFilePath", masterFilePath);
      
      const response = await sendChatMessage(
        masterFilePath,
        input,
        chatHistory
      );
      
      if (response.chat_history) {
        setChatHistory(response.chat_history);
        const newMessages = response.chat_history.chat_history.slice(chatHistory.chat_history.length);
        setDisplayChatHistory(prev => [...prev, ...newMessages]);
      }
      setInput('');
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Agent Selection */}
      <div className="mb-6">
        <label className="text-gray-400 mr-2">Select Character:</label>
        <select 
          className="bg-slate-800 text-gray-300 rounded-lg p-2 border border-cyan-800"
          onChange={(e) => {
            const char = characters.find(c => c.agent.agent_details.name === e.target.value);
            if (char) {
              setSelectedAgent(char);
              setDisplayChatHistory([]); // Reset display history when switching agents
            }
          }}
          value={selectedAgent?.agent?.agent_details?.name || ""}
        >
          <option value="">Select a character</option>
          {characters.map((char, index) => (
            <option key={index} value={char.agent.agent_details.name}>
              {char.agent.agent_details.name}
              {char.agent.master_file_path?.includes('_1') ? ' (1)' : ''}
            </option>
          ))}
        </select>
      </div>

      {/* Chat Interface */}
      <div className="flex flex-col h-[70vh]">
        {/* Messages */}
        <div className="flex-grow overflow-y-auto mb-4 space-y-4 p-4 bg-slate-900/30 rounded-lg">
          {displayChatHistory.map((message) => (
            <div
              key={message.message_id}
              className={`flex ${
                message.role === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[80%] p-4 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-orange-600 text-white'
                    : 'bg-slate-900/60 border border-cyan-900/50 text-gray-300'
                }`}
              >
                <p>{message.message || message.response}</p>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-slate-900/60 border border-cyan-900/50 p-4 rounded-lg">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                  <div
                    className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.2s' }}
                  />
                  <div
                    className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce"
                    style={{ animationDelay: '0.4s' }}
                  />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-4">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              selectedAgent
                ? 'Type your message...'
                : 'Please select an agent first...'
            }
            disabled={!selectedAgent || isLoading}
            className="flex-grow px-4 py-2 rounded-lg bg-slate-900/50 border border-orange-500/20 text-white"
          />
          <button
            type="submit"
            disabled={!selectedAgent || isLoading}
            className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-orange-600 text-white disabled:opacity-50"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatToAgent;
