import { getHistory, addMessage } from "./history.js";

export async function askGroq(chatId, text, env) {
  addMessage(chatId, "user", text);

  const history = getHistory(chatId);

  const messages = [
    {
      role: "system",
      content: `Ты отвечаешь в Telegram.

Форматирование:
- Используй Telegram HTML.
- Для жирного текста используй <b>текст</b>.
- Для курсива используй <i>текст</i>.
- Для кода используй <code>код</code>.
- Для блоков кода используй <pre>код</pre>.
- Используй обычные списки с символами • или —.
- НИКОГДА не используй Markdown-таблицы вида | ... | ... |.
- Не используй Markdown-заголовки вида # Заголовок.
- Не добавляй лишнее форматирование.
- Сохраняй понятную структуру ответа с короткими абзацами.

Пример:

<b>Главные темы</b>

• Единобожие — вера в единого Бога.
• Пророчество — история пророков.
• Этика — справедливость, милосердие и честность.

<b>Вывод</b>
Краткий вывод здесь.`,
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