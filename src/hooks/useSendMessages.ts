import { useSwapKit } from "../lib/swapkit";
import { AssetValue, Chain } from "@swapkit/sdk";
import { toast } from 'sonner';

import { convertToMessages } from "../lib/message";
import { THORMAIL_ADDRESS } from "@/lib/constants";

export function useSendMessages() {
  const { swapKit } = useSwapKit();

  const sendMessages = async ({
    from,
    to,
    content,
  }: {
    from: string;
    to: string;
    content: string;
  }) => {
    const messages = convertToMessages(to, content);

    try {
      for (const message of messages) {
        const _to = to === 'all' ? THORMAIL_ADDRESS : to;
        await swapKit?.transfer({
          assetValue: AssetValue.from({ chain: Chain.THORChain, value: 0.02 }),
          from,
          recipient: _to,
          memo: message,
        });
      }
      
      toast('Message sent successfully!', {
        className: 'bg-pink-50 text-pink-600 border-pink-200',
        position: 'top-center',
        duration: 3000
      });
      return true;
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error('Failed to send message', {
        className: 'bg-red-50 text-red-600 border-red-200',
        position: 'top-center',
        duration: 3000
      });
      return false;
    }
  };

  return { sendMessages };
}
