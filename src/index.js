export default {
  async fetch(request, env, ctx) {
    return new Response("AI Telegram Bot is alive!");
  }

 import {sendTelegramMessage} from "./telegram/api.js";
 await sendTelegramMessage(chatId, text, env);
};
