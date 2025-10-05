export default function handler(req, res) {
  const models = {
    'gemini-2.5-flash': { 
      name: 'Gemini 2.5 Flash', 
      type: 'chat'
    },
    'gemini-2.5-pro': { 
      name: 'Gemini 2.5 Pro', 
      type: 'chat'
    }
  };

  res.json({ models, count: Object.keys(models).length });
}
