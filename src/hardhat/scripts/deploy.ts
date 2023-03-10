import hre, { ethers } from 'hardhat';
import { BigNumber } from 'ethers';

const BASE_COST = BigNumber.from('650000000000000');
const DEFAULT_IMAGE_COST = BASE_COST.mul(BigNumber.from('250'));
const DEFAULT_IMAGE_COMMISSION = BASE_COST.mul(BigNumber.from('50'));

async function main() {
  console.log('LilypadEvents deploying....');

  let owner: any;
  [owner] = await ethers.getSigners();

  if (hre.network.name == 'filecoinHyperspace') {
    owner = new ethers.Wallet(
      process.env.WALLET_PRIVATE_KEY || '',
      ethers.provider
    );
  }

  const LilypadEvents = await ethers.getContractFactory('LilypadEvents');
  const ArtistAttribution = await ethers.getContractFactory(
    'ArtistAttribution'
  );

  const eventsContract = await LilypadEvents.connect(owner).deploy();
  await eventsContract.deployed();

  console.log('LilypadEvents deployed to ', eventsContract.address);

  const artistContract = await ArtistAttribution.connect(owner).deploy(
    eventsContract.address,
    DEFAULT_IMAGE_COST,
    DEFAULT_IMAGE_COMMISSION
  );
  await artistContract.deployed();

  console.log('ArtistAttribution deployed to ', artistContract.address);

  await eventsContract
    .connect(owner)
    .setAuthorizedContract(artistContract.address);

  console.log(
    'LilypadEvents set authorized contract to: ',
    artistContract.address
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
