import { sendTelegramMessage } from "./telegram/api.js";
import { askGroq } from "./ai/groq.js";

const greeting =
`Добро пожаловать в Cleverlify!

Cleverlify - твой AI-helper в телеграмм. Напиши любой вопрос снизу, и он тебе ответит!`;

export default {
  async fetch(request, env, ctx) {
    const update = await request.json();

    const chatId = update.message?.chat?.id;
    const text = update.message?.text;

    if (!chatId || !text) {
      return new Response("OK");
    }
    

    if(text==="/start") {
      await sendTelegramMessage(chatId, greeting, env);
      }
    try {

      const answer = await askGroq(text, env);
      await sendTelegramMessage(chatId, answer, env);
      return new Response("OK");

    } catch (error) {

      console.error(error);

      await sendTelegramMessage(
        chatId,
        `Произошла ошибка при обращении к AI. ${error.message}`,
        env
      );

      return new Response("Error", { status: 500 });

    }

  }
};