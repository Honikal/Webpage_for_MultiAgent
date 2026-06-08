'use client';

import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { PaperAirplaneIcon } from '@heroicons/react/24/solid'
import { useDarkMode } from '@/app/provider/DarkmodeProvider';


export default function Home() {
  const [commands, setCommands] = useState<string[]>([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null); //Esto para facilitar autoscroll
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  //Función de autoresize para el textArea
  const autoResize = () => {
    if (textareaRef.current){
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }

  //Función encargada de manejar los cambios de texto del textArea
  const handleCommandChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentCommand(e.target.value);
    autoResize();
  }

  //Función encargada de detectar si se presionó enter o similar
  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendCommand();
    }
  }

  //Función encargada de enviar el comando
  const sendCommand = () => {
    if (!currentCommand.trim()) return; // No enviar mensajes vacíos

    console.log("Comando enviado");
    //A la hora de enviar un comando, nosotros hacemos un append a nuestra lista de comandos
    setCommands((prevCommands) => [...prevCommands, currentCommand]);
    setCurrentCommand("");

    // Reseteamos el tamaño del area de texto al terminar
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  }

  //Manejamos el auto-resize al inicio de cargarse la página
  useEffect(() => {
    autoResize();
  },[]);

  //Manejamos el caso de autoscroll a moverse al final de los mensajes al cambiarse el área de mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commands])

  return (
    <div className="bg-background h-screen flex flex-col overflow-hidden">
      {/*Sección donde se maneja el desarrollo del texto de introducción*/}
      <div className="flex-shrink-0 flex justify-center items-center min-h-[30vh] px-4 pt-8">
        <div className="max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold 
                         text-gray-600 dark:text-gray-100 
                         transition-colors duration-200">
            Bienvenido a AI-MA, haz alguna pregunta relacionada al curso, y buscaremos responderla
          </h2>
        </div>
      </div>

      {/*Sección donde se verán las interacciones con el usuario y el agente*/}
      <div
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto px-4"
      >
        <div className="container mx-auto max-w-6xl py-8">
          <div className="space-y-4">
            {commands.map((command, index) => (
              <div
                key={index}
                className={`flex ${index % 2 === 0 ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`
                  max-w-2xl p-4 rounded-lg shadow-md transition-all duration-200
                  ${index % 2 === 0 
                    ? 'bg-blue-100 dark:bg-blue-900/30 text-right' 
                    : 'bg-gray-100 dark:bg-gray-800 text-left'
                  }
                  hover:scale-[1.02] hover:shadow-lg
                `}>
                  <p
                    className="text-gray-800 dark:text-gray-200
                              break-words whitespace-pre-wrap overflow-wrap-anywhere"
                  >
                    {command}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-400 mt-2 block">
                    {index % 2 === 0 ? 'Usuario' : 'AI-MA'}
                  </span>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
            {/* Add extra padding at the bottom for better spacing */}
            <div className="h-4"></div>
          </div>
        </div>
      </div>
      

      {/*Sección para el input de texto como tal*/}
      <div className="flex-shrink-0 bg-background border-t border-gray-200 dark:border-gray-800 shadow-lg">
        <div className="container mx-auto px-4 py-4 max-w-4xl border rounded-xl">
          <div className="flex gap-3 items-end">
            <div className="flex-1 relative">
              <textarea
                ref={textareaRef}
                value={currentCommand}
                onChange={handleCommandChange}
                onKeyPress={handleKeyPress}
                placeholder="Mensajea con AI-MA"

                className="w-full px-4 py-3 pr-12 text-gray-900 dark:text-white bg-gray-50 dark:bg-gray-900 
                           border border-gray-300 dark:border-gray-700 rounded-2xl
                           focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
                           resize-none overflow-hidden transition-all duration-200
                           placeholder:text-gray-400 dark:placeholder:text-gray-600
                           text-base leading-relaxed"
              />
            </div>
          </div>

          {/*Sección para el manejo a la hora de enviar mensajes*/}
          <div className='container mx-auto px-4 py-2 flex justify-end items-center'>
            <button
              onClick={sendCommand}
              className="cursor-pointer bg-blue-800 hover:bg-blue-400  rounded-3xl px-3 py-3"
            >
              <PaperAirplaneIcon className={`size-6 ${currentCommand.trim() ? 'text-white' : 'text-gray-500 dark:text-gray-400'}`}/>
            </button>
          </div>
        </div>
      </div>


    </div>
  );
}
