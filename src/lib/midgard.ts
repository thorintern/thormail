import { MidgardActionListDTO } from "../types/midgard";

export async function fetchMessages() {
  try {
    const response = await fetch('/api/midgard', {
      next: { revalidate: 30 } // 30 seconds
    });
    
    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const txs: MidgardActionListDTO = await response.json();
    
    const mailTxs = txs.actions.filter((tx) => {
      const memo = tx.metadata?.send?.memo;
      return memo && memo.startsWith("m|");
    });
    
    return mailTxs;
  } catch (error) {
    console.error('Failed to fetch messages:', error);
    throw error;
  }
}
