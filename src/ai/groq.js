import { getHistory, addMessage } from "./history.js";

export async function shouldSearch(text, env) {
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
        temperature: 0,
        messages: [
          {
            role: "system",
            content: `Определи, нужен ли веб-поиск для ответа на сообщение пользователя.

Поиск нужен, если вопрос требует актуальной, свежей или конкретной информации из интернета.

Поиск не нужен, если на вопрос можно ответить на основе общих знаний.

Верни ТОЛЬКО JSON:
{
  "need_search": true,
  "search_query": "поисковый запрос"
}

Если поиск не нужен:
{
  "need_search": false,
  "search_query": ""
}`,
          },
          {
            role: "user",
            content: text,
          },
        ],
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      `Groq search decision ${response.status}: ${
        data.error?.message || "Unknown error"
      }`
    );
  }

  return JSON.parse(data.choices[0].message.content);
}

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