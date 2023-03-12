declare let window: any;
import React, {
  createContext,
  useState,
  Dispatch,
  SetStateAction,
  useContext,
} from 'react';
import { ethers } from 'ethers';
import { StatusContext, defaultStatusState } from '.';
import { WATERLILY_CONTRACT_ADDRESS } from '@/definitions';
import WaterlilyABI from '../abi/ArtistAttribution.sol/ArtistAttribution.json';
import { INITIAL_TRANSACTION_STATE } from '@/utils/definitions/consts';

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

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

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

  const runStableDiffusionJob = async (prompt: string, artistid: string) => {
    setStatusState({
      ...statusState,
      isLoading: 'Connecting to Waterlily Contract..',
    });
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      //connect to contract in write mode
      const waterlilyContract = new ethers.Contract(
        WATERLILY_CONTRACT_ADDRESS,
        WaterlilyABI.abi,
        signer
      );
      // estimate gas cost for the transaction - ERRORS
      // const estimatedGasCost =
      //   await waterlilyContract.estimateGas.StableDiffusion(artistid, prompt);
      // console.log('estimated gas cost', estimatedGasCost);

      /*
      {code: -32603, message: "Non-200 status code: '500'", data: {…}}
      */
      const imageCost = ethers.utils.parseEther('0.1');
      //GasLimit' field cannot be less than the cost of storing a message on chain 300000 < 417863"}}}'
      const gasLimit: string = ethers.utils.hexlify(9000000);
      setStatusState({
        ...statusState,
        isLoading: 'Submitting job to the network ...',
      });
      waterlilyContract
        .StableDiffusion(prompt, artistid, {
          value: imageCost,
          gasLimit: gasLimit,
        })
        .then(async (tx: ethers.ContractTransaction) => {
          console.log('stable diffusion res', tx);
          setStatusState({
            ...statusState,
            isLoading: `Waiting for the transaction ${tx.hash} to be included in a block ...`,
            //could include blockExplorer link here with tx
          });
          const receipt: ethers.ContractReceipt = await tx.wait();
          console.log('receipt done', receipt);
          setStatusState({
            ...statusState,
            isLoading: '',
            isMessage: true,
            message: {
              title: `tx: ${receipt}`,
              description: 'got tx',
            },
          });

          //   await tx
          //     .wait()
          //     .then((receipt: any) => {
          //       console.log('TX done');
          //       setStatusState({
          //         ...statusState,
          //         isLoading: '',
          //         isMessage: true,
          //         message: {
          //           title: `tx: ${tx}`,
          //           description: 'got tx',
          //         },
          //       });
          //     })
          //     .catch((err: any) => {
          //       console.log('err in tx.wait()');
          //       setStatusState({
          //         ...statusState,
          //         isLoading: '',
          //         isError: `'An error occurred calling the contract stable diffusion method' ${err.message}`,
          //       });
          //     });
          //   //don't want to stop loading until results come back hmm
        })
        .catch((err: Error) => {
          console.log('err', err);
          setStatusState({
            ...statusState,
            isLoading: '',
            isError:
              'An error occurred calling the contract stable diffusion method',
            // + err.code.toString() +
            // err.message +
            // err.data.message,
          });
        });
    }

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
