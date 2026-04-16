import OpenAI from 'openai';
import { logger } from './logger';

/**
 * Singleton Pattern for API/DB Connection
 * Ensures only one instance of the OpenAI client is created in memory
 * and reused across all services, preventing connection saturation.
 */
class OpenAISingleton {
  private static instance: OpenAI;

  private constructor() {}

  public static getInstance(): OpenAI {
    if (!OpenAISingleton.instance) {
      logger.info('Initializing OpenAI Singleton connection');
      OpenAISingleton.instance = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY || 'dummy_build_key',
      });
    }
    return OpenAISingleton.instance;
  }
}

export const openai = OpenAISingleton.getInstance();
