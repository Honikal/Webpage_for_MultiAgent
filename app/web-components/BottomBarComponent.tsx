'use client';

import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { useState, useRef, useEffect } from "react";

interface BottomBarProps {
  currentCommand: string;
  onCommandChange: (value: string) => void;
  onSendCommand: () => void;
  isLoading?: boolean;
}

export const BottomBar = ({
  currentCommand,
  onCommandChange,
  onSendCommand,
  isLoading = false
}: BottomBarProps) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null); //Para manejar el estado de activado/desactivado
  
  //Función de autoresize para el textArea
  const autoResize = () => {
    if (textareaRef.current){
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }

  //Función encargada de manejar los cambios de texto del textArea
  const handleCommandChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onCommandChange(e.target.value);
    autoResize();
  }

  //Función encargada de detectar si se presionó enter o similar
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSendCommand();
    }
  }

  //Manejamos el auto-resize al inicio de cargarse la página
  useEffect(() => {
    autoResize();
  },[currentCommand]);

    return (
    <div className="flex-shrink-0 bg-background border-t border-gray-200 dark:border-gray-800 shadow-lg">
      <div className="container mx-auto px-4 py-4 max-w-4xl">
        <div className="flex gap-3 items-end">
          <div className="flex-1 relative">
            <textarea
              ref={textareaRef}
              value={currentCommand}
              onChange={handleCommandChange}
              onKeyPress={handleKeyPress}
              placeholder="Mensajea con AI-MA"
              rows={1}
              disabled={isLoading}
              className="w-full px-4 py-3 text-gray-900 dark:text-white 
                       bg-gray-50 dark:bg-gray-900 
                       border border-gray-300 dark:border-gray-700 rounded-2xl
                       focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                       resize-none overflow-hidden transition-all duration-200
                       placeholder:text-gray-400 dark:placeholder:text-gray-600
                       text-base leading-relaxed
                       disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ minHeight: '52px', maxHeight: '150px' }}
            />
          </div>

          {/* Send Button with Tooltip */}
          <div className="relative flex px-2 py-2">
            <button
              ref={buttonRef}
              onClick={onSendCommand}
              disabled={!currentCommand.trim() || isLoading}
              onMouseEnter={() => !currentCommand.trim() && !isLoading && setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className={`
                rounded-full px-4 py-3 transition-all duration-200
                flex items-center justify-center
                ${currentCommand.trim() && !isLoading
                  ? 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-600 shadow-md hover:shadow-lg transform hover:scale-105 cursor-pointer' 
                  : 'bg-gray-300 dark:bg-gray-700 cursor-not-allowed opacity-60'
                }
              `}
            >
              <PaperAirplaneIcon className={`size-6 ${currentCommand.trim() && !isLoading ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}/>
            </button>

            {/* Tooltip */}
            {showTooltip && !currentCommand.trim() && !isLoading && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-50">
                <div className="bg-gray-900 dark:bg-gray-800 text-white text-sm rounded-lg py-2 px-3 whitespace-nowrap shadow-lg">
                  ✏️ Tienes que escribir al menos algo para enviar un mensaje
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2">
                    <div className="border-4 border-transparent border-t-gray-900 dark:border-t-gray-800"></div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* User hint */}
        <div className="mt-2 text-center">
          <span className="text-xs text-gray-400 dark:text-gray-500">
            💡 Presiona Enter para enviar, Shift+Enter para nueva línea
          </span>
        </div>
      </div>
    </div>
  );
}