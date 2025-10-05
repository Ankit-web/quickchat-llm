export default function MessageList({ messages }) {
  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
        >
          <div
            className={`max-w-[70%] rounded-lg px-4 py-3 ${
              message.role === 'user'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-900 border border-gray-200'
            }`}
          >
            <div className="flex items-start gap-2">
              <span className="text-xs font-semibold opacity-70">
                {message.role === 'user' ? 'You' : 'AI'}
              </span>
            </div>
            <p className="text-sm mt-1 whitespace-pre-wrap break-words">
              {message.content}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
