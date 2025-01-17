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
      // Char is the raw data from the API
      // Destructure the char object to extract the necessary fields
      const { agent } = char;

      return {
        agent: {
          agent_details: {
            name: agent?.agent_details?.name || '',
            personality: agent?.agent_details?.personality || [],
            communication_style: agent?.agent_details?.communication_style || [],
            backstory: agent?.agent_details?.backstory || '',
            universe: agent?.agent_details?.universe || '',
            topic_expertise: agent?.agent_details?.topic_expertise || [],
            hashtags: agent?.agent_details?.hashtags || [],
            emojis: agent?.agent_details?.emojis || [],
            concept: agent?.concept || '',
          },
          profile_image: agent?.profile_image || {},
          concept: agent?.concept || '',
          profile_image_options: agent?.profile_image_options || [],
          ai_model: agent?.ai_model || {},
          connectors: agent?.connectors || {},
          seasons: agent?.seasons || [],
          tracker: agent?.tracker || {},
        }
      };
    });
  
    return processedCharacters; // Return the processed data for use in the application.
  };
  
  export default useProcessCharacters;
  