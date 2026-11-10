import OpenAI from "openai";

export const configureOpenAI = () => {
  const baseURL = process.env.OPENAI_BASE_URL || undefined;
  const isCustomBaseURL = Boolean(baseURL && !baseURL.includes("api.openai.com"));

  const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_SECRET || process.env.OPENAI_API_KEY,
    baseURL,
    organization: isCustomBaseURL
      ? undefined
      : process.env.OPENAI_ORGANIZATION_ID || undefined,
    project: isCustomBaseURL
      ? undefined
      : process.env.OPENAI_PROJECT_ID || undefined,
  });
  return openai;
};
