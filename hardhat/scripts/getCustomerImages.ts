import minimist from 'minimist';
import { getContract } from './utils';

const args = minimist(process.argv, {
  default: {
    contract: process.env.CONTRACT,
  },
});

async function main() {
  const { contract, owner } = await getContract(args.contract);

  const result = await contract.getCustomerImages(owner.address);
  console.log('--------------------------------------------');
  console.dir(result);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
