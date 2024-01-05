require('@nomicfoundation/hardhat-toolbox')
module.exports = {
  defaultNetwork: 'localhost',
  networks: {
    hardhat: {},
    localhost: {
      url: 'http://127.0.0.1:8545',
    },
    // bitfinity: {
    //   url: 'https://testnet.bitfinity.network',
    //   accounts: [''],
    //   chainId: 355113,
    //   timeout: 120000,
    //   gasPrice: 10 * 10**9,
    // },
  },
  solidity: {
    version: '0.8.19',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  mocha: {
    timeout: 40000,
  },
}
