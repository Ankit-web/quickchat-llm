export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { messages, model = 'gemini-2.0-flash-exp', temperature = 0.7, personality = 'general' } = req.body;

  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Messages required' });
  }

  try {
    const API_KEY = process.env.GEMINI_API_KEY;
    
    if (!API_KEY) {
      return res.status(500).json({ error: 'API key not configured' });
    }

    // System prompts for different personalities
    const systemPrompts = {
      general: '',
      creative: 'Be creative, imaginative, and think outside the box. Use vivid language and metaphors.',
      technical: 'Be precise, technical, and detailed. Focus on accuracy and provide code examples when relevant.',
      friendly: 'Be warm, conversational, and supportive. Use a casual tone and show empathy.'
    };

    // Build conversation history for Gemini
    const contents = messages.map(msg => ({
      role: msg.role === 'user' ? 'user' : 'model',
      parts: [{ text: msg.content }]
    }));

    // Add system prompt if personality is set
    if (personality !== 'general' && systemPrompts[personality]) {
      contents.unshift({
        role: 'user',
        parts: [{ text: systemPrompts[personality] }]
      });
      contents.splice(1, 0, {
        role: 'model',
        parts: [{ text: 'Understood. I will respond accordingly.' }]
      });
    }

    // Call Gemini API
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents,
          generationConfig: { 
            temperature, 
            maxOutputTokens: 2048 
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini API error:', error);
      return res.status(response.status).json({ error: 'Gemini API error' });
    }

    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';

    // Send as Server-Sent Events
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');

    // Stream response word by word
    const words = text.split(' ');
    for (let i = 0; i < words.length; i++) {
      const chunk = (i === 0 ? words[i] : ' ' + words[i]);
      res.write(`data: ${JSON.stringify({ content: chunk })}\n\n`);
      await new Promise(resolve => setTimeout(resolve, 30)); // 30ms delay
    }

    res.write('data: [DONE]\n\n');
    res.end();

  } catch (error) {
    console.error('API Error:', error);
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
}
