'use client';

import { useState, useRef, useEffect } from "react";
import { BottomBar } from "@/app/web-components/BottomBarComponent";
import { Message } from "@/app/web-components/Message";
import { ChatResponse, sendMessageToAgent } from "./api/chat/chatService";

type MessageType = {
  id: string;
  text: string;
  sender: 'user' | 'ai';
  timestamp: Date;
  mode?: 'RAG' | 'DIRECT' | 'WEB';
  sources?: Array<{
    content: string;
    metadata: Record<string, any>;
  }>;
};

export default function Home() {
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [currentCommand, setCurrentCommand] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null); //Esto para facilitar autoscroll
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  //Función encargada de enviar el comando
  const sendCommand = async() => {
    if (!currentCommand.trim()) return; // No enviar mensajes vacíos

    //Extraemos la pregunta
    const userQuestion = currentCommand.trim();

    const userMessage: MessageType = {
      id: Date.now().toString(),
      text: userQuestion,
      sender: "user",
      timestamp: new Date(),
    }


    //A la hora de enviar un comando, nosotros hacemos un append a nuestra lista de comandos
    setMessages((prevCommands) => [...prevCommands, userMessage]);
    setCurrentCommand("");
    setIsLoading(true);

    //TODO Llamado al API del agente
    try {
      //Usamos nuestro archivo chatService.ts para el servicio de comunicación
      const response: ChatResponse = await sendMessageToAgent(userQuestion);
      console.log("Respuesta recibida:");
      console.log("Modo utilizado:", response.mode);
      console.log("Fuentes:", response.sources?.length || 0);

      //Creamos el mensaje de IA con modo y fuentes en caso de tenerlas
      const IA_response : MessageType = {
        id: (Date.now() + 1).toString(),
        text: response.answer,  //Data.answer contiene la respuesta
        sender: "ai",
        timestamp: new Date(),
        mode: response.mode,
        sources: response.sources
      };
      setMessages((prev) => [...prev, IA_response]);

    } catch (error) {
      console.error("Error con la comunicación con la API");

      //Extraemos mensaje de error
      const errorMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        text: "Lo siento, hubo un error al procesar tu pregunta. Por favor, verifica que el servidor backend esté corriendo en http://localhost:8000",
        sender: "ai",
        timestamp: new Date(),
        mode: "DIRECT"
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  //Manejamos el caso de autoscroll a moverse al final de los mensajes al cambiarse el área de mensajes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages])

  return (
    <div className="bg-background h-screen flex flex-col overflow-hidden">
      {/*Sección donde se maneja el desarrollo del texto de introducción*/}
      <div className="flex-shrink-0 flex justify-center items-center min-h-[30vh] px-4 pt-8">
        <div className="max-w-4xl text-center">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold 
                         text-gray-900 dark:text-gray-500
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
            {messages.map((message, index) => (
              <Message
                key={message.id}
                text={message.text}
                sender={message.sender}
                index={index}
                timestamp={message.timestamp}
                mode={message.mode}
                sources={message.sources}
              />
            ))}

            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-green-200 dark:bg-gray-800 rounded-lg p-4 max-w-2xl">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                    <span className="text-gray-500 dark:text-gray-400 text-sm ml-2">AI-MA está pensando...</span>
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
            {/* Add extra padding at the bottom for better spacing */}
            <div className="h-4"></div>
          </div>
        </div>
      </div>
      

      {/*Sección para el input de texto como tal*/}
      <BottomBar
        currentCommand={currentCommand}
        onCommandChange={setCurrentCommand}
        onSendCommand={sendCommand}
        isLoading={isLoading}
      />

    </div>
  );
}
