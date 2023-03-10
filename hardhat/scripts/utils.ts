import hre, { ethers } from 'hardhat'
import { BigNumber } from 'ethers'

export const BASE_COST = BigNumber.from('650000000000000')
export const DEFAULT_IMAGE_COST = BASE_COST.mul(BigNumber.from('250'))
export const DEFAULT_IMAGE_COMMISSION = BASE_COST.mul(BigNumber.from('50'))

export const getContract = async (address = '') => {
  let owner: any
  [owner] = await ethers.getSigners()

  if(hre.network.name == 'filecoinHyperspace') {
    address = process.env.ARTIST_CONTRACT_ADDRESS || ''
    owner = new ethers.Wallet(
      process.env.WALLET_PRIVATE_KEY || '',
      ethers.provider
    )
  }

  if(!address) throw new Error('no ADDRESS env provided')

  const ArtistAttribution = await ethers.getContractFactory("ArtistAttribution")
  const contract = ArtistAttribution.attach(address)

  return {
    owner,
    contract,
  }
}


export const getEventsContract = async (address = '') => {
  let owner: any
  [owner] = await ethers.getSigners()

  if(hre.network.name == 'filecoinHyperspace') {
    address = process.env.CONTRACT_ADDRESS || ''
    owner = new ethers.Wallet(
      process.env.WALLET_PRIVATE_KEY || '',
      ethers.provider
    )
  }

  if(!address) throw new Error('no ADDRESS env provided')

  const LilypadEvents = await ethers.getContractFactory("LilypadEvents")
  const contract = LilypadEvents.attach(address)

  return {
    owner,
    contract,
  }
}