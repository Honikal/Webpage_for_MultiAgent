export interface ChatResponse {
    answer: string;
    sources: Array<{
        content: string,
        metadata: Record<string, any>;
    }>;
    sucess: boolean;
    mode: 'RAG' | 'DIRECT' | 'WEB';
}

export async function sendMessageToAgent(question: string): Promise<ChatResponse> {
    try {
      //Hacemos llamada a nuestro API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question: question,
        }),
      });
      
      //Checamos el caso de la respuesta
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al obtener respuesta');
      }

      //Extraemos los datos o respuesta (Objeto JSON formado por atributos [answer, sources, sucess])
      const data = await response.json();
      console.log(`Intento observar la lista de sources: ${data.sources}`);

      //Determinamos el caso que esté utilizando RAG basado en la cantidad de recursos usados
      const hasSources = data.sources && data.sources.length > 0;
      console.log(`Tiene recursos: ${hasSources}`);

      //Acá vamos a retornar un objeto tipo ChatResponse
      return {
        answer: data.answer,
        sources: data.sources || [],
        sucess: data.sucess || true,
        mode: hasSources ? 'RAG' : 'DIRECT'
      }
    } catch (error) {
      console.error("Error con la comunicación con la API");
      throw error;
    } 
}

