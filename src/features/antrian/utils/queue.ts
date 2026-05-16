export type QueueDisplayInput = {
  publicCode?: string;
  prefixCode: string;
};

export function normalizeQueueCode(input: string) {
  return input.trim().toUpperCase();
}

export function generateQueueCode(prefixCode: string) {
  const randomPart = Math.random().toString(36).slice(2, 8).toUpperCase().padEnd(6, "0");
  return `${prefixCode}-${randomPart}`;
}

export function getQueueDisplayCode(queue: QueueDisplayInput) {
  return queue.publicCode ?? `${queue.prefixCode}-UNSET`;
}
