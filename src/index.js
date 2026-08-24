import { sendTelegramMessage } from "./telegram/api.js";

export default {
  async fetch(request, env, ctx) {
    const update = await request.json();

    const chatId = update.message?.chat?.id;
    const text = update.message?.text;

    if (!chatId || !text) {
      return new Response("OK");
    }

    await sendTelegramMessage(chatId, `Ты написал: ${text}`, env);

    return new Response("OK");
  }
};