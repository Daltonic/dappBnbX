const { ethers } = require('hardhat')
const fs = require('fs')

async function deployContract() {
  let contract
  const taxPercent = 7
  const securityFeePercent = 5

  try {
    contract = await ethers.deployContract('DappBnb', [taxPercent, securityFeePercent])
    await contract.waitForDeployment()

    console.log('Contracts deployed successfully.')
    return contract
  } catch (error) {
    console.error('Error deploying contracts:', error)
    throw error
  }
}

async function saveContractAddress(contract) {
  try {
    const address = JSON.stringify(
      {
        dappBnbContract: contract.target,
      },
      null,
      4
    )

    fs.writeFile('./contracts/contractAddress.json', address, 'utf8', (error) => {
      if (error) {
        console.error('Error saving contract address:', err)
      } else {
        console.log('Deployed contract address:', address)
      }
    })
  } catch (error) {
    console.error('Error saving contract address:', error)
    throw error
  }
}

async function main() {
  let contract

  try {
    contract = await deployContract()
    await saveContractAddress(contract)

    console.log('Contract deployment completed successfully.')
  } catch (error) {
    console.error('Unhandled error:', error)
  }
}

main().catch((error) => {
  console.error('Unhandled error:', error)
  process.exitCode = 1
})
