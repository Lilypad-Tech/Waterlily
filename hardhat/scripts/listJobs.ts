import minimist from 'minimist'
import { getEventsContract } from './utils'

const args = minimist(process.argv, {
  default:{
    contract: process.env.EVENTS_CONTRACT,
  },
})

async function main() {
  const {
    contract,
  } = await getEventsContract(args.contract)
  const jobs = await contract.fetchAllJobs()
  console.log(JSON.stringify(jobs, null, 4))
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
