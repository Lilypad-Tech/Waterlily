import minimist from 'minimist'
import bluebird from 'bluebird'
import { getContract } from './utils'

const args = minimist(process.argv, {
  default:{
    contract: process.env.CONTRACT_ADDRESS,
    id: process.env.ID,
  },
})

async function main() {
  if(!args.contract) throw new Error('no CONTRACT_ADDRESS env provided')
  if(!args.id) throw new Error('no ID env provided')
  const {
    contract,
  } = await getContract(args.contract)
  await contract.deleteArtist(args.id)
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
