import hre, { ethers } from 'hardhat'
import {
  DEFAULT_ARTIST_COST,
  DEFAULT_IMAGE_COST,
  DEFAULT_IMAGE_COMMISSION,
} from './utils'

async function main() {
  console.log('ArtistAttribution deploying....')

  let owner: any
  [owner] = await ethers.getSigners()

  if(hre.network.name == 'filecoinHyperspace' || hre.network.name == 'filecoinMainnet') {
    owner = new ethers.Wallet(
      process.env.WALLET_PRIVATE_KEY || '',
      ethers.provider
    )
  }

  const ArtistAttribution = await ethers.getContractFactory('ArtistAttribution')

  const artistContract = await ArtistAttribution.connect(owner).deploy(
    DEFAULT_ARTIST_COST,
    DEFAULT_IMAGE_COST,
    DEFAULT_IMAGE_COMMISSION,
  )
  await artistContract.deployed()

  console.log('ArtistAttribution deployed to ', artistContract.address)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
