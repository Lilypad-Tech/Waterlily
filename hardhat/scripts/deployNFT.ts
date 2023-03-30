import hre, { ethers } from 'hardhat';

import type { WaterlilyNFT } from '../typechain-types/contracts/WaterlilyNFT';
import type { WaterlilyNFT__factory } from '../typechain-types/factories/contracts/WaterlilyNFT__factory';

async function main() {
  console.log('WaterlilyNFT deploying....');

  const owner = new hre.ethers.Wallet(
    process.env.WALLET_PRIVATE_KEY || 'undefined',
    hre.ethers.provider
  );
  const waterlilyNFTFactory: WaterlilyNFT__factory = <WaterlilyNFT__factory>(
    await hre.ethers.getContractFactory('WaterlilyNFT', owner)
  );

  const waterlilyNFT: WaterlilyNFT = <WaterlilyNFT>(
    await waterlilyNFTFactory.deploy()
  );
  await waterlilyNFT.deployed();
  console.log('waterlilyNFT deployed to ', waterlilyNFT.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//Run me: npx hardhat run scripts/deployNFT.ts --network filecoinHyperspace
// Deployed on Hyperspace: 0x3619c1f295B3081985e581Ea3b8546CE629C5A3D
