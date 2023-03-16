// declare let window: any;
// import React, {
// createContext,
// useState,
// Dispatch,
// SetStateAction,
// useContext,
// useEffect,
// } from 'react';
// import { ethers } from 'ethers';
// import Web3 from 'web3';
// import { StatusState, StatusContext, defaultStatusState } from '.';
// import { WATERLILY_CONTRACT_ADDRESS } from '@/definitions';
// import WaterlilyABI from '../abi/ArtistAttribution.sol/ArtistAttribution.json';
// import { INITIAL_TRANSACTION_STATE } from '@/utils/definitions/consts';

// const plainSubmit = async () => {
// const artistID = 'YOUR_ARTIST_ID';
// const prompt = 'YOUR_PROMPT';
// // const value = ethers.utils.parseUnits('0.1', 18);
// const value = ethers.utils.parseEther('0.1'); // Set the amount of ether you want to send here

// const provider = new ethers.providers.Web3Provider(window.ethereum);
// const signer = provider.getSigner();
// const waterlilyContract = new ethers.Contract(
// WATERLILY_CONTRACT_ADDRESS,
// WaterlilyABI.abi,
// signer
// );
// // Create the transaction object with the specified gas limit
// const tx = {
// to: waterlilyContract.address,
// from: await signer.getAddress(),
// value: value.toString(),
// data: waterlilyContract.interface.encodeFunctionData('StableDiffusion', [
// artistID,
// prompt,
// ]),
// gasLimit: 900000, // Set your desired gas limit here
// };

// // Send the transaction using window.ethereum
// window.ethereum
// .request({
// method: 'eth_sendTransaction',
// params: [tx],
// })
// .then((txHash: string) => {
// console.log(`Transaction sent: ${txHash}`);
// })
// .catch((error: Error) => {
// console.error(`Error sending transaction: ${error}`);
// });
// };

// const testNetwork = async () => {
// // const rpcEndpointUrl = 'https://example.com/rpc';
// // const provider = new ethers.providers.JsonRpcProvider(rpcEndpointUrl);

// // provider
// // .getBlockNumber()
// // .then((blockNumber) => {
// // console.log(
// // `The latest block number on ${rpcEndpointUrl} is ${blockNumber}`
// // );
// // })
// // .catch((error) => {
// // console.error(`Failed to connect to ${rpcEndpointUrl}: ${error}`);
// // });

// if (window.ethereum) {
// const provider = new ethers.providers.Web3Provider(window.ethereum);
// const network = await provider.getNetwork();
// console.log('network', network); // will log information about the network if connected
// if (network) {
// return true;
// }
// } else {
// console.log('No ethereum provider detected');
// }
// return false;
// };

// const submitJob = async (
// prompt: string,
// artistid: string,
// timeout: number = 60000 // default timeout of 60 seconds
// ) => {
// const provider = new ethers.providers.Web3Provider(window.ethereum);
// const signer = provider.getSigner();
// const waterlilyContract = new ethers.Contract(
// WATERLILY_CONTRACT_ADDRESS,
// WaterlilyABI.abi,
// signer
// );

// const k = ethers.utils.parseUnits('0.1', 18);
// const imageCost = ethers.utils.parseEther('0.1');
// const gasLimit: string = ethers.utils.hexlify(9000000);

// try {
// // setStatusState({
// // ...statusState,
// // isLoading: 'Submitting job to the network ...',
// // isMessage: false,
// // message: { title: '', description: '' },
// // });

// const tx = await waterlilyContract.StableDiffusion(prompt, artistid, {
// value: k,
// gasLimit: gasLimit,
// });
// console.log('tx', tx);

// // setStatusState({
// // ...statusState,
// // isLoading: `Waiting for the transaction ${tx.hash} to be included in a block...`,
// // isMessage: false,
// // message: { title: '', description: '' },
// // });

// const timeoutPromise = new Promise((\_, reject) =>
// setTimeout(() => {
// reject(new Error('Transaction timed out'));
// }, timeout)
// );

// try {
// const receipt: ethers.ContractReceipt = await Promise.race([
// tx.wait(),
// timeoutPromise,
// ]);

// // setStatusState({
// // ...statusState,
// // isLoading: '',
// // isMessage: true,
// // message: {
// // title: `Transaction confirmed: ${receipt.transactionHash}`,
// // description: 'Your job has been submitted to the network.',
// // },
// // });
// } catch (error: any) {
// console.log('there was an error or timeout', error);
// if (error?.message === 'Transaction timed out') {
// //cancel the transaction
// await signer.sendTransaction({
// to: tx.to,
// nonce: await signer.getTransactionCount(),
// gasPrice: 0,
// gasLimit: 21000,
// value: 0,
// });
// // setStatusState({
// // isError: 'Transaction timed out',
// // isLoading: '',
// // isMessage: true,
// // message: {
// // title: 'Transaction timed out',
// // description:
// // 'The transaction took too long to confirm. Please try again later.',
// // },
// // });
// } else {
// // setStatusState({
// // isError: 'Receipt: Transaction failed',
// // isLoading: '',
// // isMessage: true,
// // message: {
// // title: 'Transaction failed',
// // description:
// // 'There was an error submitting your job to the network. Please try again later.',
// // },
// // });
// }
// }
// } catch (error) {
// console.log('there was an tx error', error);
// // setStatusState({
// // isError: 'TX: Transaction failed',
// // isLoading: '',
// // isMessage: true,
// // message: {
// // title: 'Transaction failed',
// // description:
// // 'There was an error submitting getting tx from the network. Please try again later.',
// // },
// // });
// }
// };

// //works
// const getImageIds = async () => {
// // const provider = new ethers.providers.Web3Provider(window.ethereum);
// // const signer = provider.getSigner();
// //connect to contract in write mode
// const provider = new ethers.providers.JsonRpcProvider(
// 'https://rpc.ankr.com/filecoin_testnet'
// );
// const waterlilyContract = new ethers.Contract(
// WATERLILY_CONTRACT_ADDRESS,
// WaterlilyABI.abi,
// provider
// );

// const ids = await waterlilyContract.getImageIDs();
// console.log(ids);
// };

// const callSD = async (prompt: string, artistid: string) => {
// //rpc.ankr.com/filecoin_testnet
// const provider = new ethers.providers.Web3Provider(window.ethereum);
// const signer = provider.getSigner();
// // const signer = new ethers.providers.Web3Provider(
// // window.ethereum
// // ).getSigner();
// const waterlilyContract = new ethers.Contract(
// WATERLILY_CONTRACT_ADDRESS,
// WaterlilyABI.abi,
// signer
// );

// // Define the function to call the method
// const value = ethers.utils.parseEther('0.1'); // Set the amount of ether you want to send here

// try {
// const tx = await waterlilyContract.StableDiffusion(artistid, prompt, {
// value: value,
// });
// console.log(tx.hash); // Print the transaction hash
// return await tx.wait();
// } catch (error) {
// console.log(error);
// }
// };

// const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

// // estimate gas cost for the transaction
// // const estimatedGas = await provider.estimateGas({
// // to: WATERLILY_CONTRACT_ADDRESS,
// // value: imageCost,
// // });
// // const estimatedGasCost =
// // await waterlilyContract.estimateGas.StableDiffusion(artistid, prompt);
// // console.log('estimated gas cost', estimatedGasCost);

// // declare let window: any;
// // import React, {
// // createContext,
// // useState,
// // Dispatch,
// // SetStateAction,
// // useContext,
// // useEffect,
// // } from 'react';
// // import { ethers } from 'ethers';
// // import { StatusContext, defaultStatusState } from '.';
// // import { WATERLILY_CONTRACT_ADDRESS } from '@/definitions';
// // import WaterlilyABI from '../abi/ArtistAttribution.sol/ArtistAttribution.json';

// // interface StableDiffusionState {
// // isLoading: boolean;
// // isError: string | null;
// // data?: any;
// // }

// // interface StableDiffusionContextValue {
// // stableDiffusionState?: StableDiffusionState;
// // setStableDiffusionState: Dispatch<SetStateAction<StableDiffusionState>>;
// // runStableDiffusionJob: (prompt: string, artistId: string) => Promise<void>;
// // }

// // export const defaultStableDiffusionState = {
// // stableDiffusionState: { isLoading: false, isError: null, data: null },
// // setStableDiffusionState: () => {},
// // runStableDiffusionJob: async () => {},
// // };

// // interface MyContextProviderProps {
// // children: React.ReactNode;
// // }

// // export const StableDiffusionContext =
// // createContext<StableDiffusionContextValue>(defaultStableDiffusionState);

// // export const StableDiffusionContextProvider = ({
// // children,
// // }: MyContextProviderProps) => {
// // const [stableDiffusionState, setStableDiffusionState] =
// // useState<StableDiffusionState>({
// // isLoading: false,
// // isError: null,
// // data: null,
// // });
// // const { statusState = defaultStatusState.statusState, setStatusState } =
// // useContext(StatusContext);

// // useEffect(() => {
// // console.log(statusState);
// // }, [statusState]);

// // const runStableDiffusionJob = async (prompt: string, artistid: string) => {
// // setStatusState({
// // ...defaultStatusState.statusState,
// // isError: '',
// // isLoading: 'Connecting to Waterlily Contract..',
// // });
// // if (!window.ethereum) {
// // setStatusState({
// // ...statusState,
// // isMessage: true,
// // message: {
// // title: 'Web3 not available',
// // description:
// // 'Please install and unlock a Web3 provider in your browser to use this application.',
// // },
// // });
// // return;
// // }

// // const provider = new ethers.providers.Web3Provider(window.ethereum);
// // const signer = provider.getSigner();
// // //connect to contract in write mode
// // const waterlilyContract = new ethers.Contract(
// // WATERLILY_CONTRACT_ADDRESS,
// // WaterlilyABI.abi,
// // signer
// // );

// // // const imageCost = ethers.utils.parseUnits('0.1', 18); // Convert 100 to the appropriate unit of the token with 18 decimal places
// // const imageCost = ethers.utils.parseEther('0.1');

// // //GasLimit' field cannot be less than the cost of storing a message on chain 300000 < 417863"}}}'
// // const gasLimit: string = ethers.utils.hexlify(9000000);
// // setStatusState({
// // ...statusState,
// // isLoading: 'Submitting job to the FVM network ...',
// // });

// // const value = ethers.utils.parseEther('0.1'); // Set the amount of ether you want to send here

// // try {
// // const tx = await waterlilyContract.StableDiffusion(artistid, prompt, {
// // value: value,
// // });
// // console.log('got tx hash', tx.hash); // Print the transaction hash
// // const receipt = await tx.wait();
// // console.log('got receipt', receipt);
// // setStatusState({
// // ...statusState,
// // isLoading: '',
// // isMessage: true,
// // message: {
// // title: 'TX successful on network',
// // description: `Receipt:`,
// // },
// // });
// // } catch (error) {
// // console.log(error);
// // setStatusState({ ...statusState, isLoading: '', isError: 'yep error' });
// // }

// // // try {
// // // const tx = await waterlilyContract.StableDiffusion(prompt, artistid, {
// // // value: imageCost,
// // // // gasLimit: gasLimit,
// // // });

// // // setStatusState({
// // // ...statusState,
// // // isLoading: 'Waiting for the transaction to be included in a block...',
// // // isMessage: true,
// // // message: {
// // // title: `Transaction ${tx.hash} sent.`,
// // // description:
// // // 'Waiting for the transaction to be included in a block...',
// // // },
// // // });

// // // const receipt = await tx.wait();
// // // console.log('receipt done', receipt);

// // // setStatusState({
// // // ...statusState,
// // // isLoading: 'Receipt confirmed. Running on Bacalhau',
// // // isMessage: true,
// // // message: {
// // // title: `Transaction ${tx.hash} confirmed. Receipt: ${receipt}`,
// // // description: 'Transaction successfully mined.',
// // // },
// // // });
// // // } catch (error: any) {
// // // console.error(error);

// // // setStatusState({
// // // ...statusState,
// // // isLoading: false,
// // // isMessage: true,
// // // message: {
// // // title: 'Transaction failed.',
// // // description: error.message,
// // // },
// // // });
// // // }

// // // waterlilyContract
// // // .StableDiffusion(prompt, artistid, {
// // // value: imageCost,
// // // gasLimit: gasLimit,
// // // })
// // // .then(async (tx: ethers.ContractTransaction) => {
// // // console.log('stable diffusion res', tx);
// // // setStatusState({
// // // ...statusState,
// // // isLoading: `Waiting for the transaction ${tx.hash} to be included in a block ...`,
// // // //could include blockExplorer link here with tx
// // // });
// // // const receipt: ethers.ContractReceipt = await tx.wait();
// // // console.log('receipt done', receipt);
// // // setStatusState({
// // // ...statusState,
// // // isLoading: '',
// // // isMessage: true,
// // // message: {
// // // title: `tx: ${receipt}`,
// // // description: 'got tx',
// // // },
// // // });

// // // // await tx
// // // // .wait()
// // // // .then((receipt: any) => {
// // // // console.log('TX done');
// // // // setStatusState({
// // // // ...statusState,
// // // // isLoading: '',
// // // // isMessage: true,
// // // // message: {
// // // // title: `tx: ${tx}`,
// // // // description: 'got tx',
// // // // },
// // // // });
// // // // })
// // // // .catch((err: any) => {
// // // // console.log('err in tx.wait()');
// // // // setStatusState({
// // // // ...statusState,
// // // // isLoading: '',
// // // // isError: `'An error occurred calling the contract stable diffusion method' ${err.message}`,
// // // // });
// // // // });
// // // // //don't want to stop loading until results come back hmm
// // // })
// // // .catch((err: Error) => {
// // // console.log('err', err);
// // // setStatusState({
// // // ...statusState,
// // // isLoading: '',
// // // isError:
// // // 'An error occurred calling the contract stable diffusion method',
// // // // + err.code.toString() +
// // // // err.message +
// // // // err.data.message,
// // // });
// // // });

// // // await delay(5000);
// // // console.log('delay over', stableDiffusionState);
// // // await fetch('https://jsonplaceholder.typicode.com/posts')
// // // .then((res) => res.json())
// // // .then((data) => {
// // // console.log('stable diffuion done', stableDiffusionState);
// // // setStableDiffusionState({ ...stableDiffusionState, data: data });
// // // })
// // // .finally(() => {
// // // setStableDiffusionState({ ...stableDiffusionState, isLoading: false });
// // // })
// // // .catch((err) => {
// // // console.log('err stable diffusion', err);
// // // setStableDiffusionState({
// // // isLoading: false,
// // // isError: err || 'error',
// // // data: null,
// // // });
// // // });
// // };

// // const stableDiffusionContextValue: StableDiffusionContextValue = {
// // stableDiffusionState,
// // setStableDiffusionState,
// // runStableDiffusionJob,
// // };

// // return (
// // <StableDiffusionContext.Provider value={stableDiffusionContextValue}>
// // {children}
// // </StableDiffusionContext.Provider>
// // );
// // };

// /\*
// const createTwitterLink = async (imageUrl: string) => {
// //https://ai-art-files.cluster.world/job/13/combined.jpg
// console.log('imageUrl', imageUrl);
// const tweetText = `Check out the ethical AI art I created on waterlily.ai!\n\n`;
// const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
//       tweetText
//     )}&url=${encodeURIComponent(
//       imageUrl
//     )}&hashtags=WaterLilyAI&ref_src=twsrc%5Etfw&related=twitterapi%2Ctwitter`;

// const response = await fetch(imageUrl);
// const imageBlob = await response.blob();
// const base64String = await convertBlobToBase64(imageBlob);
// const tweetImageUrl = `data:${imageBlob.type};base64,${base64String}`;

// window.open(
// tweetUrl + `&amp;media=${encodeURIComponent(tweetImageUrl)}`,
// '',
// 'width=600, height=400'
// );
// // const response = await fetch(imageUrl);
// // const imageBlob = await response.blob();
// // const base64String = await convertBlobToBase64(imageBlob);
// // const dataUri = `data:${imageBlob.type};base64,${base64String}`;
// // const tweetText = `Check out the ethical AI art I created on waterlily.ai! \n\n✍️ ${imagePrompt} \n\n🎨 ${imageArtist.name} -> 💸 0.05 $FIL paid \n\n`;
// // const base64Image = imageUrl.replace(
// // /^data:image\/(png|jpeg|jpg);base64,/,
// // ''
// // );
// // const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
//     //   tweetText
//     // )}&url=${encodeURIComponent(
//     //   window.location.href
//     // )}&media=${encodeURIComponent(base64Image)}`;
// setTwitterLink(tweetUrl);
// // const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
//     //   tweetText
//     // )}&url=${encodeURIComponent(dataUri)}`;
// // setTwitterLink(tweetUrl);
// };

// // const createTwitterLink = async () => {
// // const tweetText = `Check out the ethical AI art I created on waterlily.ai! \n\n✍️ ${imagePrompt} \n\n🎨 ${imageArtist.name} \n\n`;
// // const response = await fetch(quickImages[0]);
// // const imageBlob = await response.blob();
// // const reader = new FileReader();
// // reader.readAsArrayBuffer(imageBlob);
// // return new Promise((resolve) => {
// // reader.onloadend = () => {
// // const buf = reader.result as ArrayBuffer;
// // const base64String = buf ? Buffer.from(buf).toString('base64') : '';
// // const tweetImageUrl = `https://example.com/images/my-image.jpg`;
// // const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
//   //         tweetText
//   //       )}&url=${encodeURIComponent(tweetImageUrl)}`;
// // resolve(tweetUrl);
// // };
// // }).then((tweetUrl) => {
// // const url = tweetUrl as string;
// // setTwitterLink(url);
// // });
// // };

// \*/
// // export const convertBlobToBase64 = (blob: any) =>
// // new Promise((resolve, reject) => {
// // const reader = new FileReader();
// // reader.onerror = reject;
// // reader.onload = () => {
// // resolve(reader.result);
// // };
// // reader.readAsDataURL(blob);
// // });
