export default function handler(req, res) {
  const { messages, format = 'markdown', title = 'QuickChat' } = req.body;

  if (!messages) {
    return res.status(400).json({ error: 'Messages required' });
  }

  let content = `# ${title}\n\n`;
  messages.forEach(msg => {
    const role = msg.role === 'user' ? '**You**' : '**AI**';
    content += `${role}\n\n${msg.content}\n\n---\n\n`;
  });

  res.setHeader('Content-Type', 'text/markdown');
  res.setHeader('Content-Disposition', `attachment; filename="chat.${format}"`);
  res.send(content);
}
