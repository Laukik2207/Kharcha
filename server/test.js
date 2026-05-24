import 'dotenv/config';
import { GoogleGenerativeAI } from '@google/generative-ai';

async function run() {
  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${process.env.GEMINI_API_KEY}`);
    const data = await response.json();
    console.log('Available models:', data.models?.map(m => m.name).join(', ') || data);
  } catch (error) {
    console.error('Error fetching models:', error);
  }
}

run();
