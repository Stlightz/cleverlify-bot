import { sendTelegramMessage } from "./telegram/api.js";

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
      await sendTelegramMessage
    await sendTelegramMessage(chatId, `Ты написал: ${text}`, env);

    return new Response("OK");
  }
};