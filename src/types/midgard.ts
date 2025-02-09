export interface CosmosCoinDTO {
  asset: string;
  amount: string;
  denom?: string;
  decimals?: number;
}

export interface MidgardActionMetadataDTO {
  send?: {
    memo: string;
    networkFees: CosmosCoinDTO[];
    txID: string;
  };
  swap?: {
    affiliateAddress: string;
    affiliateFee: string;
    isStreamingSwap: boolean;
    liquidityFee: string;
    networkFees: CosmosCoinDTO[];
    streamingSwapMeta?: {
      count: string;
      depositedCoin: CosmosCoinDTO;
      inCoin: CosmosCoinDTO;
      interval: string;
      lastHeight: string;
      outCoin: CosmosCoinDTO;
      quantity: string;
    };
    swapSlip: string;
    swapTarget: string;
  };
  refund?: {
    affiliateAddress: string;
    affiliateFee: string;
    memo: string;
    networkFees: CosmosCoinDTO[];
    reason: string;
  };
}

export interface MidgardActionDTO {
  date: string;
  height: string;
  in: {
    address: string;
    coins: CosmosCoinDTO[];
    txID: string;
  }[];
  metadata: MidgardActionMetadataDTO;
  out: {
    address: string;
    coins: CosmosCoinDTO[];
    height: string;
    txID: string;
  }[];
  pools: string[];
  status: string;
  type: string;
}

export interface MidgardActionListDTO {
  actions: MidgardActionDTO[];
  meta: {
    nextPageToken: string;
    prevPageToken: string;
  };
  count: string;
}
