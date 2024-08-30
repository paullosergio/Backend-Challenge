export interface ILlmService {
    extractValueFromLLM(base64Image: string): Promise<number>;
}