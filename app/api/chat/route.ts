import { NextResponse } from "next/server";

//Agarramos acceso al valor del backend
const PYTHON_BACKEND_URL = process.env.PYTHON || 'http://localhost:8000' //http://0.0.0.0:8000

export async function POST(request: Request){
    try {
        //Agarramos la pregunta como tal
        const { question } = await request.json();

        //Validamos que la pregunta tenga actual texto (aunque esté "validado" en frontend)
        if (!question || question.trim() === ''){
            return NextResponse.json(
                { error: 'Se requiere una pregunta para que funcione el chat' },
                { status: 400 }
            );
        }

        //Escogemos el parámetro TODO
        const endpoint = '/ask'; // /ask || /ask-rag

        //Formamos la solicitud para la comunicación con Python
        const response = await fetch(`${PYTHON_BACKEND_URL}${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                question: question,
                use_langfuse: false
            }),
        });

        //Validamos que el valor de response sea correcto (hacemos que espere por un error dado por el http)
        if (!response.ok){
            const error = await response.json();
            throw new Error(error.detail || 'Failed to get response from AI');
        }

        //Extraemos la información solicitada
        const data = await response.json();

        //Retornamos el dato final dado por la función de /ask o /ask-rag
        return NextResponse.json({
            answer: data.answer,
            sources: data.sources,
            sucess: data.sucess
        })
    } catch (error) {
        console.error('Error in chat API:', error);
        return NextResponse.json(
        { 
            error: 'Failed to process question',
            details: error instanceof Error ? error.message : 'Unknown error'
        },
        { status: 500 }
        );
    }
}