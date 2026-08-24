export async function sendTelegramMessage(chatId, text, env) {
  const responce = await fetch(
    `https://api.telegram.org/bot${env.CLEVERLIFY_TOKEN}/sendMessage`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    }
    );
  if(!responce.ok) {
    throw new Error(`Telegram API error: ${responce.status}`);
  }
  return responce.json();
}
