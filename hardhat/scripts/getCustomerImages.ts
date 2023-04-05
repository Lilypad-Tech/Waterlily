import minimist from 'minimist';
import { getContract } from './utils';

const args = minimist(process.argv, {
  default: {
    contract: process.env.CONTRACT_ADDRESS,
  },
});

async function main() {
  if(!args.contract) throw new Error('no CONTRACT_ADDRESS env provided')
  const { contract, owner } = await getContract(args.contract);

  const result = await contract.getCustomerImages(owner.address);
  console.log('--------------------------------------------');
  console.dir(result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
