import hre, { ethers } from 'hardhat'
import minimist from 'minimist'

const args = minimist(process.argv, {
  default:{
    contract: process.env.CONTRACT,
    artist: process.env.ARTIST,
    address: process.env.ADDRESS,
    meta: process.env.META,
  },
})

async function main() {
  let owner: any
  [owner] = await ethers.getSigners()

  if(hre.network.name == 'filecoinHyperspace') {
    args.contract = process.env.ARTIST_CONTRACT_ADDRESS
    owner = new ethers.Wallet(
      process.env.WALLET_PRIVATE_KEY || '',
      ethers.provider
    )
  }

  if(!args.contract) throw new Error('no CONTRACT env provided')
  if(!args.artist) throw new Error('no ARTIST env provided')
  if(!args.address) throw new Error('no ADDRESS env provided')

  const ArtistAttribution = await ethers.getContractFactory("ArtistAttribution")
  const artistContract = ArtistAttribution.attach(args.contract)

  await artistContract.connect(owner).updateArtist(args.artist, args.address, args.meta || '')

  const artistIDs = await artistContract.getArtistIDs()

  console.log('--------------------------------------------')
  console.dir(artistIDs)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
