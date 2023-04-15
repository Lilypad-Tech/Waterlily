enum currentNetworkType {
  Testnet = 'testnet',
  Mainnet = 'mainnet',
}

export const currentNetwork: currentNetworkType = currentNetworkType.Testnet; //or 'mainnet'

export const networks = {
  filecoinHyperspace: {
    name: 'Filecoin Hyperspace Testnet',
    apiServer: 'https://staging.api.waterlily.cluster.world',
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
      'https://fvm.starboard.ventures/hyperspace/explorer/tx/',
      'https://hyperspace.filscan.io/',
    ],
    contracts: {
      WATERLILY_CONTRACT_ADDRESS: '0xd8Cc461fe24F1ACEBB7e8ffcA8955eaB5341c19f',
      WATERLILY_NFT_CONTRACT_ADDRESS:
        '0x3619c1f295B3081985e581Ea3b8546CE629C5A3D',
    },
    imageUrlRoot: `https://staging.api.waterlily.cluster.world/api/v1/images/`,
  },
  filecoinMainnet: {
    name: 'Filecoin Mainnet',
    apiServer: 'https://api.waterlily.cluster.world',
    chainId: '0x13a',
    rpc: ['https://api.node.glif.io'],
    // wss: ['wss://wss.node.glif.io/apigw/lotus/rpc/v1'],
    nativeCurrency: {
      name: 'Filecoin',
      symbol: 'FIL',
      decimals: 18,
    },
    blockExplorer: [
      'https://fvm.starboard.ventures/explorer/tx/',
      'https://filfox.info/tx/',
    ],
    contracts: {
      WATERLILY_CONTRACT_ADDRESS: '0x24c6C64650E4E27Ca6EfBE9C23B963e001499222',
      WATERLILY_NFT_CONTRACT_ADDRESS:
        '0x19063437B9E1F9A5c4C96A0DC7Bd785564328bEE',
    },
    imageUrlRoot: `https://api.waterlily.cluster.world/api/v1/images/`,
  },
};

export const getParam = (field: string = '') => {
  // console.log('url', window.location.href);
  const urlSearchParams = new URLSearchParams((window as any).location.search);
  // const hasParam = urlSearchParams.has(field);
  // console.log('url hasparam', hasParam);
  const params = Object.fromEntries(urlSearchParams.entries());
  return params[field] || '';
};

export const getNetwork = () => {
  if (typeof window === 'undefined') {
    return networks.filecoinHyperspace;
  }
  let currentNetworkName: string = getParam('waterlilyNetwork') || '';
  if (
    window.location &&
    window.location.hostname == 'localhost' &&
    !currentNetworkName
  ) {
    return networks.filecoinHyperspace;
  }

  if (currentNetworkName == 'filecoinHyperspace')
    return networks.filecoinHyperspace;
  return networks.filecoinMainnet;
};

export const getAPIServer = (path: string = '') => {
  const network = getNetwork();
  const host = getParam('testAPI')
    ? 'http://localhost:3500'
    : network.apiServer;
  return `${host}/api/v1${path}`;
};
