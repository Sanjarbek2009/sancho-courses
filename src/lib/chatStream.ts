type ChatClient = (message: string) => void;

const clients = new Set<ChatClient>();

export function registerClient(client: ChatClient) {
  clients.add(client);
  return () => {
    clients.delete(client);
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function broadcastMessage(message: any) {
  const data = JSON.stringify(message);
  clients.forEach((client) => {
    try {
      client(data);
    } catch (e) {
      console.error('Failed to send message to client', e);
    }
  });
}
