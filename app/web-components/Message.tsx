'use client';

import { useState } from "react";

interface Source {
  content: string;
  metadata: Record<string, any>;
}

interface MessageProps {
  text: string;
  sender: 'user' | 'ai';
  index: number;
  timestamp?: Date;
  mode?: 'RAG' | 'DIRECT' | 'WEB';
  sources?: Source[];
}

export const Message = ({ text, sender, index, timestamp, mode, sources }: MessageProps) => {
  const [showSources, setShowSources] = useState(false);
 
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
        {/*Indicador del texto generado por la IA*/}
        <p
          className="text-gray-800 dark:text-gray-100
                    break-words text-left whitespace-pre-wrap overflow-wrap-anywhere"
        >
          {text}
        </p>

        {/*Indicadores para el mensaje de IA*/}
        {sender === 'ai' && mode && (
          <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`text-xs px-2 py-1 rounded-full ${
                  mode === 'RAG'
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300'
                }`}>
                  {mode === 'RAG' ? 'Modo RAG' : 'Modo Directo'}
                </span>
                {mode === 'RAG' && sources && (
                  <button
                    onClick={() => setShowSources(!showSources)}
                    className="text-xs text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 underline">
                      {showSources ? 'Ocultar fuentes': `Ver fuentes`}
                    </button> 
                )}
              </div>
              {timestamp && (
                <span className="text-xs text-gray-400 dark:text-gray-500">
                  {timestamp.toLocaleTimeString()}
                </span>
              )}
            </div>

            {/*Sección donde se observan las fuentes*/}
            {mode === 'RAG' && sources && sources.length > 0 && showSources && (
              <div className="mt-3 space-y-2">
                <p className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                  Fuentes utilizadas:
                </p>
                {sources?.map((source, idx) => (
                  <div key={idx} className="text-xs text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 p-2 rounded">
                    <p className="font-mono text-xs">
                      {source.metadata?.file_name || source.metadata?.source || `Fuente ${idx + 1}`}
                    </p>
                    <p className="mt-1">{source.content.substring(0, 150)}...</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {sender === 'user' && timestamp && (
          <div className="mt-2 flex justify-end">
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {timestamp.toLocaleTimeString()}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};