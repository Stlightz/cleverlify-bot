const sessions = new Map();

export function getHistory(chatId) {
  if (!sessions.has(chatId)) {
    sessions.set(chatId, []);
  }

  return sessions.get(chatId);
}

export function addMessage(chatId, role, content) {
  const history = getHistory(chatId);

  history.push({
    role,
    content,
  });
}

export function clearHistory(chatId) {
  sessions.delete(chatId);
}