/**
 * useProcessCharacters - A custom hook to transform raw character data into a usable format.
 *
 * Responsibilities:
 * 1. Maps and processes raw data from the API.
 * 2. Ensures all necessary fields are structured and default values are applied.
 * 3. Provides a consistent and clean data structure for use in the application.
 */
const useProcessCharacters = (characters: any[]) => {
    const processedCharacters = characters.map((char) => {
      const { agent, concept = '' } = char; // Default concept to an empty string if not provided.
  
      return {
        agent: {
          agent_details: {
            name: agent?.agent_details?.name || '', // Default to an empty string if name is missing.
            personality: agent?.agent_details?.personality || [], // Ensure personality is an array.
            communication_style: agent?.agent_details?.communication_style || [], // Ensure communication_style is an array.
            backstory: agent?.agent_details?.backstory || '', // Default to an empty string if backstory is missing.
            universe: agent?.agent_details?.universe || '', // Default to an empty string if universe is missing.
            topic_expertise: agent?.agent_details?.topic_expertise || [], // Ensure topic_expertise is an array.
            hashtags: agent?.agent_details?.hashtags || [], // Ensure hashtags is an array.
            emojis: agent?.agent_details?.emojis || [], // Ensure emojis is an array.
          },
          ai_model: agent?.ai_model || {}, // Default to an empty object if ai_model is missing.
          connectors: agent?.connectors || {}, // Default to an empty object if connectors are missing.
          seasons: agent?.seasons || [], // Default to an empty array if seasons are missing.
          tracker: agent?.tracker || {}, // Default to an empty object if tracker is missing.
        },
        concept: concept || '', // Ensure concept is included, defaulting to an empty string if not provided.
      };
    });
  
    return processedCharacters; // Return the processed data for use in the application.
  };
  
  export default useProcessCharacters;
  