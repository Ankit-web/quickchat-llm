/**
 * Rough token estimation: 1 token ≈ 4 characters in English
 * This is approximate - OpenAI's tiktoken is more accurate but requires large library
 */
export function estimateTokens(text) {
  if (!text) return 0;
  return Math.ceil(text.length / 4);
}

/**
 * Count total tokens in conversation (all messages + system prompt)
 */
export function countConversationTokens(messages, systemPrompt = '') {
  let total = estimateTokens(systemPrompt);
  
  messages.forEach(msg => {
    // 4 tokens for message formatting overhead
    total += estimateTokens(msg.content) + 4;
  });
  
  return total;
}

/**
 * Estimate cost based on token count
 * GPT-3.5-turbo pricing: $0.0015 per 1K input tokens, $0.002 per 1K output tokens
 */
export function estimateCost(inputTokens, outputTokens = 0) {
  const inputCost = (inputTokens / 1000) * 0.0015;
  const outputCost = (outputTokens / 1000) * 0.002;
  return (inputCost + outputCost).toFixed(4);
}
