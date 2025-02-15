const MAX_CONTENT_LENGTH = 200;
import {MidgardActionDTO } from "../types/midgard";
import { ThorMail } from "../types/thormail";

export const convertToMessages = (to: string, content: string): string[] => {
  if (content.length <= MAX_CONTENT_LENGTH) {
    return [`m|1|1|${to}|${content}`];
  }
  const chunks = splitMessage(content);
  return chunks.map((chunk, i) => {
    return `m|${i + 1}|${chunks.length}|${to}|${chunk}`;
  });
};

export function formatActionsToThorMail(actions: MidgardActionDTO[]): ThorMail[] {
  const seenMemos = new Set<string>();
  const thormails = actions
    .map((action) => {
      const sender = action.in[0]?.address;
      const memo = action.metadata?.send?.memo;

      // Skip if memo is invalid or already seen
      if (!memo || !memo.startsWith('m|') || seenMemos.has(memo)) return null;

      const parts = memo.split("|");
      // Ensure we have at least 5 parts (full memo structure)
      if (parts.length < 5) return null;

      const recipient = parts[3];
      const content = parts[4];

      if(!recipient || !content) return null;

      // Mark this memo as seen
      seenMemos.add(memo);

      return {
        from: sender,
        recipient,
        content,
        timestamp: new Date(action.date).getTime()
      };
    })
    .filter((mail) => mail !== null)
    .sort((a, b) => b.timestamp - a.timestamp) as ThorMail[];

  return thormails;
};

const splitMessage = (content: string) => {
  const chunks = [];
  let i = 0;
  while (i < content.length) {
    chunks.push(content.slice(i, i + MAX_CONTENT_LENGTH));
    i += MAX_CONTENT_LENGTH;
  }
  return chunks;
};
