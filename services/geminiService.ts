import { GoogleGenAI, Type, Schema } from "@google/genai";
import { Question, QuestionType } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const questionSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    type: { type: Type.STRING, enum: [
      'translate_to_target',
      'translate_to_native',
      'multiple_choice',
      'listening'
    ]},
    prompt: { type: Type.STRING },
    correctAnswer: { type: Type.STRING },
    options: {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: "Only required for multiple_choice type. Provide 3 incorrect and 1 correct answer."
    },
    audioText: { type: Type.STRING, description: "Text to be spoken for listening exercises." }
  },
  required: ['id', 'type', 'prompt', 'correctAnswer']
};

const lessonSchema: Schema = {
  type: Type.ARRAY,
  items: questionSchema,
  description: "A list of 5 language learning questions."
};

export const generateLessonContent = async (topic: string, targetLang: string, nativeLang: string): Promise<Question[]> => {
  if (!process.env.API_KEY) {
    console.warn("No API Key provided. Returning mock data.");
    return getMockLesson(topic);
  }

  try {
    const prompt = `
      Create a language lesson for a beginner learning ${targetLang} from ${nativeLang}.
      Topic: ${topic}.
      Generate 5 varied questions.
      Ensure the difficulty is appropriate for a beginner app like Duolingo.
      For 'translate_to_target', the prompt is in ${nativeLang}, answer in ${targetLang}.
      For 'translate_to_native', the prompt is in ${targetLang}, answer in ${nativeLang}.
      For 'listening', provide the text in 'audioText' that needs to be typed or selected.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: lessonSchema,
        temperature: 0.7
      }
    });

    const text = response.text;
    if (!text) throw new Error("Empty response from AI");
    
    return JSON.parse(text) as Question[];

  } catch (error) {
    console.error("Failed to generate lesson with AI:", error);
    return getMockLesson(topic);
  }
};

export const checkPronunciation = async (userText: string, expectedText: string): Promise<{score: number, feedback: string}> => {
    // In a real app with backend, we might send audio. 
    // Here we can use Gemini to compare the phonetic closeness if we had phonetic input, 
    // or simply semantic closeness if using speech-to-text.
    // For this demo, we simulate a check.
    
    // Simulating an AI check delay
    await new Promise(r => setTimeout(r, 500));
    
    const normalizedUser = userText.toLowerCase().trim();
    const normalizedExpected = expectedText.toLowerCase().trim();

    if (normalizedUser === normalizedExpected) {
        return { score: 100, feedback: "Perfect pronunciation!" };
    } else {
        return { score: 50, feedback: "Close, but try to enunciate clearly." };
    }
};

const getMockLesson = (topic: string): Question[] => {
  // Fallback if API fails or no key
  return [
    {
      id: '1',
      type: QuestionType.MULTIPLE_CHOICE,
      prompt: `How do you say "Hello" in French?`,
      correctAnswer: 'Bonjour',
      options: ['Bonjour', 'Au revoir', 'Merci', 'Oui']
    },
    {
      id: '2',
      type: QuestionType.TRANSLATE_TO_NATIVE,
      prompt: 'Je mange une pomme',
      correctAnswer: 'I eat an apple',
    },
    {
      id: '3',
      type: QuestionType.TRANSLATE_TO_TARGET,
      prompt: 'The cat',
      correctAnswer: 'Le chat',
    },
     {
      id: '4',
      type: QuestionType.LISTENING,
      prompt: 'Type what you hear',
      audioText: 'Merci beaucoup',
      correctAnswer: 'Merci beaucoup',
    },
    {
      id: '5',
      type: QuestionType.MULTIPLE_CHOICE,
      prompt: `Which of these is "Red"?`,
      correctAnswer: 'Rouge',
      options: ['Bleu', 'Rouge', 'Vert', 'Jaune']
    },
  ];
};
