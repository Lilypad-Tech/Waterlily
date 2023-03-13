declare let window: any;
import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
} from 'react';
import { ethers } from 'ethers';
import Web3 from 'web3';
import { StatusState, StatusContext, defaultStatusState } from '.';
import { WATERLILY_CONTRACT_ADDRESS } from '@/definitions';
import WaterlilyABI from '../abi/ArtistAttribution.sol/ArtistAttribution.json';
import { INITIAL_TRANSACTION_STATE } from '@/utils/definitions/consts';

const plainSubmit = async () => {
  const artistID = 'YOUR_ARTIST_ID';
  const prompt = 'YOUR_PROMPT';
  // const value = ethers.utils.parseUnits('0.1', 18);
  const value = ethers.utils.parseEther('0.1'); // Set the amount of ether you want to send here

  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const waterlilyContract = new ethers.Contract(
    WATERLILY_CONTRACT_ADDRESS,
    WaterlilyABI.abi,
    signer
  );
  // Create the transaction object with the specified gas limit
  const tx = {
    to: waterlilyContract.address,
    from: await signer.getAddress(),
    value: value.toString(),
    data: waterlilyContract.interface.encodeFunctionData('StableDiffusion', [
      artistID,
      prompt,
    ]),
    gasLimit: 900000, // Set your desired gas limit here
  };

  // Send the transaction using window.ethereum
  window.ethereum
    .request({
      method: 'eth_sendTransaction',
      params: [tx],
    })
    .then((txHash: string) => {
      console.log(`Transaction sent: ${txHash}`);
    })
    .catch((error: Error) => {
      console.error(`Error sending transaction: ${error}`);
    });
};

const testNetwork = async () => {
  // const rpcEndpointUrl = 'https://example.com/rpc';
  // const provider = new ethers.providers.JsonRpcProvider(rpcEndpointUrl);

  // provider
  //   .getBlockNumber()
  //   .then((blockNumber) => {
  //     console.log(
  //       `The latest block number on ${rpcEndpointUrl} is ${blockNumber}`
  //     );
  //   })
  //   .catch((error) => {
  //     console.error(`Failed to connect to ${rpcEndpointUrl}: ${error}`);
  //   });

  if (window.ethereum) {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const network = await provider.getNetwork();
    console.log('network', network); // will log information about the network if connected
    if (network) {
      return true;
    }
  } else {
    console.log('No ethereum provider detected');
  }
  return false;
};

const submitJob = async (
  prompt: string,
  artistid: string,
  timeout: number = 60000 // default timeout of 60 seconds
) => {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  const waterlilyContract = new ethers.Contract(
    WATERLILY_CONTRACT_ADDRESS,
    WaterlilyABI.abi,
    signer
  );

  const k = ethers.utils.parseUnits('0.1', 18);
  const imageCost = ethers.utils.parseEther('0.1');
  const gasLimit: string = ethers.utils.hexlify(9000000);

  try {
    // setStatusState({
    //   ...statusState,
    //   isLoading: 'Submitting job to the network ...',
    //   isMessage: false,
    //   message: { title: '', description: '' },
    // });

    const tx = await waterlilyContract.StableDiffusion(prompt, artistid, {
      value: k,
      gasLimit: gasLimit,
    });
    console.log('tx', tx);

    // setStatusState({
    //   ...statusState,
    //   isLoading: `Waiting for the transaction ${tx.hash} to be included in a block...`,
    //   isMessage: false,
    //   message: { title: '', description: '' },
    // });

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => {
        reject(new Error('Transaction timed out'));
      }, timeout)
    );

    try {
      const receipt: ethers.ContractReceipt = await Promise.race([
        tx.wait(),
        timeoutPromise,
      ]);

      // setStatusState({
      //   ...statusState,
      //   isLoading: '',
      //   isMessage: true,
      //   message: {
      //     title: `Transaction confirmed: ${receipt.transactionHash}`,
      //     description: 'Your job has been submitted to the network.',
      //   },
      // });
    } catch (error: any) {
      console.log('there was an error or timeout', error);
      if (error?.message === 'Transaction timed out') {
        //cancel the transaction
        await signer.sendTransaction({
          to: tx.to,
          nonce: await signer.getTransactionCount(),
          gasPrice: 0,
          gasLimit: 21000,
          value: 0,
        });
        // setStatusState({
        //   isError: 'Transaction timed out',
        //   isLoading: '',
        //   isMessage: true,
        //   message: {
        //     title: 'Transaction timed out',
        //     description:
        //       'The transaction took too long to confirm. Please try again later.',
        //   },
        // });
      } else {
        // setStatusState({
        //   isError: 'Receipt: Transaction failed',
        //   isLoading: '',
        //   isMessage: true,
        //   message: {
        //     title: 'Transaction failed',
        //     description:
        //       'There was an error submitting your job to the network. Please try again later.',
        //   },
        // });
      }
    }
  } catch (error) {
    console.log('there was an tx error', error);
    // setStatusState({
    //   isError: 'TX: Transaction failed',
    //   isLoading: '',
    //   isMessage: true,
    //   message: {
    //     title: 'Transaction failed',
    //     description:
    //       'There was an error submitting getting tx from the network. Please try again later.',
    //   },
    // });
  }
};

//works
const getImageIds = async () => {
  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  // const signer = provider.getSigner();
  //connect to contract in write mode
  const provider = new ethers.providers.JsonRpcProvider(
    'https://rpc.ankr.com/filecoin_testnet'
  );
  const waterlilyContract = new ethers.Contract(
    WATERLILY_CONTRACT_ADDRESS,
    WaterlilyABI.abi,
    provider
  );

  const ids = await waterlilyContract.getImageIDs();
  console.log(ids);
};

const callSD = async (prompt: string, artistid: string) => {
  //rpc.ankr.com/filecoin_testnet
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();
  // const signer = new ethers.providers.Web3Provider(
  //   window.ethereum
  // ).getSigner();
  const waterlilyContract = new ethers.Contract(
    WATERLILY_CONTRACT_ADDRESS,
    WaterlilyABI.abi,
    signer
  );

  // Define the function to call the method
  const value = ethers.utils.parseEther('0.1'); // Set the amount of ether you want to send here

  try {
    const tx = await waterlilyContract.StableDiffusion(artistid, prompt, {
      value: value,
    });
    console.log(tx.hash); // Print the transaction hash
    return await tx.wait();
  } catch (error) {
    console.log(error);
  }
};

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// estimate gas cost for the transaction
// const estimatedGas = await provider.estimateGas({
//   to: WATERLILY_CONTRACT_ADDRESS,
//   value: imageCost,
// });
// const estimatedGasCost =
//   await waterlilyContract.estimateGas.StableDiffusion(artistid, prompt);
// console.log('estimated gas cost', estimatedGasCost);
