import minimist from 'minimist'
import { getContract } from './utils'

const args = minimist(process.argv, {
  default:{
    contract: process.env.CONTRACT,
    artist: process.env.ARTIST,
    address: process.env.ADDRESS,
    meta: process.env.META,
  },
})

async function main() {
  if(!args.contract) throw new Error('no CONTRACT env provided')
  if(!args.artist) throw new Error('no ARTIST env provided')
  if(!args.address) throw new Error('no ADDRESS env provided')

  const {
    contract,
    owner,
  } = await getContract(args.contract)

  const trx = await contract.connect(owner).updateArtist(args.artist, args.address, args.meta || '')
  await trx.wait()
  const artistIDs = await contract.getArtistIDs()

  console.log('--------------------------------------------')
  console.dir(artistIDs)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
