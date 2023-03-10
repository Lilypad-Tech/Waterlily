import minimist from 'minimist'
import { getContract } from './utils'

const args = minimist(process.argv, {
  default:{
    contract: process.env.CONTRACT,
    imageCost: process.env.IMAGE_COST,
    artistCommission: process.env.ARTIST_COMMISSION,
  },
})

async function main() {
  if(!args.contract) throw new Error('no CONTRACT env provided')
  if(!args.imageCost) throw new Error('no IMAGE_COST env provided')
  if(!args.artistCommission) throw new Error('no ARTIST_COMMISSION env provided')

  const imageCost = parseInt(args.imageCost)
  const artistCommission = parseInt(args.artistCommission)

  if(isNaN(imageCost)) throw new Error('IMAGE_COST is not a number')
  if(isNaN(artistCommission)) throw new Error('ARTIST_COMMISSION is not a number')
  
  const {
    contract,
    owner,
  } = await getContract(args.contract)

  const trx = await contract.connect(owner).updateCost(imageCost, artistCommission)
  await trx.wait()

  const imageCostOutput = await contract.getImageCost()
  const artistCommissionOutput = await contract.getArtistCommission()
  console.log('--------------------------------------------')
  console.dir({
    imageCost: imageCostOutput,
    artistCommission: artistCommissionOutput,
  })
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
