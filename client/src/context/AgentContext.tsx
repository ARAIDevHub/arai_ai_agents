import React, { createContext, useReducer, useContext, ReactNode } from 'react';

// Define the shape of the state
interface AgentState {
  selectedAgent: string | null;
}

// Define the actions
type Action = { type: 'SET_AGENT'; payload: string };

// Create the context
const AgentContext = createContext<{
  state: AgentState;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

// Define the reducer
const agentReducer = (state: AgentState, action: Action): AgentState => {
  console.log(`[Agentcontext] - agentReducer called to set selectedAgent with state: ${JSON.stringify(state)} and action: ${JSON.stringify(action)}`);
  switch (action.type) {
    case 'SET_AGENT':
      return { ...state, selectedAgent: action.payload };
    default:
      throw new Error(`Unhandled action type: ${action.type}`);
  }
};

// Create a provider component
export const AgentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(agentReducer, { selectedAgent: null });

  return (
    <AgentContext.Provider value={{ state, dispatch }}>
      {children}
    </AgentContext.Provider>
  );
};

// Custom hook to use the AgentContext
export const useAgent = () => {
  console.log("[Agentcontext] - useAgent hook called");
  const context = useContext(AgentContext);
  console.log(`[Agentcontext] - useAgent hook called with context: ${JSON.stringify(context)}`);
  if (!context) {
    throw new Error('useAgent must be used within an AgentProvider');
  }
  return context;
}; 