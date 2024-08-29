import { GoogleGenerativeAI } from "@google/generative-ai";
import logger from '../services/logger';
import dotenv from 'dotenv';
import { ILlmService } from "./ILlmService";

dotenv.config();

export class LLMService implements ILlmService {
    private apiKey: string;

    constructor() {
        this.apiKey = process.env.GEMINI_API_KEY || '';
        if (!this.apiKey) {
            const errorMessage = "A chave da API (GEMINI_API_KEY) não está definida.";
            logger.error(errorMessage);
            throw new Error(errorMessage);
        }
    }

    public async extractValueFromLLM(base64Image: string): Promise<number> {
        try {
            logger.info('Iniciando extração de valor do LLM', { base64ImageLength: base64Image.length });

            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey) {
                const errorMessage = "A chave da API (GEMINI_API_KEY) não está definida.";
                logger.error(errorMessage);
                throw new Error(errorMessage);
            }

            const genAI = new GoogleGenerativeAI(apiKey);
            const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

            const prompt = "Leia a imagem e extraia o número encontrado na imagem.";
            const image = {
                inlineData: {
                    data: base64Image,
                    mimeType: "image/png",
                },
            };

            logger.info('Enviando solicitação ao modelo Gemini', { prompt });

            const result = await model.generateContent([prompt, image]);

            const responseText = result.response.text();
            logger.info('Texto extraído do modelo', { responseText });

            const regex = /\d+/g;
            const match = responseText.match(regex);

            if (match) {
                const extractedNumber = parseInt(match[0]);
                logger.info('Número extraído com sucesso', { extractedNumber });
                return extractedNumber;
            } else {
                const errorMessage = "Nenhum número foi encontrado na resposta do modelo.";
                logger.error(errorMessage, { responseText });
                throw new Error(errorMessage);
            }
        } catch (error) {
            logger.error('Erro ao chamar a Google Cloud Vision API:', { error });
            throw new Error('Erro ao chamar a Google Cloud Vision API');
        }
    }
}
