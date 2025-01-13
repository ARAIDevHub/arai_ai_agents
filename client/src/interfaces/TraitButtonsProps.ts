import { AgentDetails } from './AgentInterfaces';

export interface TraitButtonsProps {
  field: keyof AgentDetails;
  options: string[];
  onTraitButtonClick: (field: keyof AgentDetails, value: string) => void;
} 