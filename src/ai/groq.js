export async function askGroq(message, env) {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${env.GROQ_KEY}`
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-120b",
        messages: [
          {
            role: "system",
            content: "Ты полезный Telegram-ассистент."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7
      })
    }
  );

  if (!response.ok) {
  const errorText = await response.text();

  throw new Error(
    `Groq API ${response.status}:\n${errorText}`
  );
}

  const data = await response.json();

  return data.choices?.[0]?.message?.content || "Не удалось получить ответ.";
}