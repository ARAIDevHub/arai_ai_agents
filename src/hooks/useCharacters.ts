const processedCharacters = charactersData.map(char => {
  const { agent } = char;
  const {
    agent_details: {
      name = '',
      personality = [],
      communication_style = [],
      backstory = '',
      universe = '',
      topic_expertise = [],
      hashtags = [],
      emojis = []
    } = {}
  } = agent || {};

  return {
    agent: {
      agent_details: {
        name,
        personality: Array.isArray(personality) ? personality : [],
        communication_style: Array.isArray(communication_style) ? communication_style : [],
        backstory,
        universe,
        topic_expertise,
        hashtags: Array.isArray(hashtags) ? hashtags : [],
        emojis: Array.isArray(emojis) ? emojis : []
      }
    },
    concept: '' // Add a default value for concept
  };
});
