import { getHistory, addMessage } from "./history.js";

export async function askGroq(chatId, text, env) {
  addMessage(chatId, "user", text);

  const history = getHistory(chatId);

  const messages = [
    {
      role: "system",
      content: "Ты полезный AI-ассистент в Telegram.",
    },
    ...history,
  ];

  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.GROQ_KEY}`,
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages,
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Groq API ${response.status}: ${
        data.error?.message || "Unknown error"
      }`
    );
  }

  const answer = data.choices[0].message.content;

  addMessage(chatId, "assistant", answer);

  return answer;
}