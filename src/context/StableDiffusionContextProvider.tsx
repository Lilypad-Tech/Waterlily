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
import { StatusContext, defaultStatusState } from '.';
import { WATERLILY_CONTRACT_ADDRESS } from '@/definitions';
import WaterlilyABI from '../abi/ArtistAttribution.sol/ArtistAttribution.json';

interface StableDiffusionState {
  isLoading: boolean;
  isError: string | null;
  data?: any;
}

interface StableDiffusionContextValue {
  stableDiffusionState?: StableDiffusionState;
  setStableDiffusionState: Dispatch<SetStateAction<StableDiffusionState>>;
  runStableDiffusionJob: (prompt: string, artistId: string) => Promise<void>;
}

export const defaultStableDiffusionState = {
  stableDiffusionState: { isLoading: false, isError: null, data: null },
  setStableDiffusionState: () => {},
  runStableDiffusionJob: async () => {},
};

interface MyContextProviderProps {
  children: React.ReactNode;
}

export const StableDiffusionContext =
  createContext<StableDiffusionContextValue>(defaultStableDiffusionState);

export const StableDiffusionContextProvider = ({
  children,
}: MyContextProviderProps) => {
  const [stableDiffusionState, setStableDiffusionState] =
    useState<StableDiffusionState>({
      isLoading: false,
      isError: null,
      data: null,
    });
  const { statusState = defaultStatusState.statusState, setStatusState } =
    useContext(StatusContext);

  useEffect(() => {
    console.log(statusState);
  }, [statusState]);

  const runStableDiffusionJob = async (prompt: string, artistid: string) => {
    setStatusState({
      ...defaultStatusState.statusState,
      isError: '',
      isLoading: 'Connecting to Waterlily Contract..',
    });
    if (!window.ethereum) {
      setStatusState({
        ...statusState,
        isMessage: true,
        message: {
          title: 'Web3 not available',
          description:
            'Please install and unlock a Web3 provider in your browser to use this application.',
        },
      });
      return;
    }

    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //connect to contract in write mode
    const waterlilyContract = new ethers.Contract(
      WATERLILY_CONTRACT_ADDRESS,
      WaterlilyABI.abi,
      signer
    );

    // const imageCost = ethers.utils.parseUnits('0.1', 18); // Convert 100 to the appropriate unit of the token with 18 decimal places
    const imageCost = ethers.utils.parseEther('0.1');

    //GasLimit' field cannot be less than the cost of storing a message on chain 300000 < 417863"}}}'
    const gasLimit: string = ethers.utils.hexlify(9000000);
    setStatusState({
      ...statusState,
      isLoading: 'Submitting job to the FVM network ...',
    });

    const value = ethers.utils.parseEther('0.1'); // Set the amount of ether you want to send here

    try {
      const tx = await waterlilyContract.StableDiffusion(artistid, prompt, {
        value: value,
      });
      console.log('got tx hash', tx.hash); // Print the transaction hash
      const receipt = await tx.wait();
      console.log('got receipt', receipt);
      setStatusState({
        ...statusState,
        isLoading: '',
        isMessage: true,
        message: {
          title: 'TX successful on network',
          description: `Receipt:`,
        },
      });
    } catch (error) {
      console.log(error);
      setStatusState({ ...statusState, isLoading: '', isError: 'yep error' });
    }

    // try {
    //   const tx = await waterlilyContract.StableDiffusion(prompt, artistid, {
    //     value: imageCost,
    //     // gasLimit: gasLimit,
    //   });

    //   setStatusState({
    //     ...statusState,
    //     isLoading: 'Waiting for the transaction to be included in a block...',
    //     isMessage: true,
    //     message: {
    //       title: `Transaction ${tx.hash} sent.`,
    //       description:
    //         'Waiting for the transaction to be included in a block...',
    //     },
    //   });

    //   const receipt = await tx.wait();
    //   console.log('receipt done', receipt);

    //   setStatusState({
    //     ...statusState,
    //     isLoading: 'Receipt confirmed. Running on Bacalhau',
    //     isMessage: true,
    //     message: {
    //       title: `Transaction ${tx.hash} confirmed. Receipt: ${receipt}`,
    //       description: 'Transaction successfully mined.',
    //     },
    //   });
    // } catch (error: any) {
    //   console.error(error);

    //   setStatusState({
    //     ...statusState,
    //     isLoading: false,
    //     isMessage: true,
    //     message: {
    //       title: 'Transaction failed.',
    //       description: error.message,
    //     },
    //   });
    // }

    // waterlilyContract
    //   .StableDiffusion(prompt, artistid, {
    //     value: imageCost,
    //     gasLimit: gasLimit,
    //   })
    //   .then(async (tx: ethers.ContractTransaction) => {
    //     console.log('stable diffusion res', tx);
    //     setStatusState({
    //       ...statusState,
    //       isLoading: `Waiting for the transaction ${tx.hash} to be included in a block ...`,
    //       //could include blockExplorer link here with tx
    //     });
    //     const receipt: ethers.ContractReceipt = await tx.wait();
    //     console.log('receipt done', receipt);
    //     setStatusState({
    //       ...statusState,
    //       isLoading: '',
    //       isMessage: true,
    //       message: {
    //         title: `tx: ${receipt}`,
    //         description: 'got tx',
    //       },
    //     });

    //     //   await tx
    //     //     .wait()
    //     //     .then((receipt: any) => {
    //     //       console.log('TX done');
    //     //       setStatusState({
    //     //         ...statusState,
    //     //         isLoading: '',
    //     //         isMessage: true,
    //     //         message: {
    //     //           title: `tx: ${tx}`,
    //     //           description: 'got tx',
    //     //         },
    //     //       });
    //     //     })
    //     //     .catch((err: any) => {
    //     //       console.log('err in tx.wait()');
    //     //       setStatusState({
    //     //         ...statusState,
    //     //         isLoading: '',
    //     //         isError: `'An error occurred calling the contract stable diffusion method' ${err.message}`,
    //     //       });
    //     //     });
    //     //   //don't want to stop loading until results come back hmm
    //   })
    //   .catch((err: Error) => {
    //     console.log('err', err);
    //     setStatusState({
    //       ...statusState,
    //       isLoading: '',
    //       isError:
    //         'An error occurred calling the contract stable diffusion method',
    //       // + err.code.toString() +
    //       // err.message +
    //       // err.data.message,
    //     });
    //   });

    // await delay(5000);
    // console.log('delay over', stableDiffusionState);
    // await fetch('https://jsonplaceholder.typicode.com/posts')
    //   .then((res) => res.json())
    //   .then((data) => {
    //     console.log('stable diffuion done', stableDiffusionState);
    //     setStableDiffusionState({ ...stableDiffusionState, data: data });
    //   })
    //   .finally(() => {
    //     setStableDiffusionState({ ...stableDiffusionState, isLoading: false });
    //   })
    //   .catch((err) => {
    //     console.log('err stable diffusion', err);
    //     setStableDiffusionState({
    //       isLoading: false,
    //       isError: err || 'error',
    //       data: null,
    //     });
    //   });
  };

  const stableDiffusionContextValue: StableDiffusionContextValue = {
    stableDiffusionState,
    setStableDiffusionState,
    runStableDiffusionJob,
  };

  return (
    <StableDiffusionContext.Provider value={stableDiffusionContextValue}>
      {children}
    </StableDiffusionContext.Provider>
  );
};
