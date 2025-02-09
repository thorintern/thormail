const MAX_CONTENT_LENGTH = 200;

export const convertToMessages = (to: string, content: string): string[] => {
  if (content.length <= MAX_CONTENT_LENGTH) {
    return [`m|1|1|${to}|${content}`];
  }
  const chunks = splitMessage(content);
  return chunks.map((chunk, i) => {
    return `m|${i + 1}|${chunks.length}|${to}|${chunk}`;
  });
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
