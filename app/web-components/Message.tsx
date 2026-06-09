'use client';

interface MessageProps {
  text: string;
  sender: 'user' | 'ai';
  index: number;
  timestamp?: Date;
}

export const Message = ({ text, sender, index, timestamp }: MessageProps) => {
  return (
    <div className={`flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`}>
      <div className={`
        max-w-2xl p-4 rounded-lg shadow-md transition-all duration-200
        ${sender === 'user' 
          ? 'bg-blue-100 dark:bg-blue-900/50 text-right' 
          : 'bg-gray-100 dark:bg-gray-800 text-left'
        }
        hover:scale-[1.02] hover:shadow-lg
      `}>
        <p
          className="text-gray-800 dark:text-gray-100
                    break-words text-left whitespace-pre-wrap overflow-wrap-anywhere"
        >
          {text}
        </p>
        <div className="flex justify-between items-center mt-2">
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {sender === 'user' ? 'Usuario' : 'AI-MA'}
          </span>
          {timestamp && (
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {timestamp.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};