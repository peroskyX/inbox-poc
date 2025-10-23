/**
 * Thoughtful status messages for Nia
 * Reflects Nia's semi-formal, compassionate, and helpful personality
 */

const THINKING_MESSAGES = [
  "Taking a moment to consider this...",
  "Reflecting on your question...",
  "Gathering my thoughts for you...",
  "Considering the best way to help...",
  "Thinking this through carefully...",
  "Taking time to understand...",
  "Working on this for you...",
  "Carefully processing your request...",
  "Looking into this thoughtfully...",
  "Taking a moment to help you properly...",
  "Considering all the details...",
  "Processing this with care...",
  "Thinking through the best approach...",
  "Reviewing your needs carefully...",
  "Taking a thoughtful look at this...",
  "Working to understand fully...",
  "Considering how I can best assist...",
  "Reflecting on the right response...",
  "Taking time to get this right for you...",
  "Carefully considering your situation...",
];

/**
 * Returns a random thinking message to display while processing
 */
export function getRandomThinkingMessage(): string {
  const randomIndex = Math.floor(Math.random() * THINKING_MESSAGES.length);
  return THINKING_MESSAGES[randomIndex];
}
