import React, { useState, useRef, useEffect } from 'react';
import { sendChatMessage, getChatHistory } from '../api/agentsAPI';
import { Agent } from '../interfaces/AgentInterfaces';
import useCharacters from '../hooks/useCharacters';
import { User } from 'lucide-react';
import { Message, ChatHistory } from '../interfaces/ChatInterfaces';

const ChatToAgent: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const { characters } = useCharacters();
  const [input, setInput] = useState('');
  const [chatHistory, setChatHistory] = useState<ChatHistory>({ 
    agent_name: '',
    chat_history: [] 
  });
  const [displayChatHistory, setDisplayChatHistory] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [selectedCharacterIndex, setSelectedCharacterIndex] = useState<number>(-1);

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

    const userMessage = {
      role: 'user',
      message: input,
      message_id: Date.now()
    };

    // Immediately show user message
    setDisplayChatHistory(prev => [...prev, userMessage]);
    setInput('');
    
    setIsLoading(true);
    try {
      const agentName = selectedAgent?.agent?.agent_details?.name || '';
      const masterFilePath = selectedAgent?.agent?.master_file_path || 
        `configs/${agentName}/${agentName}_master.json`;

      const response = await sendChatMessage(
        masterFilePath,
        userMessage.message,
        chatHistory
      );
      
      if (response.chat_history) {
        setChatHistory(response.chat_history);
        const newMessages = response.chat_history.chat_history.slice(chatHistory.chat_history.length);
        setDisplayChatHistory(prev => [...prev.slice(0, -1), ...newMessages]); // Replace temp message with actual one
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Agent Selection */}
      <div className="mb-6 flex items-center justify-center gap-4">
        <div className="flex items-center">
          <label className="text-lg font-semibold text-white mr-2">
            Select Agent:
          </label>
          <select 
            className="bg-slate-800 text-white rounded-lg p-2 border border-cyan-800"
            onChange={(e) => {
              const index = parseInt(e.target.value);
              const char = characters[index];
              if (char) {
                
                setSelectedCharacterIndex(index);
                setSelectedAgent(char);
                setDisplayChatHistory([]);
              }
            }}
            value={selectedCharacterIndex}
          >
            <option value={-1} className="text-white font-semibold ">Select an Agent</option>
            {characters.map((char, index) => (
              <option key={index} value={index}>
                {char.agent.agent_details.name}
                {char.agent.master_file_path?.includes('_1') ? ' (1)' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Chat Interface */}
      <div 
        className="flex flex-col h-[70vh] relative"
        style={{
          backgroundImage: selectedAgent?.agent?.profile_image?.details?.url 
            ? `url(${selectedAgent?.agent?.profile_image?.details?.url})` 
            : undefined,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* Add an overlay div for opacity */}
        <div className="absolute inset-0 bg-slate-900/80" />
        
        {/* Wrap content in relative div to appear above overlay */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Messages */}
          <div className="flex-grow overflow-y-auto mb-4 space-y-4 p-4 bg-slate-900/30 rounded-lg">
            {displayChatHistory.map((message) => (
              <div
                key={message.message_id}
                className={`flex ${
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <div className="flex items-center max-w-[80%] space-x-4">
                  {message.role !== 'user' && (
                    <div 
                      className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-600 to-orange-600 flex-shrink-0 self-center"
                      style={{
                        backgroundImage: selectedAgent?.agent?.profile_image?.details?.url 
                          ? `url(${selectedAgent?.agent?.profile_image?.details?.url})` 
                          : undefined,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    />
                  )}
                  
                  <div className="flex flex-col">
                    <span className="text-sm text-cyan-400 mb-1">
                      {message.role === 'user' ? 'User' : selectedAgent?.agent?.agent_details?.name}
                    </span>
                    <div
                      className={`p-4 rounded-lg ${
                        message.role === 'user'
                          ? 'bg-gradient-to-r from-cyan-600/90 to-orange-600/90 text-white'
                          : 'bg-slate-900/90 border border-cyan-900/75 text-gray-300'
                      }`}
                    >
                      <p>{message.message || message.response}</p>
                    </div>
                  </div>

                  {message.role === 'user' && (
                    <div 
                      className="w-10 h-10 rounded-full bg-slate-800 border border-cyan-800/75 flex items-center justify-center flex-shrink-0 self-center"
                    >
                      <User className="w-6 h-6 text-cyan-400" />
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center space-x-4">
                  <div 
                    className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-600 to-orange-600 flex-shrink-0 self-center"
                    style={{
                      backgroundImage: selectedAgent?.agent?.profile_image?.details?.url 
                        ? `url(${selectedAgent?.agent?.profile_image?.details?.url})` 
                        : undefined,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
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
              className="flex-grow px-4 py-2 rounded-lg bg-gray-800/95 border border-orange-500/30 
                        text-gray-100 placeholder-gray-400 font-semibold focus:outline-none 
                        focus:ring-2 focus:ring-orange-500/50"
            />
            <button
              type="submit"
              disabled={!selectedAgent || isLoading}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-600 to-orange-600 text-white disabled:opacity-50 font-semibold"
            >
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ChatToAgent;
