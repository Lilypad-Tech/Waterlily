import minimist from 'minimist'
import bluebird from 'bluebird'
import { getContract } from './utils'

const args = minimist(process.argv, {
  default:{
    contract: process.env.CONTRACT,
  },
})

async function main() {
  const {
    contract,
  } = await getContract(args.contract)
  const artistIDs = await contract.getArtistIDs()
  const artists = await bluebird.map(artistIDs, async (artistID) => {
    const artist = await contract.getArtist(artistID)
    return artist
  })
  console.log(JSON.stringify(artists, null, 4))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
