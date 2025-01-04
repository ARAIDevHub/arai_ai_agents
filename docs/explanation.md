# Explanation: ARIA’s Prompt Chaining Approach

**ARIA AI Agents** employs a narrative-based prompt chaining methodology to create cohesive, non-repetitive, and engaging content—ranging from **tweets** and **social media posts** to entire **story arcs**. This approach draws inspiration from **Hollywood screenwriters**, using seasons and episodes to structure continuous storylines and maintain context.

---

## Core Concept

1. **Non-Repetitive Storytelling**  
   - Each generated post builds on previous context, avoiding repetitive language or ideas.  
   - The AI references a “universe” or “world Bible” similar to what screenwriters use in film or television.

2. **TV Show & Cinematic Structure**  
   - Stories are segmented into **seasons** and **episodes**.  
   - Each **episode** can be further divided into “scenes,” which are effectively *individual posts* or *tweets*.

3. **Prompt Chaining**  
   - **Prompts** are carefully crafted to pass relevant context (e.g., last episode events, the overall season arc).  
   - **Chained prompts** ensure that each subsequent piece of content knows what has happened before and maintains consistency.

---

## Why “Prompt Chaining”?

Typical AI-generated content can become repetitive when prompts are not carefully managed. **Prompt chaining** solves this by:

- **Carrying Over Context**  
  Each step (post, scene, or episode) includes details of what came before, preventing “resetting” or “forgetting” and ensuring a natural flow.

- **Layering Background & Universe Data**  
  The AI “knows” the characters’ personalities, the setting, and prior events. This leads to more believable and varied outputs.

- **Batch & Story-Based Generation**  
  Instead of randomly generating single posts, ARIA processes entire sequences of posts together, referencing each other for narrative coherence.

---

## High-Level Workflow

1. **Character Background Sheets**  
   - The system prompts the AI to create detailed character profiles:  
     - **Universe & Backstory** (setting, tone, etc.)  
     - **Traits** (personality, style, goals)  
     - **Emojis & Hashtags** they might use  

2. **Season & Episode Creation**  
   - **Season** = a broad story arc (e.g., Season 1: “The Origin”).  
   - **Episodes** = subdivisions in each season (e.g., Episode 1: “Awakening”, Episode 2: “New Allies”).  
   - This structure emulates a TV series format, providing an expansive canvas for narrative progression.

3. **Scene-to-Post Conversion**  
   - Each **episode** is broken down into “scenes,” which **map directly to individual social media posts**.  
   - *Context injection* includes:  
     - Last episode’s key events  
     - Character developments  
     - The overall “season” summary  

4. **Batch Generation**  
   - ARIA then prompts the AI to generate multiple posts at once (or in succession) so they share context and maintain narrative continuity.  
   - This ensures each post references the correct timeline and plot details.

5. **Season Rollovers**  
   - After a season ends, **context** from that entire season is folded into the AI’s prompt for the next season.  
   - This preserves continuity across seasons, allowing characters to evolve over time.

---

## The Importance of a Large Context Window

To make prompt chaining truly effective, the underlying AI model needs a large **context window**. The **context window** refers to the amount of text (measured in tokens) that the model can “remember” and consider when generating a response.

- **Why We Use `2.0 Experimental Advanced model in Gemini Advanced.`**  
  By default, ARIA uses the `Gemini-Exp-1206` model because it offers a large context window. This is ideal for our narrative-driven approach because:
  
  - **Long-Term Memory:**  
    The model can retain information from earlier parts of the conversation (e.g., details from previous episodes or seasons), which is crucial for maintaining consistency in long-running storylines.

  - **Complex Narrative Structures:**  
    A larger context window allows the model to handle intricate plots, multiple characters, and evolving relationships within the narrative.

  - **Reduced Repetition:**  
    With more context available, the model is less likely to fall back on repetitive phrases or generic responses.

- **Model Selection and Context Window:**  
  When choosing a model for ARIA, the size of the context window is a primary consideration. While a larger context window generally improves performance on complex tasks, it can also increase computational cost and latency. The `gemini-pro` model provides a good balance between context size and efficiency for our use case.

---

## Example Flow

1. **Initialize a “Concept of AI Agent”**  
   ```plaintext
   Prompt: 
   "You are a comedic AI sidekick from a futuristic Mars colony. Generate a backstory 
   detailing your origin, personality traits, and comedic style. Also include an 
   emoji palette and hashtags you frequently use."
   ```
2. **Generate a Character Sheet**  
   - AI responds with backstory, style notes, emojis, hashtags (`#MarsLife`, `#CosmicComedy`, etc.).
3. **Create a Season Plan**  
   - *Season 1: “Launch Day”* with 5 episodes.
4. **Episode 1**  
   - Provide the AI with *scene outlines* or *beats* to cover in episode 1.  
   - AI generates Scenes 1, 2, 3, each as separate social media posts but referencing each other’s details.
5. **Proceed to Episode 2**  
   - Summarize Episode 1 outcomes: “In Episode 1, your comedic AI discovered a stowaway on the Mars rocket…”  
   - The AI crafts next scenes with knowledge of Episode 1’s revelations.
6. **Season Finale**  
   - Summaries of all episodes in Season 1 inform the *Season 2* kickoff prompt.

---

## Benefits of This Approach

- **Narrative Consistency**: By continuously chaining prompts, the AI won’t “forget” critical details and the story remains coherent.  
- **Creative Expansion**: You can easily scale from short comedic sketches to grand multi-season arcs.  
- **Flexibility**: Adapt the same system for *comics*, *film scripts*, or *novel chapters*, just by tweaking prompts.  
- **Engagement**: Social media followers can follow an unfolding storyline rather than seeing disjointed or repetitive posts.

---

## Conclusion

**ARIA AI Agents** leverages a *story-first, chain-of-thought approach* to generating content. By structuring the process akin to **Hollywood screenwriting** and dividing it into **seasons, episodes, and scenes**, ARIA creates vibrant, interconnected narratives. Each step references previous context, preventing repetitive output and fostering deeper engagement for readers (or social media audiences).

If you’d like to learn more about setting up your environment or configuring connectors:

- Check our [How-To Guides](./how-to-guides.md) for environment & API key setup  
- Look at the [Tutorials](./tutorials.md) for step-by-step instructions on building your first season-based storyline  

**Happy storytelling with ARIA!**