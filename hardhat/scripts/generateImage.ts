import hre, { ethers } from 'hardhat';
import minimist from 'minimist';
import { getContract } from './utils';

const args = minimist(process.argv, {
  default: {
    contract: process.env.CONTRACT_ADDRESS,
    artist: process.env.ARTIST,
    prompt: process.env.PROMPT,
  },
});

async function main() {
  if(!args.contract) throw new Error('no CONTRACT_ADDRESS env provided')
  if (args.artist == '') throw new Error('no artist id provided');
  if (args.prompt == '') throw new Error('no prompt provided');

  const { contract, owner } = await getContract(args.contract);

  const imageCost = await contract.getImageCost();
  const trx = await contract
    .connect(owner)
    .CreateImage(args.artist, args.prompt, {
      value: imageCost,
    });
  await trx.wait();

  const imageIDS = await contract.getImageIDs();
  const image = await contract.getImage(imageIDS[imageIDS.length - 1]);

  console.dir(`image ID: ${imageIDS[imageIDS.length - 1].toString()}`);
  console.log(JSON.stringify(image, null, 4));
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
