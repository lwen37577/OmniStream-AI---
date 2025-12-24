import { GoogleGenAI, Type, Schema } from "@google/genai";
import { PlatformId, GeneratedContent } from "../types";

// Define the response schema for Gemini to ensure structured JSON output
const contentSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    youtube: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        tags: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["title", "description", "tags"],
    },
    douyin: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        tags: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["title", "description", "tags"],
    },
    xiaohongshu: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        tags: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["title", "description", "tags"],
    },
    wechat: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        tags: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["title", "description", "tags"],
    },
    kuaishou: {
      type: Type.OBJECT,
      properties: {
        title: { type: Type.STRING },
        description: { type: Type.STRING },
        tags: { type: Type.ARRAY, items: { type: Type.STRING } },
      },
      required: ["title", "description", "tags"],
    },
  },
};

export const generatePlatformContent = async (
  apiKey: string,
  videoContext: string
): Promise<Record<PlatformId, GeneratedContent> | null> => {
  if (!apiKey) {
    alert("请先点击右上角设置图标，输入您的 Google Gemini API Key");
    return null;
  }

  try {
    // Initialize AI with the user-provided key
    const ai = new GoogleGenAI({ apiKey: apiKey });

    const prompt = `
      You are an expert social media manager for the Chinese market.
      I have a video with the following context/summary: "${videoContext}".

      Please generate optimized metadata (Title, Description, Tags) in CHINESE (Simplified) for the following platforms:
      1. YouTube (SEO focused, Bilingual English/Chinese title if appropriate, detailed description)
      2. Douyin (TikTok China) (Catchy, short, viral hooks, trending memes)
      3. Xiaohongshu (Little Red Book) (Emoji heavy, lifestyle vibe, "Note" style, emotional connection)
      4. WeChat Channels (Professional, engaging, slightly more formal than Douyin)
      5. Kuaishou (Down-to-earth, direct, high energy)

      Ensure the tone matches each platform's unique culture in China.
      Return the result in strictly structured JSON.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: contentSchema,
        temperature: 0.7,
      },
    });

    const text = response.text;
    if (!text) return null;

    const data = JSON.parse(text);
    return data as Record<PlatformId, GeneratedContent>;

  } catch (error) {
    console.error("Gemini generation error:", error);
    alert("生成失败，请检查您的 API Key 是否正确，或网络是否通畅。");
    return null;
  }
};