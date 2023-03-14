enum currentNetworkType {
  Testnet = 'testnet',
  Mainnet = 'mainnet',
}

export const currentNetwork: currentNetworkType = currentNetworkType.Testnet; //or 'mainnet'

export interface NetworkData {
  name: string;
  chainId: string;
  rpc: string[];
  nativeCurrency: {
    name: string;
    symbol: string;
    decimals: number;
  };
  blockExplorer: string[];
}

export const networks = {
  filecoinHyperspace: {
    name: 'Filecoin Hyperspace Testnet',
    chainId: '0xc45',
    rpc: [
      'https://api.hyperspace.node.glif.io/rpc/v1',
      'https://filecoin-hyperspace.chainstacklabs.com/rpc/v1',
      'https://rpc.ankr.com/filecoin_testnet',
    ],
    nativeCurrency: {
      name: 'tFIL',
      symbol: 'tFIL',
      decimals: 18,
    },
    blockExplorer: [
      'https://fvm.starboard.ventures/transactions/',
      'https://hyperspace.filscan.io/',
    ],
  },
  filecoinMainnet: {
    name: 'Filecoin Mainnet',
    chainId: '0xc45',
    rpc: [
      'https://rpc.ankr.com/filecoin_testnet',
      'https://api.hyperspace.node.glif.io/rpc/v1',
      'https://filecoin-hyperspace.chainstacklabs.com/rpc/v1',
    ],
    nativeCurrency: {
      name: 'tFIL',
      symbol: 'tFIL',
      decimals: 18,
    },
    blockExplorer: [
      'https://fvm.starboard.ventures/transactions/',
      'https://hyperspace.filscan.io/',
      'https://beryx.zondax.chfor',
    ],
  },
};
