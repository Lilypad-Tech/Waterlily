import hre, { ethers } from 'hardhat'
import minimist from 'minimist'
import {
  DEFAULT_IMAGE_COST,
} from './utils'

const args = minimist(process.argv, {
  default:{
    contract: process.env.CONTRACT,
    artist: process.env.ARTIST,
    prompt: process.env.PROMPT,
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

  if(args.contract == '') throw new Error('no contract address provided')
  if(args.artist == '') throw new Error('no artist id provided')
  if(args.prompt == '') throw new Error('no prompt provided')

  const ArtistAttribution = await ethers.getContractFactory("ArtistAttribution")
  const artistContract = ArtistAttribution.attach(args.contract)

  const trx = await artistContract.connect(owner).StableDiffusion(args.artist, args.prompt, {
    value: DEFAULT_IMAGE_COST,
  })
  await trx.wait()

  const imageIDS = await artistContract.getImageIDs()
  const image = await artistContract.getImage(imageIDS[imageIDS.length-1])
  
  console.dir(`image ID: ${imageIDS[imageIDS.length-1].toString()}`)
  console.log(JSON.stringify(image, null, 4))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
